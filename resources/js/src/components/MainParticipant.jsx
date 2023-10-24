import React from "react";
import MainParticipantInfo from "./MainParticipantInfo";
import ParticipantTracks from "./ParticipantTracks";
import useMainParticipant from "../hooks/useMainParticipant";
import useSelectedParticipant from "./VideoProvider/useSelectedParticipant";
import useScreenShareParticipant from "../hooks/useScreenShareParticipant";
import useVideoContext from "../hooks/useVideoContext";

const MainParticipant = () => {
    const mainParticipant = useMainParticipant();
    const { room } = useVideoContext();
    const localParticipant = room?.localParticipant;
    const [selectedParticipant] = useSelectedParticipant();
    const screenShareParticipant = useScreenShareParticipant();

    const videoPriority =
        (mainParticipant === selectedParticipant ||
            mainParticipant === screenShareParticipant) &&
        mainParticipant !== localParticipant
            ? "high"
            : null;

    return (
        <MainParticipantInfo participant={mainParticipant}>
            <ParticipantTracks
                participant={mainParticipant}
                videoOnly
                enableScreenShare={mainParticipant !== localParticipant}
                videoPriority={videoPriority}
                isLocalParticipant={mainParticipant === localParticipant}
            />
        </MainParticipantInfo>
    );
};

export default MainParticipant;
