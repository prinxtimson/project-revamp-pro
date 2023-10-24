import React, { useState } from "react";
import {
    DEFAULT_VIDEO_CONSTRAINTS,
    SELECTED_VIDEO_INPUT_KEY,
} from "../constants";
import { FormControl, MenuItem, Typography, Select } from "@mui/material";
import { makeStyles } from "@mui/styles";
import VideoTrack from "./VideoTrack";
import useDevices from "../hooks/useDevices";
import useMediaStreamTrack from "../hooks/useMediaStreamTrack";
import useVideoContext from "../hooks/useVideoContext";

const useStyles = makeStyles({
    preview: {
        width: "300px",
        maxHeight: "200px",
        margin: "0.5em auto",
        "& video": {
            maxHeight: "200px",
        },
    },
});

export default function VideoInputList() {
    const classes = useStyles();
    const { videoInputDevices } = useDevices();
    const { localTracks } = useVideoContext();

    const localVideoTrack = localTracks.find((track) => track.kind === "video");
    const mediaStreamTrack = useMediaStreamTrack(localVideoTrack);
    const [storedLocalVideoDeviceId, setStoredLocalVideoDeviceId] = useState(
        window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY)
    );
    const localVideoInputDeviceId =
        mediaStreamTrack?.getSettings().deviceId || storedLocalVideoDeviceId;

    function replaceTrack(newDeviceId) {
        setStoredLocalVideoDeviceId(newDeviceId);
        window.localStorage.setItem(SELECTED_VIDEO_INPUT_KEY, newDeviceId);
        localVideoTrack?.restart({
            ...DEFAULT_VIDEO_CONSTRAINTS,
            deviceId: { exact: newDeviceId },
        });
    }

    return (
        <div>
            {localVideoTrack && (
                <div className={classes.preview}>
                    <VideoTrack isLocal track={localVideoTrack} />
                </div>
            )}
            {videoInputDevices.length > 1 ? (
                <FormControl fullWidth>
                    <Typography variant="subtitle2" gutterBottom>
                        Video Input
                    </Typography>
                    <Select
                        onChange={(e) => replaceTrack(e.target.value)}
                        value={localVideoInputDeviceId || ""}
                        variant="outlined"
                    >
                        {videoInputDevices.map((device) => (
                            <MenuItem
                                value={device.deviceId}
                                key={device.deviceId}
                            >
                                {device.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : (
                <>
                    <Typography variant="subtitle2" gutterBottom>
                        Video Input
                    </Typography>
                    <Typography>
                        {localVideoTrack?.mediaStreamTrack.label ||
                            "No Local Video"}
                    </Typography>
                </>
            )}
        </div>
    );
}
