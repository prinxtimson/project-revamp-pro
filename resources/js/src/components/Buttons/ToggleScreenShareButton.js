import React from "react";
import { createStyles, makeStyles } from "@mui/styles";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Hidden from "@mui/material/Hidden";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import Tooltip from "@mui/material/Tooltip";

import useScreenShareParticipant from "../../hooks/useScreenShareParticipant";
import useVideoContext from "../../hooks/useVideoContext";

export const SCREEN_SHARE_TEXT = "Share Screen";
export const STOP_SCREEN_SHARE_TEXT = "Stop Sharing Screen";
export const SHARE_IN_PROGRESS_TEXT =
    "Cannot share screen when another user is sharing";
export const SHARE_NOT_SUPPORTED_TEXT =
    "Screen sharing is not supported with this browser";

const useStyles = makeStyles((theme) =>
    createStyles({
        button: {
            "&[disabled]": {
                color: "#bbb",
                "& svg *": {
                    fill: "#bbb",
                },
            },
        },
    })
);

export default function ToggleScreenShareButton(props) {
    const classes = useStyles();
    const screenShareParticipant = useScreenShareParticipant();
    const { toggleScreenShare } = useVideoContext();
    const disableScreenShareButton = Boolean(screenShareParticipant);
    const isScreenShareSupported =
        navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia;
    const isDisabled =
        props.disabled || disableScreenShareButton || !isScreenShareSupported;

    let tooltipMessage = SCREEN_SHARE_TEXT;

    if (disableScreenShareButton) {
        tooltipMessage = SHARE_IN_PROGRESS_TEXT;
    } else {
        tooltipMessage = SCREEN_SHARE_TEXT;
    }

    if (!isScreenShareSupported) {
        tooltipMessage = SHARE_NOT_SUPPORTED_TEXT;
    }

    return (
        <>
            <Hidden smDown>
                <Tooltip
                    title={tooltipMessage}
                    placement="top"
                    PopperProps={{ disablePortal: true }}
                    style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                >
                    <span>
                        <Button
                            className={classes.button}
                            onClick={toggleScreenShare}
                            disabled={isDisabled}
                            startIcon={<ScreenShareIcon />}
                            data-cy-share-screen
                        >
                            {SCREEN_SHARE_TEXT}
                        </Button>
                    </span>
                </Tooltip>
            </Hidden>
            <Hidden smUp>
                <Tooltip
                    title={tooltipMessage}
                    placement="top"
                    PopperProps={{ disablePortal: true }}
                    style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                >
                    <span>
                        <IconButton
                            className={classes.button}
                            onClick={toggleScreenShare}
                            disabled={isDisabled}
                            data-cy-share-screen
                            color="primary"
                            size="large"
                        >
                            <ScreenShareIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Hidden>
        </>
    );
}
