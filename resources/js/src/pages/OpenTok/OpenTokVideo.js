import React from "react";
import { useParams } from "react-router-dom";
import Spinner from "react-spinner";
import classNames from "classnames";

import AccCore from "opentok-accelerator-core";
import "opentok-solutions-css";

import "./style.css";

let otCore;

/**
 * Build classes for container elements based on state
 * @param {Object} state
 */
const containerClasses = (state) => {
    const { active, meta, localAudioEnabled, localVideoEnabled } = state;
    const sharingScreen = meta ? !!meta.publisher.screen : false;
    const viewingSharedScreen = meta ? meta.subscriber.screen : false;
    const activeCameraSubscribers = meta ? meta.subscriber.camera : 0;
    const activeCameraSubscribersGt2 = activeCameraSubscribers > 2;
    const activeCameraSubscribersOdd = activeCameraSubscribers % 2;
    const screenshareActive = viewingSharedScreen || sharingScreen;
    return {
        controlClass: classNames("App-control-container", { hidden: !active }),
        localAudioClass: classNames("ots-video-control circle audio", {
            hidden: !active,
            muted: !localAudioEnabled,
        }),
        localVideoClass: classNames("ots-video-control circle video", {
            hidden: !active,
            muted: !localVideoEnabled,
        }),
        localCallClass: classNames("ots-video-control circle end-call", {
            hidden: !active,
        }),
        cameraPublisherClass: classNames("video-container", {
            hidden: !active,
            small: !!activeCameraSubscribers || screenshareActive,
            left: screenshareActive,
        }),
        screenPublisherClass: classNames("video-container", {
            hidden: !active || !sharingScreen,
        }),
        cameraSubscriberClass: classNames(
            "video-container",
            { hidden: !active || !activeCameraSubscribers },
            { "active-gt2": activeCameraSubscribersGt2 && !screenshareActive },
            { "active-odd": activeCameraSubscribersOdd && !screenshareActive },
            { small: screenshareActive }
        ),
        screenSubscriberClass: classNames("video-container", {
            hidden: !viewingSharedScreen || !active,
        }),
    };
};

const connectingMask = () => (
    <div className="App-mask">
        <Spinner />
        <div className="message with-spinner">Connecting</div>
    </div>
);

const startCallMask = (start) => (
    <div className="App-mask">
        <button className="message button clickable" onClick={start}>
            Click to Start Call{" "}
        </button>
    </div>
);

const OpenTokVideo = (props) => {
    const { URLRoomName } = useParams();
    const [state, setState] = React.useState({
        connected: false,
        active: false,
        publishers: null,
        subscribers: null,
        meta: null,
        localAudioEnabled: true,
        localVideoEnabled: true,
    });

    const otCoreOptions = {
        credentials: {
            apiKey: window[`${URLRoomName}_api_key`],
            sessionId: window[`${URLRoomName}_session_id`],
            token: window[`${URLRoomName}_token`],
        },
        // A container can either be a query selector or an HTML Element
        streamContainers(pubSub, type, data, stream) {
            return {
                publisher: {
                    camera: "#cameraPublisherContainer",
                    screen: "#screenPublisherContainer",
                },
                subscriber: {
                    camera: "#cameraSubscriberContainer",
                    screen: "#screenSubscriberContainer",
                },
            }[pubSub][type];
        },
        controlsContainer: "#controls",
        packages: ["textChat", "screenSharing", "annotation"],
        communication: {
            callProperties: null, // Using default
        },
        textChat: {
            name: ["David", "Paul", "Emma", "George", "Amanda"][
                (Math.random() * 5) | 0
            ], // eslint-disable-line no-bitwise
            waitingMessage:
                "Messages will be delivered when other users arrive",
            container: "#chat",
        },
        screenSharing: {
            extensionID: "plocfffmbcclpdifaikiikgplfnepkpo",
            annotation: true,
            externalWindow: false,
            dev: true,
            screenProperties: {
                insertMode: "append",
                width: "100%",
                height: "100%",
                showControls: false,
                style: {
                    buttonDisplayMode: "off",
                },
                videoSource: "window",
                fitMode: "contain", // Using default
            },
        },
        annotation: {
            absoluteParent: {
                publisher: ".App-video-container",
                subscriber: ".App-video-container",
            },
        },
    };

    React.useEffect(() => {
        otCore = new AccCore(otCoreOptions);
        otCore.connect().then(() => setState({ ...state, connected: true }));
        const events = [
            "subscribeToCamera",
            "unsubscribeFromCamera",
            "subscribeToScreen",
            "unsubscribeFromScreen",
            "startScreenShare",
            "endScreenShare",
        ];

        events.forEach((event) =>
            otCore.on(event, ({ publishers, subscribers, meta }) => {
                setState({ ...state, publishers, subscribers, meta });
            })
        );
    }, []);

    const startCall = () => {
        otCore
            .startCall()
            .then(({ publishers, subscribers, meta }) => {
                setState({
                    ...state,
                    publishers,
                    subscribers,
                    meta,
                    active: true,
                });
            })
            .catch((error) => console.log(error));
    };

    const endCall = () => {
        otCore.endCall();
        setState({ ...state, active: false });
    };

    const toggleLocalAudio = () => {
        otCore.toggleLocalAudio(!state.localAudioEnabled);
        setState({ ...state, localAudioEnabled: !state.localAudioEnabled });
    };

    const toggleLocalVideo = () => {
        otCore.toggleLocalVideo(!state.localVideoEnabled);
        setState({ ...state, localVideoEnabled: !state.localVideoEnabled });
    };

    const { connected, active } = state;
    const {
        localAudioClass,
        localVideoClass,
        localCallClass,
        controlClass,
        cameraPublisherClass,
        screenPublisherClass,
        cameraSubscriberClass,
        screenSubscriberClass,
    } = containerClasses(state);

    return (
        <div className="App">
            <div className="App-header">
                <h1>Tritek Live Support</h1>
            </div>
            <div className="App-main">
                <div className="App-video-container">
                    {!connected && connectingMask()}
                    {connected && !active && startCallMask(startCall)}
                    <div
                        id="cameraPublisherContainer"
                        className={cameraPublisherClass}
                    />
                    <div
                        id="screenPublisherContainer"
                        className={screenPublisherClass}
                    />
                    <div
                        id="cameraSubscriberContainer"
                        className={cameraSubscriberClass}
                    />
                    <div
                        id="screenSubscriberContainer"
                        className={screenSubscriberClass}
                    />
                </div>
                <div id="controls" className={controlClass}>
                    <div
                        className={localAudioClass}
                        onClick={toggleLocalAudio}
                    />
                    <div
                        className={localVideoClass}
                        onClick={toggleLocalVideo}
                    />
                    <div className={localCallClass} onClick={endCall} />
                </div>
                <div id="chat" className="App-chat-container" />
            </div>
        </div>
    );
};

export default OpenTokVideo;
