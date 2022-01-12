import React from "react";
import { makeStyles, createStyles } from "@mui/styles";

import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { isMobile } from "../../utils";
import Menu from "./Menu";
import useRoomState from "../../hooks/useRoomState";
import useVideoContext from "../../hooks/useVideoContext";
import { Typography, Grid, Hidden } from "@mui/material";

import useParticipants from "../../hooks/useParticipants";
import EndCallButton from "../Buttons/EndCallButton";
import ToggleAudioButton from "../Buttons/ToggleAudioButton";
import ToggleVideoButton from "../Buttons/ToggleVideoButton";
import ToggleScreenShareButton from "../Buttons/ToggleScreenShareButton";
import ParticipantListDialog from "../ParticipantListDialog";

const useStyles = makeStyles((theme) =>
    createStyles({
        container: {
            backgroundColor: theme.palette.background.default,
            bottom: 0,
            left: 0,
            right: 0,
            height: `${theme.footerHeight}px`,
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
            zIndex: 8,
            bottom: `${theme.footerHeight}px`,
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

const MenuBar = () => {
    const classes = useStyles();
    const participants = useParticipants();
    const [open, setOpen] = React.useState(false);
    const { isSharingScreen, toggleScreenShare } = useVideoContext();
    const roomState = useRoomState();
    const isReconnecting = roomState === "reconnecting";
    const { room } = useVideoContext();

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
                    <Button onClick={() => toggleScreenShare()}>
                        Stop Sharing
                    </Button>
                </Grid>
            )}
            <ParticipantListDialog open={open} onClose={() => setOpen(false)} />
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
                                />
                            )}
                            <Button onClick={() => setOpen(true)}>
                                <Badge
                                    badgeContent={participants.length + 1}
                                    color="success"
                                >
                                    Participants
                                </Badge>
                            </Button>
                            <Hidden smDown>
                                <Menu />
                            </Hidden>
                        </Grid>
                    </Grid>
                    <Hidden smDown>
                        <Grid style={{ flex: 1 }}>
                            <Grid container justifyContent="flex-end">
                                <EndCallButton />
                            </Grid>
                        </Grid>
                    </Hidden>
                </Grid>
            </footer>
        </>
    );
};

export default MenuBar;
