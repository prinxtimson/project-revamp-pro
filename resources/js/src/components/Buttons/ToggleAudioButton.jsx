import React from "react";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Hidden from "@mui/material/Hidden";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import Tooltip from "@mui/material/Tooltip";

import useLocalAudioToggle from "../../hooks/useLocalAudioToggle";
import useVideoContext from "../../hooks/useVideoContext";

export default function ToggleAudioButton(props) {
    const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
    const { localTracks } = useVideoContext();
    const hasAudioTrack = localTracks.some((track) => track.kind === "audio");

    return (
        <>
            <Hidden smDown>
                <Button
                    className={props.className}
                    onClick={toggleAudioEnabled}
                    disabled={!hasAudioTrack || props.disabled}
                    startIcon={isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
                    data-cy-audio-toggle
                >
                    {!hasAudioTrack
                        ? "No Audio"
                        : isAudioEnabled
                        ? "Mute"
                        : "Unmute"}
                </Button>
            </Hidden>
            <Hidden smUp>
                <Tooltip
                    title={
                        !hasAudioTrack
                            ? "No Audio"
                            : isAudioEnabled
                            ? "Mute"
                            : "Unmute"
                    }
                >
                    <span>
                        <IconButton
                            className={props.className}
                            onClick={toggleAudioEnabled}
                            disabled={!hasAudioTrack || props.disabled}
                            data-cy-audio-toggle
                            color="primary"
                            size="large"
                        >
                            {isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>
                    </span>
                </Tooltip>
            </Hidden>
        </>
    );
}
