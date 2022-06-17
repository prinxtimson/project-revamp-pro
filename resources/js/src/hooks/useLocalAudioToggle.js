import { useCallback } from "react";
import useIsTrackEnabled from "./useIsTrackEnabled";
import useVideoContext from "./useVideoContext";

export default function useLocalAudioToggle() {
    const { localTracks, room } = useVideoContext();
    const audioTrack = localTracks.find((track) => track.kind === "audio");
    const isEnabled = useIsTrackEnabled(audioTrack);

    const toggleAudioEnabled = useCallback(() => {
        if (audioTrack) {
            audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
        }
    }, [audioTrack, room]);

    return [isEnabled, toggleAudioEnabled];
}
