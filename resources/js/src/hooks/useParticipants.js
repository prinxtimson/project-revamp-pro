import { useEffect, useState } from "react";
import useDominantSpeaker from "./useDominantSpeaker";
import useVideoContext from "./useVideoContext";

export default function useParticipants() {
    const { room } = useVideoContext();
    const dominantSpeaker = useDominantSpeaker();
    const [participants, setParticipants] = useState(
        Array.from(room?.participants.values())
    );

    useEffect(() => {
        if (dominantSpeaker) {
            setParticipants((prevParticipants) => [
                dominantSpeaker,
                ...prevParticipants?.filter(
                    (participant) => participant !== dominantSpeaker
                ),
            ]);
        }
        return () => setParticipants(null);
    }, [dominantSpeaker]);

    useEffect(() => {
        if (room) {
            const participantConnected = (participant) =>
                setParticipants((prevParticipants) => [
                    ...prevParticipants,
                    participant,
                ]);
            const participantDisconnected = (participant) =>
                setParticipants((prevParticipants) =>
                    prevParticipants?.filter((p) => p !== participant)
                );
            room.on("participantConnected", participantConnected);
            room.on("participantDisconnected", participantDisconnected);
            return () => {
                room.off("participantConnected", participantConnected);
                room.off("participantDisconnected", participantDisconnected);
            };
        }
    }, [room]);

    return participants;
}
