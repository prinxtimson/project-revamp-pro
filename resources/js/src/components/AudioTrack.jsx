import React, { useEffect, useRef } from "react";
import { useAppState } from "../state";

const AudioTrack = ({ track }) => {
    const { activeSinkId } = useAppState();
    const audioEl = useRef();

    useEffect(() => {
        audioEl.current = track.attach();
        audioEl.current.setAttribute("data-cy-audio-track-name", track.name);
        document.body.appendChild(audioEl.current);

        return () =>
            track.detach().forEach((el) => {
                el.remove();

                el.srcObject = null;
            });
    }, [track]);

    useEffect(() => {
        audioEl.current?.setSinkId?.(activeSinkId);

        return () => {
            audioEl.current = null;
        };
    }, [activeSinkId]);

    return null;
};

export default AudioTrack;
