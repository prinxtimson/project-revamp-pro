import React from "react";
import clsx from "clsx";
import { makeStyles } from "@mui/styles";
import ParticipantList from "./ParticipantList";
import MainParticipant from "./MainParticipant";

const useStyles = makeStyles((theme) => {
    const totalMobileSidebarHeight = `${
        theme.sidebarMobileHeight +
        theme.sidebarMobilePadding * 2 +
        theme.participantBorderWidth
    }px`;
    return {
        container: {
            position: "relative",
            height: "100%",
            display: "grid",
            gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
            gridTemplateRows: "100%",
            [theme.breakpoints.down("sm")]: {
                gridTemplateColumns: `100%`,
                gridTemplateRows: `calc(100% - ${totalMobileSidebarHeight}) ${totalMobileSidebarHeight}`,
            },
        },
        rightDrawerOpen: {
            gridTemplateColumns: `1fr ${theme.sidebarWidth}px ${theme.rightDrawerWidth}px`,
        },
    };
});

const Room = () => {
    const classes = useStyles();

    return (
        <div className={clsx(classes.container)}>
            <MainParticipant />
            <ParticipantList />
        </div>
    );
};

export default Room;
