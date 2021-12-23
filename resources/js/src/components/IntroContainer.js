import React from "react";
import { Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { makeStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const mdTheme = createTheme();

const Swoosh = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='296' height='378' viewBox='0 0 296 378'%3E%3Cdefs%3E%3ClinearGradient id='utbttnlrpc' x1='78.976%25' x2='63.882%25' y1='60.873%25' y2='45.554%25'%3E%3Cstop offset='0%25' stop-opacity='0'/%3E%3Cstop offset='100%25'/%3E%3C/linearGradient%3E%3ClinearGradient id='aim8r3oczd' x1='78.976%25' x2='63.882%25' y1='56.106%25' y2='47.503%25'%3E%3Cstop offset='0%25' stop-opacity='0'/%3E%3Cstop offset='100%25'/%3E%3C/linearGradient%3E%3Cpath id='5tk4i6f80a' d='M0 0H296V378H0z'/%3E%3C/defs%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cmask id='m1ihwluuxb' fill='%23fff'%3E%3Cuse xlink:href='%235tk4i6f80a'/%3E%3C/mask%3E%3Cuse fill='%23DE5858' xlink:href='%235tk4i6f80a'/%3E%3Cg mask='url(%23m1ihwluuxb)'%3E%3Cg%3E%3Cpath fill='url(%23utbttnlrpc)' d='M0 286.83c87.695-83.937 175.802-132.682 264.323-146.233 132.78-20.328 183.24 4.255 225.143-23.414 73.409-48.471 93.039-15.154 148.326-20.892 44.84-4.654 98.48-77.401 135.81-91.717C795.596-3.86 821.469.801 851.22 18.56L891 476.5H0V286.83z' opacity='.06' transform='translate(-457 -22.5)'/%3E%3Cpath fill='url(%23aim8r3oczd)' d='M137 604.5c63.759-109.686 155.8-165.124 276.126-166.315 180.488-1.786 157.888-146.686 387.11-146.33 229.223.356 170.665-151.786 341.36-166.888 113.797-10.068 180.265 10.685 199.404 62.26V604.5H137z' opacity='.08' transform='translate(-457 -22.5)'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A");`;

const useStyles = makeStyles((theme) => ({
    background: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgb(40, 42, 43)",
        height: "100%",
        flexGrow: 1,
    },
    container: {
        position: "relative",
        flex: "1",
    },
    innerContainer: {
        display: "flex",
        width: "888px",
        height: "379px",
        borderRadius: "8px",
        boxShadow: "0px 2px 4px 0px rgba(40, 42, 43, 0.3)",
        overflow: "hidden",
        position: "relative",
        margin: "auto",
        [theme.breakpoints.down("sm")]: {
            display: "block",
            height: "auto",
            width: "calc(100% - 40px)",
            margin: "auto",
            maxWidth: "400px",
        },
    },
    swooshContainer: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#293986",
        backgroundSize: "cover",
        width: "296px",
        [theme.breakpoints.down("sm")]: {
            width: "100%",
            height: "100px",
            backgroundPositionY: "140px",
        },
    },
    logoContainer: {
        position: "absolute",
        width: "210px",
        textAlign: "center",
        [theme.breakpoints.down("sm")]: {
            display: "flex",
            alignItems: "center",
            width: "90%",
            textAlign: "initial",
            "& svg": {
                height: "64px",
            },
        },
    },
    twilioLogo: {
        position: "absolute",
        top: 0,
        left: 0,
        margin: "20px",
    },
    content: {
        background: "white",
        width: "100%",
        padding: "4em",
        flex: 1,
        [theme.breakpoints.down("sm")]: {
            padding: "2em",
        },
    },
    title: {
        color: "white",
        margin: "1em 0 0",
        [theme.breakpoints.down("sm")]: {
            margin: 0,
            fontSize: "1.1rem",
        },
    },
}));

const IntroContainer = (props) => {
    const classes = useStyles();

    return (
        <ThemeProvider theme={mdTheme}>
            <CssBaseline />
            <div className={classes.background}>
                <div className={classes.container}>
                    <div className={classes.innerContainer}>
                        <div className={classes.swooshContainer}>
                            <div className={classes.logoContainer}>
                                <Typography
                                    variant="h6"
                                    className={classes.title}
                                >
                                    Tritek Consulting Lid
                                </Typography>
                            </div>
                        </div>
                        <div className={classes.content}>{props.children}</div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default IntroContainer;
