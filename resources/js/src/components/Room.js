import React, { useRef, useEffect, useState } from "react";
// import BackgroundSelectionDialog from "./BackgroundSelectionDialog/BackgroundSelectionDialog";
import ChatWindow from "./ChatWindow/ChatWindow";
import clsx from "clsx";
import { GalleryView } from "./GalleryView";
import MobileGalleryView from "./MobileGalleryView";
import { useMediaQuery } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import { ParticipantAudioTracks } from "./ParticipantAudioTracks";
import ParticipantList from "./ParticipantList";
import MainParticipant from "./MainParticipant";
import { useAppState } from "../state";
import useChatContext from "../hooks/useChatContext";
import useScreenShareParticipant from "../hooks/useScreenShareParticipant";
import useVideoContext from "../hooks/useVideoContext";

const useStyles = makeStyles((theme) => {
    const totalMobileSidebarHeight = `${
        theme.sidebarMobileHeight +
        theme.sidebarMobilePadding * 2 +
        theme.participantBorderWidth
    }px`;
    return {
        container: {
            position: "relative",
            height: "100%",
            display: "grid",
            gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
            gridTemplateRows: "100%",
            [theme.breakpoints.down("sm")]: {
                gridTemplateColumns: `100%`,
                gridTemplateRows: `calc(100% - ${totalMobileSidebarHeight}) ${totalMobileSidebarHeight}`,
            },
        },
        rightDrawerOpen: {
            gridTemplateColumns: `1fr ${theme.sidebarWidth}px ${theme.rightDrawerWidth}px`,
        },
    };
});

export function useSetSpeakerViewOnScreenShare(
    screenShareParticipant,
    room,
    setIsGalleryViewActive,
    isGalleryViewActive
) {
    const isGalleryViewActiveRef = useRef(isGalleryViewActive);

    // Save the user's view setting whenever they change to speaker view or gallery view:
    useEffect(() => {
        isGalleryViewActiveRef.current = isGalleryViewActive;
    }, [isGalleryViewActive]);

    useEffect(() => {
        if (
            screenShareParticipant &&
            screenShareParticipant !== room?.localParticipant
        ) {
            // When screensharing starts, save the user's previous view setting (speaker or gallery):
            const prevIsGalleryViewActive = isGalleryViewActiveRef.current;
            // Turn off gallery view so that the user can see the screen that is being shared:
            setIsGalleryViewActive(false);
            return () => {
                // If the user was using gallery view prior to screensharing, turn gallery view back on
                // once screensharing stops:
                if (prevIsGalleryViewActive) {
                    setIsGalleryViewActive(prevIsGalleryViewActive);
                }
            };
        }
    }, [screenShareParticipant, setIsGalleryViewActive, room]);
}

const Room = () => {
    const classes = useStyles();
    const { isChatWindowOpen } = useChatContext();
    const { room } = useVideoContext();
    const { isGalleryViewActive, setIsGalleryViewActive } = useAppState();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const screenShareParticipant = useScreenShareParticipant();

    // Here we switch to speaker view when a participant starts sharing their screen, but
    // the user is still free to switch back to gallery view.
    useSetSpeakerViewOnScreenShare(
        screenShareParticipant,
        room,
        setIsGalleryViewActive,
        isGalleryViewActive
    );

    return (
        <div
            className={clsx(classes.container, {
                [classes.rightDrawerOpen]: isChatWindowOpen,
            })}
        >
            {/* 
          This ParticipantAudioTracks component will render the audio track for all participants in the room.
          It is in a separate component so that the audio tracks will always be rendered, and that they will never be 
          unnecessarily unmounted/mounted as the user switches between Gallery View and speaker View.
        */}
            <ParticipantAudioTracks />

            {isGalleryViewActive ? (
                isMobile ? (
                    <MobileGalleryView />
                ) : (
                    <GalleryView />
                )
            ) : (
                <>
                    <MainParticipant />
                    <ParticipantList />
                </>
            )}

            <ChatWindow />
        </div>
    );
};

export default Room;
