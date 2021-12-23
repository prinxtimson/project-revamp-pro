import React, { useState } from "react";
import Snackbar from "../Snackbar";
import useDevices from "../../hooks/useDevices";
import useVideoContext from "../../hooks/useVideoContext";

export function getSnackbarContent(hasAudio, hasVideo, error = null) {
    let headline = "";
    let message = "";

    switch (true) {
        case error?.message === "CameraPermissionsDenied":
            headline = "Unable to Access Media:";
            message =
                "The user has denied permission to use video. Please grant permission to the browser to access the camera.";
            break;
        case error?.message === "MicrophonePermissionsDenied":
            headline = "Unable to Access Media:";
            message =
                "The user has denied permission to use audio. Please grant permission to the browser to access the microphone.";
            break;
        case error?.name === "NotAllowedError":
            headline = "Unable to Access Media:";

            if (error?.message === "Permission denied by system") {
                // Chrome only
                message =
                    "The operating system has blocked the browser from accessing the microphone or camera. Please check your operating system settings.";
            } else {
                message =
                    "The user has denied permission to use audio and video. Please grant permission to the browser to access the microphone and camera.";
            }

            break;
        case error?.name === "NotFoundError":
            headline = "Cannot Find Microphone or Camera:";
            message =
                "The browser cannot access the microphone or camera. Please make sure all input devices are connected and enabled.";
            break;
        case Boolean(error):
            headline = "Error Acquiring Media:";
            message = `${error?.name} ${error?.message}`;
            break;

        case !hasAudio && !hasVideo:
            headline = "No Camera or Microphone Detected:";
            message =
                "Other participants in the room will be unable to see and hear you.";
            break;

        case !hasVideo:
            headline = "No Camera Detected:";
            message =
                "Other participants in the room will be unable to see you.";
            break;

        case !hasAudio:
            headline = "No Microphone Detected:";
            message =
                "Other participants in the room will be unable to hear you.";
    }

    return {
        headline,
        message,
    };
}

const MediaErrorSnackbar = ({ error }) => {
    const { hasAudioInputDevices, hasVideoInputDevices } = useDevices();

    const { isAcquiringLocalTracks } = useVideoContext();

    const [isSnackbarDismissed, setIsSnackbarDismissed] = useState(false);

    const isSnackbarOpen =
        !isSnackbarDismissed &&
        !isAcquiringLocalTracks &&
        (Boolean(error) || !hasAudioInputDevices || !hasVideoInputDevices);

    const { headline, message } = getSnackbarContent(
        hasAudioInputDevices,
        hasVideoInputDevices,
        error
    );

    return (
        <Snackbar
            open={isSnackbarOpen}
            handleClose={() => setIsSnackbarDismissed(true)}
            headline={headline}
            message={message}
            variant="warning"
        />
    );
};

export default MediaErrorSnackbar;
