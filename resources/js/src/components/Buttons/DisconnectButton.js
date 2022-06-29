import React from "react";
import clsx from "clsx";
import { createStyles, makeStyles } from "@mui/styles";
import { Button } from "@mui/material";

import useVideoContext from "../../hooks/useVideoContext";

const useStyles = makeStyles((theme) =>
    createStyles({
        button: {
            background: theme.brand,
            color: "white",
            "&:hover": {
                background: "#600101",
            },
        },
    })
);

const DisconnectButton = (props) => {
    const classes = useStyles();
    const { room } = useVideoContext();

    return (
        <Button
            onClick={() => {
                room?.disconnect();
                // axios.get('callended')
            }}
            className={clsx(classes.button, props.className)}
            data-cy-disconnect
        >
            Disconnect
        </Button>
    );
};

export default DisconnectButton;
