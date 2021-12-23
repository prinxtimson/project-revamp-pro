import { useCallback, useEffect, useState } from "react";
import { DEFAULT_VIDEO_CONSTRAINTS } from "../constants";
import useDevices from "./useDevices";
import useMediaStreamTrack from "./useMediaStreamTrack";
import useVideoContext from "./useVideoContext";

export default function useFlipCameraToggle() {
    const { localTracks } = useVideoContext();
    const [supportsFacingMode, setSupportsFacingMode] = useState(false);
    const videoTrack = localTracks.find(
        (track) => !track.name.includes("screen") && track.kind === "video"
    );
    const mediaStreamTrack = useMediaStreamTrack(videoTrack);
    const { videoInputDevices } = useDevices();

    useEffect(() => {
        const currentFacingMode = mediaStreamTrack?.getSettings().facingMode;
        if (currentFacingMode && supportsFacingMode === false) {
            setSupportsFacingMode(true);
        }
    }, [mediaStreamTrack, supportsFacingMode]);

    const toggleFacingMode = useCallback(() => {
        const newFacingMode =
            mediaStreamTrack?.getSettings().facingMode === "user"
                ? "environment"
                : "user";
        videoTrack?.restart({
            ...DEFAULT_VIDEO_CONSTRAINTS,
            facingMode: newFacingMode,
        });
    }, [mediaStreamTrack, videoTrack]);

    return {
        flipCameraDisabled: !videoTrack,
        toggleFacingMode,
        flipCameraSupported: supportsFacingMode && videoInputDevices.length > 1,
    };
}
