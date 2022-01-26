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
            let prevParticipants = participants
                ? participants?.filter(
                      (participant) => participant !== dominantSpeaker
                  )
                : [];
            setParticipants([dominantSpeaker, ...prevParticipants]);
        }
        return () => setParticipants(null);
    }, [dominantSpeaker]);

    useEffect(() => {
        if (room) {
            const participantConnected = (participant) =>
                setParticipants([...participants, participant]);
            const participantDisconnected = (participant) =>
                setParticipants(participants?.filter((p) => p !== participant));
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
