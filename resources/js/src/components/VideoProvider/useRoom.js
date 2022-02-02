import { isMobile } from "../../utils";
import Video from "twilio-video";
import { VideoRoomMonitor } from "@twilio/video-room-monitor";
import { useCallback, useEffect, useRef, useState } from "react";

// @ts-ignore
window.TwilioVideo = Video;

export default function useRoom(localTracks, onError, options) {
    const [room, setRoom] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const optionsRef = useRef(options);

    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const connect = useCallback(
        (token) => {
            setIsConnecting(true);
            console.log(token);
            return Video.connect(token, {
                ...optionsRef.current,
                tracks: localTracks,
            }).then(
                (newRoom) => {
                    setRoom(newRoom);
                    VideoRoomMonitor.registerVideoRoom(newRoom);
                    const disconnect = () => newRoom.disconnect();

                    newRoom.setMaxListeners(25);

                    newRoom.once("disconnected", () => {
                        setTimeout(() => setRoom(null));
                        window.removeEventListener("beforeunload", disconnect);

                        if (isMobile) {
                            window.removeEventListener("pagehide", disconnect);
                        }
                    });

                    // @ts-ignore
                    window.twilioRoom = newRoom;

                    newRoom.localParticipant.videoTracks.forEach(
                        (publication) => publication.setPriority("low")
                    );

                    setIsConnecting(false);

                    window.addEventListener("beforeunload", disconnect);

                    if (isMobile) {
                        window.addEventListener("pagehide", disconnect);
                    }
                },
                (error) => {
                    console.log(error);
                    onError(error);
                    setIsConnecting(false);
                }
            );
        },
        [localTracks, onError]
    );

    return { room, isConnecting, connect };
}
