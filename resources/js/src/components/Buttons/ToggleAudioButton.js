import React from "react";

import Button from "@mui/material/Button";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

import useLocalAudioToggle from "../../hooks/useLocalAudioToggle";
import useVideoContext from "../../hooks/useVideoContext";

export default function ToggleAudioButton(props) {
    const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
    const { localTracks } = useVideoContext();
    const hasAudioTrack = localTracks.some((track) => track.kind === "audio");

    return (
        <Button
            className={props.className}
            onClick={toggleAudioEnabled}
            disabled={!hasAudioTrack || props.disabled}
            startIcon={isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
            data-cy-audio-toggle
        >
            {!hasAudioTrack ? "No Audio" : isAudioEnabled ? "Mute" : "Unmute"}
        </Button>
    );
}
