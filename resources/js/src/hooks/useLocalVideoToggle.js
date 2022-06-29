import { useCallback, useState } from "react";
import useVideoContext from "./useVideoContext";

export default function useLocalVideoToggle() {
    const {
        room,
        localTracks,
        getLocalVideoTrack,
        removeLocalVideoTrack,
        onError,
    } = useVideoContext();
    const localParticipant = room?.localParticipant;
    const videoTrack = localTracks.find(
        (track) => !track.name.includes("screen") && track.kind === "video"
    );
    const [isPublishing, setIspublishing] = useState(false);

    const toggleVideo = () => {
        if (!isPublishing) {
            if (videoTrack) {
                const localTrackPublication =
                    localParticipant?.unpublishTrack(videoTrack);

                localParticipant?.emit(
                    "trackUnpublished",
                    localTrackPublication
                );
                removeLocalVideoTrack();
            } else {
                setIspublishing(true);
                getLocalVideoTrack()
                    .then((track) =>
                        localParticipant?.publishTrack(track, {
                            priority: "low",
                        })
                    )
                    .catch(onError)
                    .finally(() => {
                        setIspublishing(false);
                    });
            }
        }
    };

    const toggleVideoEnabled = useCallback(() => {
        toggleVideo();
    }, [
        videoTrack,
        localParticipant,
        getLocalVideoTrack,
        isPublishing,
        onError,
        removeLocalVideoTrack,
        room,
    ]);

    return [videoTrack, toggleVideoEnabled];
}
