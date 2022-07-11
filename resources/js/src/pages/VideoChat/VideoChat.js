import React from "react";
import { styled } from "@mui/styles";
import { useParams, useSearchParams } from "react-router-dom";

import MenuBar from "../../components/MenuBar/MenuBar";
import MobileTopMenuBar from "../../components/MobileTopMenuBar";
import PreJoinScreens from "../../components/PreJoinScreen/PreJoinScreens";
import ReconnectingNotification from "../../components/ReconnectingNotification";
import RecordingNotifications from "../../components/RecordingNotifications";
import Room from "../../components/Room";

import useHeight from "../../hooks/useHeight";
import useRoomState from "../../hooks/useRoomState";
import { connect } from "react-redux";

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

const VideoChat = () => {
    const { URLRoomID } = useParams();
    let [urlSearchParams] = useSearchParams();
    const [password] = React.useState(urlSearchParams.get("pwd"));
    const roomState = useRoomState();

    const height = useHeight();

    return (
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
    );
};

const mapStateToProps = (state) => ({
    loading: state.livecall.loading,
});

export default connect(mapStateToProps)(VideoChat);
