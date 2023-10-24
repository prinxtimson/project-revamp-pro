import React, { createContext } from "react";
import useGalleryViewParticipants from "../hooks/useGalleryViewParticipants";
import useSpeakerViewParticipants from "../hooks/useSpeakerViewParticipants";

/**
 * The purpose of the ParticipantProvider component is to ensure that the hooks useGalleryViewParticipants
 * and useSpeakerViewParticipants are not unmounted as users switch between Gallery View and Speaker View.
 * This will make sure that the ordering of the participants on the screen will remain so that the most
 * recent dominant speakers are always at the front of the list.
 */

export const ParticipantContext = createContext();

export const ParticipantProvider = ({ children }) => {
    const mobileGalleryViewParticipants = useGalleryViewParticipants(true);
    const galleryViewParticipants = useGalleryViewParticipants();
    const speakerViewParticipants = useSpeakerViewParticipants();

    return (
        <ParticipantContext.Provider
            value={{
                mobileGalleryViewParticipants,
                galleryViewParticipants,
                speakerViewParticipants,
            }}
        >
            {children}
        </ParticipantContext.Provider>
    );
};
