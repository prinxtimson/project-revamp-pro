import React, { useEffect, useState } from "react";
import Snackbar from "./Snackbar";
import useRoomState from "../hooks/useRoomState";

const ReconnectingNotification = () => {
    const roomState = useRoomState();
    const [state, setState] = useState("");

    useEffect(() => {
        setState(roomState);

        return () => setState(null);
    }, [roomState]);
    return (
        <Snackbar
            variant="error"
            headline="Connection Lost:"
            message="Reconnecting to room..."
            open={state === "reconnecting"}
        />
    );
};

export default ReconnectingNotification;
