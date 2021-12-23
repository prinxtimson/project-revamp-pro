import React, { useState, useRef } from "react";
import AboutDialog from "../AboutDialog";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIconOutlined from "@mui/icons-material/InfoOutlined";
import MoreIcon from "@mui/icons-material/MoreVert";
import StartRecordingIcon from "@mui/icons-material/PlayCircle";
import StopRecordingIcon from "@mui/icons-material/StopCircle";
import SearchIcon from "@mui/icons-material/Search";
import {
    Button,
    useMediaQuery,
    Menu as MenuContainer,
    MenuItem,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useAppState } from "../../state";
import useIsRecording from "../../hooks/useIsRecording";
import useVideoContext from "../../hooks/useVideoContext";
import FlipCameraIcon from "@mui/icons-material/FlipCameraIos";
import useFlipCameraToggle from "../../hooks/useFlipCameraToggle";
import { VideoRoomMonitor } from "@twilio/video-room-monitor";

export const IconContainer = styled("div")({
    display: "flex",
    justifyContent: "center",
    width: "1.5em",
    marginRight: "0.3em",
});

const Menu = (props) => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    const [aboutOpen, setAboutOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const { isFetching, updateRecordingRules, roomType } = useAppState();
    const isRecording = useIsRecording();
    const { room } = useVideoContext();

    const anchorRef = useRef(null);
    const { flipCameraDisabled, toggleFacingMode, flipCameraSupported } =
        useFlipCameraToggle();

    return (
        <>
            <Button
                onClick={() => setMenuOpen((isOpen) => !isOpen)}
                ref={anchorRef}
                className={props.buttonClassName}
                data-cy-more-button
            >
                {isMobile ? (
                    <MoreIcon />
                ) : (
                    <>
                        More
                        <ExpandMoreIcon />
                    </>
                )}
            </Button>
            <MenuContainer
                open={menuOpen}
                onClose={() => setMenuOpen((isOpen) => !isOpen)}
                anchorEl={anchorRef.current}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: isMobile ? -55 : "bottom",
                    horizontal: "center",
                }}
            >
                {flipCameraSupported && (
                    <MenuItem
                        disabled={flipCameraDisabled}
                        onClick={toggleFacingMode}
                    >
                        <IconContainer>
                            <FlipCameraIcon />
                        </IconContainer>
                        <Typography variant="body1">Flip Camera</Typography>
                    </MenuItem>
                )}

                {roomType !== "peer-to-peer" && roomType !== "go" && (
                    <MenuItem
                        disabled={isFetching}
                        onClick={() => {
                            setMenuOpen(false);
                            if (isRecording) {
                                updateRecordingRules(room?.sid, [
                                    { type: "exclude", all: true },
                                ]);
                            } else {
                                updateRecordingRules(room?.sid, [
                                    { type: "include", all: true },
                                ]);
                            }
                        }}
                        data-cy-recording-button
                    >
                        <IconContainer>
                            {isRecording ? (
                                <StopRecordingIcon />
                            ) : (
                                <StartRecordingIcon />
                            )}
                        </IconContainer>
                        <Typography variant="body1">
                            {isRecording ? "Stop" : "Start"} Recording
                        </Typography>
                    </MenuItem>
                )}

                <MenuItem
                    onClick={() => {
                        VideoRoomMonitor.toggleMonitor();
                        setMenuOpen(false);
                    }}
                >
                    <IconContainer>
                        <SearchIcon
                            style={{ fill: "#707578", width: "0.9em" }}
                        />
                    </IconContainer>
                    <Typography variant="body1">Room Monitor</Typography>
                </MenuItem>

                <MenuItem onClick={() => setAboutOpen(true)}>
                    <IconContainer>
                        <InfoIconOutlined />
                    </IconContainer>
                    <Typography variant="body1">About</Typography>
                </MenuItem>
            </MenuContainer>
            <AboutDialog
                open={aboutOpen}
                onClose={() => {
                    setAboutOpen(false);
                    setMenuOpen(false);
                }}
            />
        </>
    );
};

export default Menu;
