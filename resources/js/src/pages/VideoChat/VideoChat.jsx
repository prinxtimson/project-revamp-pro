import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

import MenuBar from "../../components/MenuBar/MenuBar";
import MobileTopMenuBar from "../../components/MobileTopMenuBar";
import PreJoinScreens from "../../components/PreJoinScreen/PreJoinScreens";
import ReconnectingNotification from "../../components/ReconnectingNotification";
import RecordingNotifications from "../../components/RecordingNotifications";
import Room from "../../components/Room";

import useHeight from "../../hooks/useHeight";
import useRoomState from "../../hooks/useRoomState";

const VideoChat = () => {
    const { URLRoomID } = useParams();
    let [urlSearchParams] = useSearchParams();
    const [password] = useState(urlSearchParams.get("pwd"));
    const [name] = useState(urlSearchParams.get("name"));
    const roomState = useRoomState();

    const { isAuthenticated } = useSelector((state) => state.auth);
    const { isLoading } = useSelector((state) => state.livecall);

    const height = useHeight();

    return (
        <div
            className="tw-flex-grow tw-grid tw-grid-flow-row tw-auto-rows-fr "
            style={{ height }}
        >
            {roomState === "disconnected" ? (
                <PreJoinScreens
                    URLRoomID={URLRoomID}
                    password={password}
                    candidateName={name}
                />
            ) : (
                <div className="tw-overflow-hidden tw-pb-3 sm:tw-pb-6 tw-bg-black">
                    <ReconnectingNotification
                        isAuthenticated={isAuthenticated}
                    />
                    <RecordingNotifications />
                    <MobileTopMenuBar password={password} />
                    <Room />
                    <MenuBar password={password} />
                </div>
            )}
        </div>
    );
};

export default VideoChat;
