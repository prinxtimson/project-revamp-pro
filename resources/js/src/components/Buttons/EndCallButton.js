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

export default function EndCallButton(props) {
    const classes = useStyles();
    const { room } = useVideoContext();

    return (
        <Button
            onClick={() => {
                console.log(room);
                room?.disconnect();
            }}
            className={clsx(classes.button, props.className)}
            data-cy-disconnect
        >
            Disconnect
        </Button>
    );
}
