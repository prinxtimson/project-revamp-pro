import React from "react";
import useTrack from "../hooks/useTrack";
import VideoTrack from "./VideoTrack";

const Publication = ({ publication, isLocalParticipant, videoPriority }) => {
    const track = useTrack(publication);

    if (!track) return null;

    switch (track.kind) {
        case "video":
            return (
                <VideoTrack
                    track={track}
                    priority={videoPriority}
                    isLocal={
                        !track.name.includes("screen") && isLocalParticipant
                    }
                />
            );
        default:
            return null;
    }
};

export default Publication;
