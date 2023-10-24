import React from "react";
import Publication from "./Publication";
import usePublications from "../hooks/usePublications";

const ParticipantTracks = ({
    participant,
    videoOnly,
    enableScreenShare,
    videoPriority,
    isLocalParticipant,
}) => {
    const publications = usePublications(participant);

    let filteredPublications;

    if (
        enableScreenShare &&
        publications.some((p) => p.trackName.includes("screen"))
    ) {
        filteredPublications = publications.filter(
            (p) => p.trackName.includes("screen") || p.kind !== "video"
        );
    } else {
        filteredPublications = publications.filter(
            (p) => !p.trackName.includes("screen")
        );
    }

    return (
        <>
            {filteredPublications.map((publication) => (
                <Publication
                    key={publication.kind}
                    publication={publication}
                    participant={participant}
                    isLocalParticipant={isLocalParticipant}
                    videoOnly={videoOnly}
                    videoPriority={videoPriority}
                />
            ))}
        </>
    );
};

export default ParticipantTracks;
