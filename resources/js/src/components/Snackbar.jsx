import React from "react";
import clsx from "clsx";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import { IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MUISnackbar from "@mui/material/Snackbar";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        justifyContent: "space-between",
        width: "400px",
        minHeight: "50px",
        background: "white",
        padding: "1em",
        borderRadius: "3px",
        boxShadow: "0 12px 24px 4px rgba(40,42,43,0.2)",
        [theme.breakpoints.down("sm")]: {
            width: "100%",
        },
    },
    contentContainer: {
        display: "flex",
        lineHeight: 1.8,
    },
    iconContainer: {
        display: "flex",
        padding: "0 1.3em 0 0.3em",
        transform: "translateY(3px)",
    },
    headline: {
        fontWeight: "bold",
    },
    error: {
        borderLeft: "4px solid #D61F1F",
    },
    warning: {
        borderLeft: "4px solid #E46216",
    },
    info: {
        borderLeft: "4px solid #0263e0",
    },
}));

const Snackbar = ({ headline, message, variant, open, handleClose }) => {
    const classes = useStyles();

    const handleOnClose = (reason) => {
        if (reason === "clickaway") {
            return;
        }

        handleClose?.();
    };

    return (
        <MUISnackbar
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={open}
            onClose={handleOnClose}
            autoHideDuration={10000}
        >
            <div
                className={clsx(classes.container, {
                    [classes.error]: variant === "error",
                    [classes.warning]: variant === "warning",
                    [classes.info]: variant === "info",
                })}
            >
                <div className={classes.contentContainer}>
                    <div className={classes.iconContainer}>
                        {variant === "warning" && <WarningIcon />}
                        {variant === "error" && <ErrorIcon />}
                        {variant === "info" && <InfoIcon />}
                    </div>
                    <div>
                        <Typography
                            variant="body1"
                            className={classes.headline}
                            component="span"
                        >
                            {headline}
                        </Typography>
                        <Typography variant="body1" component="span">
                            {" "}
                            {message}
                        </Typography>
                    </div>
                </div>
                <div>
                    {handleClose && (
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleClose}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    )}
                </div>
            </div>
        </MUISnackbar>
    );
};

export default Snackbar;
