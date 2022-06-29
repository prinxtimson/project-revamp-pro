import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Typography, Grid, Button, Hidden } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import LocalVideoPreview from "./LocalVideoPreview";
import SettingsMenu from "./SettingsMenu";
import ToggleAudioButton from "../Buttons/ToggleAudioButton";
import ToggleVideoButton from "../Buttons/ToggleVideoButton";
import { useAppState } from "../../state";
import useVideoContext from "../../hooks/useVideoContext";
import Snackbar from "../Snackbar";

const useStyles = makeStyles((theme) => ({
    gutterBottom: {
        marginBottom: "1em",
    },
    marginTop: {
        marginTop: "1em",
    },
    deviceButton: {
        width: "100%",
        border: "2px solid #aaa",
        margin: "1em 0",
    },
    localPreviewContainer: {
        paddingRight: "2em",
        [theme.breakpoints.down("sm")]: {
            padding: "0 2.5em",
        },
    },
    joinButtons: {
        display: "flex",
        justifyContent: "space-between",
        [theme.breakpoints.down("sm")]: {
            flexDirection: "column-reverse",
            width: "100%",
            "& button": {
                margin: "0.5em 0",
            },
        },
    },
    mobileButtonBar: {
        [theme.breakpoints.down("sm")]: {
            display: "flex",
            justifyContent: "space-between",
            margin: "1.5em 0 1em",
        },
    },
    mobileButton: {
        padding: "0.8em 0",
        margin: 0,
    },
}));

export default function DeviceSelectionScreen({
    name,
    roomId,
    password,
    setStep,
}) {
    const classes = useStyles();
    const [isSnackbarDismissed, setIsSnackbarDismissed] = useState(false);
    const { getToken, isFetching } = useAppState();
    const {
        connect: videoConnect,
        isAcquiringLocalTracks,
        isConnecting,
        getMainRoom,
        error,
    } = useVideoContext();

    const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting;

    const isSnackbarOpen = !isSnackbarDismissed && Boolean(error);

    const handleJoin = () => {
        getToken(name, roomId, password).then(({ token, roomId }) => {
            videoConnect(token);
            getMainRoom(roomId);
        });
    };

    const handleCancel = () => {
        if (
            window.confirm(
                "You are about to leave this this page, please confim to continue."
            )
        ) {
            window.close();
        }
    };

    if (isFetching || isConnecting) {
        return (
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="column"
                style={{ height: "100%" }}
            >
                <div>
                    <CircularProgress variant="indeterminate" />
                </div>
                <div>
                    <Typography
                        variant="body2"
                        style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                        Joining Meeting
                    </Typography>
                </div>
            </Grid>
        );
    }

    return (
        <>
            <Snackbar
                open={isSnackbarOpen}
                handleClose={() => setIsSnackbarDismissed(true)}
                headline="Connection Error:"
                message={error}
                variant="warning"
            />
            <Typography variant="h5" className={classes.gutterBottom}>
                Join Call
            </Typography>

            <Grid container justifyContent="center">
                <Grid item md={7} sm={12} xs={12}>
                    <div className={classes.localPreviewContainer}>
                        <LocalVideoPreview identity={name} />
                    </div>
                    <div className={classes.mobileButtonBar}>
                        <Hidden mdUp>
                            <ToggleAudioButton
                                className={classes.mobileButton}
                                disabled={disableButtons}
                            />
                            <ToggleVideoButton
                                className={classes.mobileButton}
                                disabled={disableButtons}
                            />
                        </Hidden>
                        <SettingsMenu
                            mobileButtonClass={classes.mobileButton}
                        />
                    </div>
                </Grid>
                <Grid item md={5} sm={12} xs={12}>
                    <Grid
                        container
                        direction="column"
                        justifyContent="space-between"
                        style={{ height: "100%" }}
                    >
                        <div>
                            <Hidden smDown>
                                <ToggleAudioButton
                                    className={classes.deviceButton}
                                    disabled={disableButtons}
                                />
                                <ToggleVideoButton
                                    className={classes.deviceButton}
                                    disabled={disableButtons}
                                />
                            </Hidden>
                        </div>
                        <div className={classes.joinButtons}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                data-cy-join-now
                                onClick={handleJoin}
                                disabled={disableButtons}
                            >
                                Join Now
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
