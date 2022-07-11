import React from "react";
import { makeStyles, createStyles } from "@mui/styles";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PeopleIcon from "@mui/icons-material/People";
import Badge from "@mui/material/Badge";
import { isMobile } from "../../utils";
import Menu from "./Menu";
import useRoomState from "../../hooks/useRoomState";
import useVideoContext from "../../hooks/useVideoContext";
import { Typography, Grid, Hidden } from "@mui/material";

import useParticipants from "../../hooks/useParticipants";
import DisconnectButton from "../Buttons/DisconnectButton";
import ToggleAudioButton from "../Buttons/ToggleAudioButton";
import ToggleVideoButton from "../Buttons/ToggleVideoButton";
import ToggleChatButton from "../Buttons/ToggleChatButton";
import ToggleScreenShareButton from "../Buttons/ToggleScreenShareButton";
import ParticipantListDialog from "../ParticipantListDialog";
import BreakoutRoomsDialog from "../BreakoutRoomsDialog";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) =>
    createStyles({
        container: {
            backgroundColor: theme.palette.background.default,
            bottom: 0,
            left: 0,
            right: 0,
            height: 40,
            position: "fixed",
            display: "flex",
            padding: "0 1.43em",
            zIndex: 10,
            [theme.breakpoints.down("sm")]: {
                height: `${theme.mobileFooterHeight}px`,
                padding: 0,
            },
        },
        screenShareBanner: {
            position: "fixed",
            zIndex: 180,
            bottom: 40,
            left: 0,
            right: 0,
            height: "104px",
            background: "rgba(0, 0, 0, 0.5)",
            "& h6": {
                color: "white",
            },
            "& button": {
                background: "white",
                color: theme.brand,
                border: `2px solid ${theme.brand}`,
                margin: "0 2em",
                "&:hover": {
                    color: "#600101",
                    border: `2px solid #600101`,
                    background: "#FFE9E7",
                },
            },
        },
        hideMobile: {
            display: "initial",
            [theme.breakpoints.down("sm")]: {
                display: "none",
            },
        },
    })
);

const MenuBar = ({ password, isAuthenticated }) => {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [breakoutOpen, setBreakoutOpen] = React.useState(false);
    const { isSharingScreen, toggleScreenShare, room } = useVideoContext();
    const roomState = useRoomState();
    const isReconnecting = roomState === "reconnecting";
    const participants = useParticipants();

    const toggleBreakoutRoom = () => setBreakoutOpen(!breakoutOpen);

    return (
        <>
            {isSharingScreen && (
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    className={classes.screenShareBanner}
                >
                    <Typography variant="h6">
                        You are sharing your screen
                    </Typography>
                    <Button
                        onClick={() => {
                            console.log("toggle stop");
                            toggleScreenShare();
                        }}
                    >
                        Stop Sharing
                    </Button>
                </Grid>
            )}
            <ParticipantListDialog open={open} onClose={() => setOpen(false)} />
            <BreakoutRoomsDialog
                open={breakoutOpen}
                onClose={() => setBreakoutOpen(false)}
                password={password}
            />
            <footer className={classes.container}>
                <Grid
                    container
                    justifyContent="space-around"
                    alignItems="center"
                >
                    <Hidden smDown>
                        <Grid style={{ flex: 1 }}>
                            <Typography variant="body1">
                                {room?.name}
                            </Typography>
                        </Grid>
                    </Hidden>
                    <Grid item>
                        <Grid container justifyContent="center">
                            <ToggleAudioButton disabled={isReconnecting} />
                            <ToggleVideoButton disabled={isReconnecting} />
                            {!isSharingScreen && !isMobile && (
                                <ToggleScreenShareButton
                                    disabled={isReconnecting}
                                    room={room}
                                />
                            )}
                            {process.env
                                .REACT_APP_DISABLE_TWILIO_CONVERSATIONS !==
                                "true" && <ToggleChatButton />}
                            <Hidden smDown>
                                <Button onClick={() => setOpen(true)}>
                                    <Badge
                                        badgeContent={participants.length + 1}
                                        color="success"
                                    >
                                        Participants
                                    </Badge>
                                </Button>
                            </Hidden>
                            <Hidden smUp>
                                <IconButton
                                    onClick={() => setOpen(true)}
                                    color="primary"
                                    size="large"
                                >
                                    <Badge
                                        badgeContent={participants.length + 1}
                                        color="success"
                                    >
                                        <PeopleIcon />
                                    </Badge>
                                </IconButton>
                            </Hidden>
                        </Grid>
                    </Grid>
                    <Hidden smDown>
                        <Grid style={{ flex: 1 }}>
                            <Grid container justifyContent="flex-end">
                                <DisconnectButton />
                            </Grid>
                        </Grid>
                    </Hidden>
                </Grid>
            </footer>
        </>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    livecall: state.livecall.livecall,
});

export default connect(mapStateToProps, {})(MenuBar);
