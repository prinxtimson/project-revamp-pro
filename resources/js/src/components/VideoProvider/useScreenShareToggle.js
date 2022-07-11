import { useState, useCallback, useRef } from "react";

export default function useScreenShareToggle(room, onError) {
    const [isSharing, setIsSharing] = useState(false);
    const stopScreenShareRef = useRef(null);

    const shareScreen = useCallback(() => {
        navigator.mediaDevices
            .getDisplayMedia({
                audio: false,
                video: true,
            })
            .then((stream) => {
                const track = stream.getTracks()[0];

                room?.localParticipant
                    .publishTrack(track, { name: "screen", priority: "low" })
                    .then((trackPublication) => {
                        stopScreenShareRef.current = () => {
                            room?.localParticipant.unpublishTrack(track);
                            // TODO: remove this if the SDK is updated to emit this event
                            room?.localParticipant.emit(
                                "trackUnpublished",
                                trackPublication
                            );
                            track.stop();
                            setIsSharing(false);
                        };

                        track.onended = stopScreenShareRef.current;
                        setIsSharing(true);
                    })
                    .catch(onError);
            })
            .catch((error) => {
                // Don't display an error if the user closes the screen share dialog
                if (
                    error.message === "Permission denied by system" ||
                    (error.name !== "AbortError" &&
                        error.name !== "NotAllowedError")
                ) {
                    onError(error);
                }
            });
    }, [room, onError]);

    const toggleScreenShare = useCallback(() => {
        if (room) {
            !isSharing ? shareScreen() : stopScreenShareRef.current();
        }
    }, [isSharing, shareScreen, room]);

    return [isSharing, toggleScreenShare];
}
