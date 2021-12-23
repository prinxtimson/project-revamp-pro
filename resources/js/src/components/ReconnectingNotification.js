import React from "react";
import Snackbar from "./Snackbar";
import useRoomState from "../hooks/useRoomState";

const ReconnectingNotification = () => {
    const roomState = useRoomState();

    return (
        <Snackbar
            variant="error"
            headline="Connection Lost:"
            message="Reconnecting to room..."
            open={roomState === "reconnecting"}
        />
    );
};

export default ReconnectingNotification;
