import React, { useState, useRef, useEffect } from "react";
import { Link } from "@mui/material";
import Snackbar from "./Snackbar";
import useIsRecording from "../hooks/useIsRecording";

const Snackbars = {
    none: 1,
    recordingStarted: 2,
    recordingInProgress: 3,
    recordingFinished: 4,
};

const RecordingNotifications = () => {
    const [activeSnackbar, setActiveSnackbar] = useState("");
    const prevIsRecording = useRef(null);
    const isRecording = useIsRecording();

    useEffect(() => {
        // Show "Recording in progress" snackbar when a user joins a room that is recording
        if (isRecording && prevIsRecording.current === null) {
            setActiveSnackbar(Snackbars.recordingInProgress);
        }
    }, [isRecording]);

    useEffect(() => {
        // Show "Recording started" snackbar when recording has started.
        if (isRecording && prevIsRecording.current === false) {
            setActiveSnackbar(Snackbars.recordingStarted);
        }
    }, [isRecording]);

    useEffect(() => {
        // Show "Recording finished" snackbar when recording has stopped.
        if (!isRecording && prevIsRecording.current === true) {
            setActiveSnackbar(Snackbars.recordingFinished);
        }
    }, [isRecording]);

    useEffect(() => {
        prevIsRecording.current = isRecording;
    }, [isRecording]);

    return (
        <>
            <Snackbar
                open={activeSnackbar === Snackbars.recordingStarted}
                handleClose={() => setActiveSnackbar(Snackbars.none)}
                variant="info"
                headline="Recording has started."
                message=""
            />
            <Snackbar
                open={activeSnackbar === Snackbars.recordingInProgress}
                handleClose={() => setActiveSnackbar(Snackbars.none)}
                variant="info"
                headline="Recording is in progress."
                message=""
            />
            <Snackbar
                open={activeSnackbar === Snackbars.recordingFinished}
                headline="Recording Complete"
                message={
                    <>
                        You can view the recording in the{" "}
                        <Link
                            target="_blank"
                            rel="noopener"
                            href="https://www.twilio.com/console/video/logs/recordings"
                        >
                            Twilio Console
                        </Link>
                        . Recordings will be available once this room has ended.
                    </>
                }
                variant="info"
                handleClose={() => setActiveSnackbar(Snackbars.none)}
            />
        </>
    );
};

export default RecordingNotifications;
