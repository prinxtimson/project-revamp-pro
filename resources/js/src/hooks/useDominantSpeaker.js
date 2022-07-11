import { useEffect, useState } from "react";
import useVideoContext from "./useVideoContext";

export default function useDominantSpeaker(includeNull = false) {
    const { room } = useVideoContext();
    const [dominantSpeaker, setDominantSpeaker] = useState(
        room?.dominantSpeaker
    );

    useEffect(() => {
        if (room) {
            const handleDominantSpeakerChanged = (newDominantSpeaker) => {
                if (includeNull || newDominantSpeaker !== null) {
                    setDominantSpeaker(newDominantSpeaker);
                }
            };

            const handleParticipantDisconnected = (participant) => {
                setDominantSpeaker((prevDominantSpeaker) => {
                    return prevDominantSpeaker === participant
                        ? null
                        : prevDominantSpeaker;
                });
            };

            room.on("dominantSpeakerChanged", handleDominantSpeakerChanged);
            room.on("participantDisconnected", handleParticipantDisconnected);
            return () => {
                room.off(
                    "dominantSpeakerChanged",
                    handleDominantSpeakerChanged
                );
                room.off(
                    "participantDisconnected",
                    handleParticipantDisconnected
                );

                setDominantSpeaker(null);
            };
        }
    }, [room, includeNull]);

    return dominantSpeaker;
}
