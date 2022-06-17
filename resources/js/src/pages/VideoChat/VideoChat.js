import React from "react";
import { styled } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useParams, useSearchParams } from "react-router-dom";

const theme = createTheme();

import MenuBar from "../../components/MenuBar/MenuBar";
import MobileTopMenuBar from "../../components/MobileTopMenuBar";
import PreJoinScreens from "../../components/PreJoinScreen/PreJoinScreens";
import ReconnectingNotification from "../../components/ReconnectingNotification";
import RecordingNotifications from "../../components/RecordingNotifications";
import Room from "../../components/Room";

import useHeight from "../../hooks/useHeight";
import useRoomState from "../../hooks/useRoomState";

const Container = styled("div")({
    display: "grid",
    gridTemplateRows: "1fr auto",
});

const Main = styled("main")(({ theme }) => ({
    overflow: "hidden",
    paddingBottom: `${theme.footerHeight}px`, // Leave some space for the footer
    background: "black",
    [theme.breakpoints.down("sm")]: {
        paddingBottom: `${
            theme.mobileFooterHeight + theme.mobileTopBarHeight
        }px`, // Leave some space for the mobile header and footer
    },
}));

export default function VideoChat() {
    const { URLRoomID } = useParams();
    let [urlSearchParams] = useSearchParams();
    const [password] = React.useState(urlSearchParams.get("pwd"));
    const roomState = useRoomState();

    const height = useHeight();

    // React.useEffect(() => {
    //     if (livecall) {
    //         window.addEventListener("beforeunload", (e) => {
    //             e.preventDefault();
    //             e.returnValue = "Are you sure you want to close?";
    //         });
    //         window.addEventListener("unload", (e) => {
    //             e.preventDefault();
    //             leaveLivecall(livecall.id);
    //         });
    //     }
    // }, [livecall]);

    return (
        <ThemeProvider theme={theme}>
            <Container style={{ height, flexGrow: 1 }}>
                {roomState === "disconnected" ? (
                    <PreJoinScreens URLRoomID={URLRoomID} password={password} />
                ) : (
                    <Main>
                        <ReconnectingNotification />
                        <RecordingNotifications />
                        <MobileTopMenuBar password={password} />
                        <Room />
                        <MenuBar password={password} />
                    </Main>
                )}
            </Container>
        </ThemeProvider>
    );
}
