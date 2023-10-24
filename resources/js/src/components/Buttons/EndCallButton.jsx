import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "@mui/material";

import useVideoContext from "../../hooks/useVideoContext";
import { endLivecall } from "../../features/livecall/livecallSlice";

const EndCallButton = () => {
    const { room } = useVideoContext();

    const dispatch = useDispatch();

    return (
        <Button
            onClick={() => dispatch(endLivecall(room.sid))}
            variant="contained"
            color="error"
            data-cy-disconnect
            size="small"
        >
            End call
        </Button>
    );
};

export default EndCallButton;
