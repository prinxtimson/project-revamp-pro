import React, { createContext, useCallback, useState } from "react";
import { SelectedParticipantProvider } from "./useSelectedParticipant";

import AttachVisibilityHandler from "./AttachVisibilityHandler";
import useHandleRoomDisconnection from "./useHandleRoomDisconnection";
import useHandleTrackPublicationFailed from "./useHandleTrackPublicationFailed";
import useLocalTracks from "./useLocalTracks";
import useRestartAudioTrackOnDeviceChange from "./useRestartAudioTrackOnDeviceChange";
import useRoom from "./useRoom";
import useScreenShareToggle from "./useScreenShareToggle";
import useMainRoom from "./useMainRoom";

export const VideoContext = createContext();

export const VideoProvider = ({ options, children, onError = () => {} }) => {
    const [error, setError] = useState();
    const onErrorCallback = useCallback(
        (err) => {
            setError(err.message);
            onError(err);
        },
        [onError]
    );

    const {
        localTracks,
        getLocalVideoTrack,
        getLocalAudioTrack,
        isAcquiringLocalTracks,
        removeLocalAudioTrack,
        removeLocalVideoTrack,
        getAudioAndVideoTracks,
    } = useLocalTracks();
    const { room, isConnecting, connect } = useRoom(
        localTracks,
        onErrorCallback,
        options
    );
    const { mainRoom, getMainRoom } = useMainRoom();

    const [isSharingScreen, toggleScreenShare] = useScreenShareToggle(
        room,
        onError
    );

    // Register callback functions to be called on room disconnect.
    useHandleRoomDisconnection(
        room,
        onError,
        removeLocalAudioTrack,
        removeLocalVideoTrack,
        isSharingScreen,
        toggleScreenShare
    );
    useHandleTrackPublicationFailed(room, onError);
    useRestartAudioTrackOnDeviceChange(localTracks);

    const videoTrack = localTracks.find(
        (track) => !track.name.includes("screen") && track.kind === "video"
    );

    return (
        <VideoContext.Provider
            value={{
                room,
                localTracks,
                isConnecting,
                error,
                onError: onErrorCallback,
                getLocalVideoTrack,
                getLocalAudioTrack,
                connect,
                isAcquiringLocalTracks,
                removeLocalVideoTrack,
                isSharingScreen,
                toggleScreenShare,
                getAudioAndVideoTracks,
                mainRoom,
                getMainRoom,
            }}
        >
            <SelectedParticipantProvider room={room}>
                {children}
            </SelectedParticipantProvider>
            <AttachVisibilityHandler />
        </VideoContext.Provider>
    );
};
