import React, { useEffect, useRef } from "react";
import { styled } from "@mui/styles";
import useMediaStreamTrack from "../hooks/useMediaStreamTrack";
import useVideoTrackDimensions from "../hooks/useVideoTrackDimensions";

const Video = styled("video")({
    width: "100%",
    height: "100%",
});

const VideoTrack = ({ track, isLocal, priority }) => {
    const ref = useRef(null);
    const mediaStreamTrack = useMediaStreamTrack(track);
    const dimensions = useVideoTrackDimensions(track);
    const isPortrait = dimensions?.height > (dimensions?.width || 0);

    useEffect(() => {
        const el = ref.current;
        el.muted = true;
        if (track.setPriority && priority) {
            track.setPriority(priority);
        }
        track.attach(el);
        return () => {
            track.detach(el);
            el.srcObject = null;

            if (track.setPriority && priority) {
                track.setPriority(null);
            }
            ref.current = null;
        };
    }, [track, priority]);

    // The local video track is mirrored if it is not facing the environment.
    const isFrontFacing =
        mediaStreamTrack?.getSettings().facingMode !== "environment";
    const style = {
        transform: isLocal && isFrontFacing ? "rotateY(180deg)" : "",
        objectFit:
            isPortrait || track.name.includes("screen") ? "contain" : "cover",
    };

    return <Video ref={ref} style={style} />;
};

export default VideoTrack;
