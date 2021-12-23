export const initialSettings = {
    trackSwitchOffMode: undefined,
    dominantSpeakerPriority: "standard",
    bandwidthProfileMode: "collaboration",
    maxAudioBitrate: "16000",
    contentPreferencesMode: "auto",
    clientTrackSwitchOffControl: "auto",
};

export const inputLabels = (() => {
    const target = {};
    for (const setting in initialSettings) {
        target[setting] = setting;
    }
    return target;
})();

export function settingsReducer(state, action) {
    return {
        ...state,
        [action.name]: action.value === "default" ? undefined : action.value,
    };
}
