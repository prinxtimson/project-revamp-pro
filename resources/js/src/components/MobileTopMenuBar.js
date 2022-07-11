import React from "react";
import { connect } from "react-redux";
import { Grid, Typography, Hidden } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useVideoContext from "../hooks/useVideoContext";
import { useAppState } from "../state";
import BreakoutRoomsDialog from "./BreakoutRoomsDialog";
import EndCallButton from "./Buttons/EndCallButton";
import Menu from "./MenuBar/Menu";
import DisconnectButton from "./Buttons/DisconnectButton";

const useStyles = makeStyles((theme) => ({
    container: {
        background: "white",
        paddingLeft: "1em",
        display: "none",
        height: `${theme.mobileTopBarHeight}px`,
        [theme.breakpoints.down("sm")]: {
            display: "flex",
        },
    },
    endCallButton: {
        height: "28px",
        fontSize: "0.85rem",
        padding: "0 0.6em",
    },
    settingsButton: {
        [theme.breakpoints.down("sm")]: {
            height: "28px",
            minWidth: "28px",
            border: "1px solid rgb(136, 140, 142)",
            padding: 0,
            margin: "0 1em",
        },
    },
}));

const MobileTopMenuBar = ({ password, isAuthenticated }) => {
    const classes = useStyles();
    const { room } = useVideoContext();
    const [breakoutOpen, setBreakoutOpen] = React.useState(false);

    const toggleBreakoutRoom = () => setBreakoutOpen(!breakoutOpen);

    return (
        <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            className={classes.container}
        >
            <Typography variant="subtitle1">{room?.name}</Typography>
            <div style={{ marginRight: 5 }}>
                <BreakoutRoomsDialog
                    open={breakoutOpen}
                    onClose={() => setBreakoutOpen(false)}
                    password={password}
                />
                <Menu
                    buttonClassName={classes.settingsButton}
                    toggleBreakoutRoom={toggleBreakoutRoom}
                    isAuthenticated={isAuthenticated}
                />
                <Hidden smUp>
                    <DisconnectButton className={classes.endCallButton} />
                </Hidden>
                {isAuthenticated && <EndCallButton />}
            </div>
        </Grid>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {})(MobileTopMenuBar);
