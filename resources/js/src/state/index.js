import React, { createContext, useContext, useReducer, useState } from "react";
import { settingsReducer, initialSettings } from "./settingsReducer.js";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import useActiveSinkId from "./useActiveSinkId";

const axios = window.axios;

export const StateContext = createContext(null);

export default function AppStateProvider(props) {
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [isGalleryViewActive, setIsGalleryViewActive] = useLocalStorageState(
        "gallery-view-active-key",
        true
    );
    const [activeSinkId, setActiveSinkId] = useActiveSinkId();
    const [settings, dispatchSetting] = useReducer(
        settingsReducer,
        initialSettings
    );
    const [roomType, setRoomType] = useState();
    const [maxGalleryViewParticipants, setMaxGalleryViewParticipants] =
        useLocalStorageState("max-gallery-participants-key", 6);

    let contextValue = {
        error,
        setError,
        isFetching,
        activeSinkId,
        setActiveSinkId,
        settings,
        dispatchSetting,
        roomType,
        isGalleryViewActive,
        setIsGalleryViewActive,
        maxGalleryViewParticipants,
        setMaxGalleryViewParticipants,
    };

    contextValue = {
        ...contextValue,
        getToken: async (identity, room, password, breakoutRoom) => {
            try {
                let res = await axios.post("/api/room/token", {
                    identity,
                    room,
                    password,
                    breakoutRoom,
                });

                res.data.roomId = room;

                return res.data;
            } catch (error) {
                console.log(error);
            }
        },
        getRoom: async (room, password) => {
            const res = await axios.get(`/api/room/${room}`);

            return res.data;
        },
        updateRecordingRules: (room_sid, rules) => {
            return axios
                .post("/recordingrules", { room_sid, rules })
                .then((res) => {
                    if (!res.data) {
                        const recordingError = new Error(
                            res.error?.message ||
                                "There was an error updating recording rules"
                        );
                        recordingError.code = res.error?.code;
                        return Promise.reject(recordingError);
                    }

                    return res.data;
                })
                .catch((err) => {
                    console.log(err);
                    setError(err);
                });
        },
    };

    const getToken = (identity, room, password, breakoutRoom = null) => {
        setIsFetching(true);
        return contextValue
            .getToken(identity, room, password, breakoutRoom)
            .then((res) => {
                setRoomType("group");
                setIsFetching(false);
                return res;
            })
            .catch((err) => {
                console.log("state index get token");
                setError(err);
                setIsFetching(false);
                return Promise.reject(err);
            });
    };

    const updateRecordingRules = (room_sid, rules) => {
        setIsFetching(true);
        return contextValue
            .updateRecordingRules(room_sid, rules)
            .then((res) => {
                setIsFetching(false);
                return res;
            })
            .catch((err) => {
                console.log("state index recording");
                setError(err);
                setIsFetching(false);
                return Promise.reject(err);
            });
    };

    return (
        <StateContext.Provider
            value={{ ...contextValue, getToken, updateRecordingRules }}
        >
            {props.children}
        </StateContext.Provider>
    );
}

export function useAppState() {
    const context = useContext(StateContext);
    if (!context) {
        throw new Error("useAppState must be used within the AppStateProvider");
    }
    return context;
}
