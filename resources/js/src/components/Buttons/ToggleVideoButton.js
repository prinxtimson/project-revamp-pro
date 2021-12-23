import React, { useCallback, useRef } from "react";

import Button from "@mui/material/Button";
import VideoOffIcon from "@mui/icons-material/VideocamOff";
import VideoOnIcon from "@mui/icons-material/Videocam";

import useDevices from "../../hooks/useDevices";
import useLocalVideoToggle from "../../hooks/useLocalVideoToggle";

export default function ToggleVideoButton(props) {
    const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
    const lastClickTimeRef = useRef(0);
    const { hasVideoInputDevices } = useDevices();

    const toggleVideo = useCallback(() => {
        if (Date.now() - lastClickTimeRef.current > 500) {
            lastClickTimeRef.current = Date.now();
            toggleVideoEnabled();
        }

        return () => {
            lastClickTimeRef.current = 0;
        };
    }, [toggleVideoEnabled]);

    return (
        <Button
            className={props.className}
            onClick={toggleVideo}
            disabled={!hasVideoInputDevices || props.disabled}
            startIcon={isVideoEnabled ? <VideoOnIcon /> : <VideoOffIcon />}
        >
            {!hasVideoInputDevices
                ? "No Video"
                : isVideoEnabled
                ? "Stop Video"
                : "Start Video"}
        </Button>
    );
}
