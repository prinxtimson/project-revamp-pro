import { isMobile, removeUndefineds } from ".";
import { useAppState } from "../state";

export default function useConnectionOptions() {
    const { roomType, settings } = useAppState();

    const connectionOptions = {
        bandwidthProfile: {
            video: {
                mode: settings.bandwidthProfileMode,
                dominantSpeakerPriority: settings.dominantSpeakerPriority,
                trackSwitchOffMode: settings.trackSwitchOffMode,
                contentPreferencesMode: settings.contentPreferencesMode,
                clientTrackSwitchOffControl:
                    settings.clientTrackSwitchOffControl,
            },
        },
        dominantSpeaker: true,
        networkQuality: { local: 1, remote: 1 },

        maxAudioBitrate: Number(settings.maxAudioBitrate),

        preferredVideoCodecs: [
            {
                codec: "VP8",
                simulcast: roomType !== "peer-to-peer" && roomType !== "go",
            },
        ],

        environment: process.env.REACT_APP_TWILIO_ENVIRONMENT,
    };

    if (isMobile && connectionOptions?.bandwidthProfile?.video) {
        connectionOptions.bandwidthProfile.video.maxSubscriptionBitrate = 2500000;
    }

    if (process.env.REACT_APP_TWILIO_ENVIRONMENT === "dev") {
        connectionOptions.wsServer = "wss://us2.vss.dev.twilio.com/signaling";
    }

    return removeUndefineds(connectionOptions);
}
