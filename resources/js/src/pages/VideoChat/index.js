import React from "react";

import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import VideoChat from "./VideoChat";
import AppStateProvider, { useAppState } from "../../state";
import ErrorDialog from "../../components/ErrorDialog";
import { ChatProvider } from "../../components/ChatProvider";
import { ParticipantProvider } from "../../components/ParticipantProvider";
import { VideoProvider } from "../../components/VideoProvider";
import useConnectionOptions from "../../utils/useConnectionOptions";
import UnsupportedBrowserWarning from "../../components/UnsupportedBrowserWarning";

const defaultTheme = createTheme();

const theme = createTheme({
    overrides: {
        MuiCssBaseline: {
            "@global": {
                "html, body, #root": {
                    height: "100%",
                },
            },
        },
        MuiButton: {
            root: {
                borderRadius: "4px",
                textTransform: "none",
                color: "rgb(40, 42, 43)",
                fontSize: "0.9rem",
                transition: defaultTheme.transitions.create(
                    ["background-color", "box-shadow", "border", "color"],
                    {
                        duration: defaultTheme.transitions.duration.short,
                    }
                ),
            },
            text: {
                padding: "6px 14px",
            },
            contained: {
                boxShadow: "none",
                "&:hover": {
                    boxShadow: "none",
                },
            },
            outlinedPrimary: {
                border: "2px solid #027AC5",
                "&:hover": {
                    border: "2px solid rgb(1, 85, 137)",
                },
            },
            startIcon: {
                marginRight: "6px",
            },
        },
        MuiTypography: {
            body1: {
                color: "rgb(40, 42, 43)",
                fontSize: "0.9rem",
            },
        },
        MuiInputBase: {
            root: {
                fontSize: "0.9rem",
            },
        },
        MuiSelect: {
            root: {
                padding: "0.85em",
            },
        },
        MuiDialogActions: {
            root: {
                padding: "16px",
            },
        },
        MuiTextField: {
            root: {
                color: "rgb(40, 42, 43)",
            },
        },
        MuiInputLabel: {
            root: {
                color: "rgb(40, 42, 43)",
                fontSize: "1.1rem",
                marginBottom: "0.2em",
                fontWeight: 500,
            },
        },
        MuiOutlinedInput: {
            notchedOutline: {
                borderColor: "rgb(136, 140, 142)",
            },
        },
    },
    typography: {
        fontFamily: "Inter, sans-serif",
    },
    palette: {
        primary: {
            main: "#027AC5",
        },
    },
    brand: "#E22525",
    footerHeight: 72,
    mobileFooterHeight: 56,
    sidebarWidth: 300,
    sidebarMobileHeight: 90,
    sidebarMobilePadding: 8,
    participantBorderWidth: 2,
    mobileTopBarHeight: 52,
    rightDrawerWidth: 320,
    galleryViewBackgroundColor: "#121C2D",
});

const VideoApp = () => {
    const { error, setError } = useAppState();
    const connectionOptions = useConnectionOptions();

    return (
        <VideoProvider options={connectionOptions} onError={setError}>
            <ErrorDialog dismissError={() => setError(null)} error={error} />

            <ParticipantProvider>
                <ChatProvider>
                    <VideoChat />
                </ChatProvider>
            </ParticipantProvider>
        </VideoProvider>
    );
};

export default () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <UnsupportedBrowserWarning>
                <AppStateProvider>
                    <VideoApp />
                </AppStateProvider>
            </UnsupportedBrowserWarning>
        </ThemeProvider>
    );
};
