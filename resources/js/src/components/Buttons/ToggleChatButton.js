import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import Hidden from "@mui/material/Hidden";
import ChatIcon from "@mui/icons-material/Chat";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import clsx from "clsx";
import { makeStyles } from "@mui/styles";
import useChatContext from "../../hooks/useChatContext";
import useVideoContext from "../../hooks/useVideoContext";

export const ANIMATION_DURATION = 700;

const useStyles = makeStyles({
    iconContainer: {
        position: "relative",
        display: "flex",
    },
    circle: {
        width: "10px",
        height: "10px",
        backgroundColor: "#5BB75B",
        borderRadius: "50%",
        position: "absolute",
        top: "-3px",
        left: "13px",
        opacity: 0,
        transition: `opacity ${ANIMATION_DURATION * 0.5}ms ease-in`,
    },
    hasUnreadMessages: {
        opacity: 1,
    },
    ring: {
        border: "3px solid #5BB75B",
        borderRadius: "30px",
        height: "14px",
        width: "14px",
        position: "absolute",
        left: "11px",
        top: "-5px",
        opacity: 0,
    },
    animateRing: {
        animation: `$expand ${ANIMATION_DURATION}ms ease-out`,
        animationIterationCount: 1,
    },
    "@keyframes expand": {
        "0%": {
            transform: "scale(0.1, 0.1)",
            opacity: 0,
        },
        "50%": {
            opacity: 1,
        },
        "100%": {
            transform: "scale(1.4, 1.4)",
            opacity: 0,
        },
    },
});

export default function ToggleChatButton() {
    const classes = useStyles();
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const {
        isChatWindowOpen,
        setIsChatWindowOpen,
        conversation,
        hasUnreadMessages,
    } = useChatContext();
    //const { setIsBackgroundSelectionOpen } = useVideoContext();

    const toggleChatWindow = () => {
        setIsChatWindowOpen(!isChatWindowOpen);
        // setIsBackgroundSelectionOpen(false);
    };

    useEffect(() => {
        if (shouldAnimate) {
            setTimeout(() => setShouldAnimate(false), ANIMATION_DURATION);
        }
    }, [shouldAnimate]);

    useEffect(() => {
        if (conversation && !isChatWindowOpen) {
            const handleNewMessage = () => setShouldAnimate(true);
            conversation.on("messageAdded", handleNewMessage);
            return () => {
                conversation.off("messageAdded", handleNewMessage);
            };
        }
    }, [conversation, isChatWindowOpen]);

    return (
        <>
            <Hidden smDown>
                <Tooltip
                    title="Chats"
                    placement="top"
                    PopperProps={{ disablePortal: true }}
                    style={{
                        cursor: !conversation ? "not-allowed" : "pointer",
                    }}
                >
                    <span>
                        <Button
                            data-cy-chat-button
                            onClick={toggleChatWindow}
                            disabled={!conversation}
                            startIcon={
                                <Badge
                                    badgeContent={hasUnreadMessages}
                                    color="error"
                                >
                                    <ChatIcon />
                                </Badge>
                            }
                        >
                            Chat
                        </Button>
                    </span>
                </Tooltip>
            </Hidden>
            <Hidden smUp>
                <Tooltip
                    title="Chats"
                    placement="top"
                    PopperProps={{ disablePortal: true }}
                    style={{
                        cursor: !conversation ? "not-allowed" : "pointer",
                    }}
                >
                    <span>
                        <IconButton
                            data-cy-chat-button
                            onClick={toggleChatWindow}
                            disabled={!conversation}
                        >
                            <Badge
                                badgeContent={hasUnreadMessages}
                                color="error"
                            >
                                <ChatIcon />
                            </Badge>
                        </IconButton>
                    </span>
                </Tooltip>
            </Hidden>
        </>
    );
}
