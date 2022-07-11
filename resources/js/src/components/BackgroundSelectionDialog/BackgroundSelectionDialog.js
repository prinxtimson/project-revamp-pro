import React from "react";
import BackgroundSelectionHeader from "./BackgroundSelectionHeader/BackgroundSelectionHeader";
import BackgroundThumbnail from "./BackgroundThumbnail/BackgroundThumbnail";
import Drawer from "@mui/material/Drawer";
import { makeStyles } from "@mui/styles";
//import { backgroundConfig } from "../VideoProvider/useBackgroundSettings";
import useVideoContext from "../../hooks/useVideoContext";

const useStyles = makeStyles((theme) => ({
    drawer: {
        display: "flex",
        width: theme.rightDrawerWidth,
        height: `calc(100% - ${theme.footerHeight}px)`,
    },
    thumbnailContainer: {
        display: "flex",
        flexWrap: "wrap",
        padding: "5px",
        overflowY: "auto",
    },
}));

function BackgroundSelectionDialog() {
    const classes = useStyles();
    const { isBackgroundSelectionOpen, setIsBackgroundSelectionOpen } =
        useVideoContext();

    // const imageNames = backgroundConfig.imageNames;
    // const images = backgroundConfig.images;

    return (
        <Drawer
            variant="persistent"
            anchor="right"
            open={isBackgroundSelectionOpen}
            transitionDuration={0}
            classes={{
                paper: classes.drawer,
            }}
        >
            <BackgroundSelectionHeader
                onClose={() => setIsBackgroundSelectionOpen(false)}
            />
            <div className={classes.thumbnailContainer}>
                <BackgroundThumbnail thumbnail={"none"} name={"None"} />
                <BackgroundThumbnail thumbnail={"blur"} name={"Blur"} />
                {/* {images.map((image, index) => (
                    <BackgroundThumbnail
                        thumbnail={"image"}
                        //name={imageNames[index]}
                        index={index}
                        //imagePath={image}
                        key={image}
                    />
                ))} */}
            </div>
        </Drawer>
    );
}

export default BackgroundSelectionDialog;
