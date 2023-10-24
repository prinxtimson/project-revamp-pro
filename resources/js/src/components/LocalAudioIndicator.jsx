import React from "react";
import useVideoContext from "../hooks/useVideoContext";
import AudioLevelIndicator from "./AudioLevelIndicator";

const LocalAudioIndicator = () => {
    const { localTracks } = useVideoContext();
    const audioTrack = localTracks.find((track) => track.kind === "audio");

    return <AudioLevelIndicator audioTrack={audioTrack} />;
};

export default LocalAudioIndicator;
