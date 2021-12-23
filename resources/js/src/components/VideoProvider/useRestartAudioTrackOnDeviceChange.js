import { useEffect } from "react";

export default function useRestartAudioTrackOnDeviceChange(localTracks) {
    const audioTrack = localTracks.find((track) => track.kind === "audio");

    useEffect(() => {
        const handleDeviceChange = () => {
            if (audioTrack?.mediaStreamTrack.readyState === "ended") {
                audioTrack.restart({});
            }
        };

        navigator.mediaDevices.addEventListener(
            "devicechange",
            handleDeviceChange
        );

        return () => {
            navigator.mediaDevices.removeEventListener(
                "devicechange",
                handleDeviceChange
            );
        };
    }, [audioTrack]);
}
