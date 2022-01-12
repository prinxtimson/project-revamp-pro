import React, { createContext, useContext, useReducer, useState } from "react";
import { settingsReducer, initialSettings } from "./settingsReducer.js";
import useActiveSinkId from "./useActiveSinkId";

export const StateContext = createContext(null);

export default function AppStateProvider(props) {
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [activeSinkId, setActiveSinkId] = useActiveSinkId();
    const [settings, dispatchSetting] = useReducer(
        settingsReducer,
        initialSettings
    );
    const [roomType, setRoomType] = useState();

    let contextValue = {
        error,
        setError,
        isFetching,
        activeSinkId,
        setActiveSinkId,
        settings,
        dispatchSetting,
        roomType,
    };

    contextValue = {
        ...contextValue,
        getToken: async (name, room) => {
            let token = window[`${room}_token`];

            return { token };
        },
        updateRecordingRules: async (room_sid, rules) => {
            const endpoint =
                process.env.REACT_APP_TOKEN_ENDPOINT || "/recordingrules";

            return fetch(endpoint, {
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ room_sid, rules }),
                method: "POST",
            })
                .then(async (res) => {
                    const jsonResponse = await res.json();

                    if (!res.ok) {
                        const recordingError = new Error(
                            jsonResponse.error?.message ||
                                "There was an error updating recording rules"
                        );
                        recordingError.code = jsonResponse.error?.code;
                        return Promise.reject(recordingError);
                    }

                    return jsonResponse;
                })
                .catch((err) => setError(err));
        },
    };

    const getToken = (name, room) => {
        setIsFetching(true);
        return contextValue
            .getToken(name, room)
            .then((res) => {
                setRoomType(res.room_type);
                setIsFetching(false);
                return res;
            })
            .catch((err) => {
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
