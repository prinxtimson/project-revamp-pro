import React, { useState, useEffect } from "react";
import DeviceSelectionScreen from "./DeviceSelectionScreen";
import IntroContainer from "../IntroContainer";
import MediaErrorSnackbar from "./MediaErrorSnackbar";
import { useParams } from "react-router-dom";
import useVideoContext from "../../hooks/useVideoContext";
import { connect } from "react-redux";

export const Steps = {
    roomNameStep: 1,
    deviceSelectionStep: 2,
};

const PreJoinScreens = ({ user }) => {
    const { getAudioAndVideoTracks } = useVideoContext();
    const { URLRoomName } = useParams();
    const [step, setStep] = useState(Steps.deviceSelectionStep);

    const [name, setName] = useState(user?.name);
    const [roomName, setRoomName] = useState("");

    const [mediaError, setMediaError] = useState();

    useEffect(() => {
        if (URLRoomName) {
            setRoomName(URLRoomName);
            if (user?.name) {
                setStep(Steps.deviceSelectionStep);
            }
        }
    }, [user, URLRoomName]);

    useEffect(() => {
        if (step === Steps.deviceSelectionStep && !mediaError) {
            getAudioAndVideoTracks().catch((error) => {
                console.log("Error acquiring local media:");
                console.dir(error);
                setMediaError(error);
            });
        }
    }, [getAudioAndVideoTracks, step, mediaError]);

    return (
        <IntroContainer>
            <MediaErrorSnackbar error={mediaError} />
            {step === Steps.deviceSelectionStep && (
                <DeviceSelectionScreen
                    name={name}
                    roomName={roomName}
                    setStep={setStep}
                />
            )}
        </IntroContainer>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(PreJoinScreens);
