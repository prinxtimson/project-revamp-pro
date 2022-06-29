import { useState, useEffect } from "react";

export default function useIsTrackSwitchedOff(track) {
    const [isSwitchedOff, setIsSwitchedOff] = useState(
        track && track.isSwitchedOff
    );

    useEffect(() => {
        // Reset the value if the 'track' variable changes
        setIsSwitchedOff(track && track.isSwitchedOff);

        if (track) {
            const handleSwitchedOff = () => setIsSwitchedOff(true);
            const handleSwitchedOn = () => setIsSwitchedOff(false);
            track.on("switchedOff", handleSwitchedOff);
            track.on("switchedOn", handleSwitchedOn);
            return () => {
                track.off("switchedOff", handleSwitchedOff);
                track.off("switchedOn", handleSwitchedOn);
                setIsSwitchedOff(null);
            };
        }
        return () => setIsSwitchedOff(null);
    }, [track]);

    return !!isSwitchedOff;
}
