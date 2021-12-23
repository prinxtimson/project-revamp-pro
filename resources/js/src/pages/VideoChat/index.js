import React from "react";
import VideoChat from "./VideoChat";
import AppStateProvider, { useAppState } from "../../state";
import { VideoProvider } from "../../components/VideoProvider";
import useConnectionOptions from "../../utils/useConnectionOptions";
import UnsupportedBrowserWarning from "../../components/UnsupportedBrowserWarning";

const VideoApp = () => {
    const { error, setError } = useAppState();
    const connectionOptions = useConnectionOptions();

    return (
        <VideoProvider options={connectionOptions} onError={setError}>
            <VideoChat />
        </VideoProvider>
    );
};

export default () => {
    return (
        <UnsupportedBrowserWarning>
            <AppStateProvider>
                <VideoApp />
            </AppStateProvider>
        </UnsupportedBrowserWarning>
    );
};
