import React from "react";
import { Typography, TextField, Grid, Button, InputLabel } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { makeStyles } from "@mui/styles";
import { useAppState } from "../../state";
import useVideoContext from "../../hooks/useVideoContext";

const useStyles = makeStyles((theme) => ({
    gutterBottom: {
        marginBottom: "1em",
    },
    inputContainer: {
        display: "flex",
        justifyContent: "space-between",
        margin: "1.5em 0 3.5em",
        "& div:not(:last-child)": {
            marginRight: "1em",
        },
        [theme.breakpoints.down("sm")]: {
            margin: "1.5em 0 2em",
        },
    },
    textFieldContainer: {
        width: "100%",
    },
    continueButton: {
        [theme.breakpoints.down("sm")]: {
            width: "100%",
        },
    },
}));

export default function RoomNameScreen({ name, setName, handleSubmit }) {
    const classes = useStyles();
    const { isFetching } = useAppState();
    const { isConnecting } = useVideoContext();

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    if (isFetching || isConnecting) {
        return (
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="column"
                style={{ height: "100%" }}
            >
                <div>
                    <CircularProgress variant="indeterminate" />
                </div>
                <div>
                    <Typography
                        variant="body2"
                        style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                        Joining Meeting
                    </Typography>
                </div>
            </Grid>
        );
    }

    return (
        <>
            <Typography variant="h5" className={classes.gutterBottom}>
                Enter your name
            </Typography>
            <form onSubmit={handleSubmit}>
                <div className={classes.inputContainer}>
                    <div className={classes.textFieldContainer}>
                        <TextField
                            id="input-user-name"
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={name}
                            label="Your Name"
                            onChange={handleNameChange}
                        />
                    </div>
                </div>
                <Grid container justifyContent="flex-end">
                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        disabled={!name}
                        className={classes.continueButton}
                    >
                        Continue
                    </Button>
                </Grid>
            </form>
        </>
    );
}
