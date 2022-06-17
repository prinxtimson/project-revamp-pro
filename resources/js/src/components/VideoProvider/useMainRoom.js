import { useCallback, useState } from "react";

const axios = window.axios;

export default function useMainRoom() {
    const [mainRoom, setMainRoom] = useState(null);

    const getMainRoom = useCallback((roomId) => {
        return axios
            .get(`/api/room/${roomId}`)
            .then((res) => {
                setMainRoom(res.data);
                window.Echo.channel(`videoroom.${res.data.id}`).listen(
                    "BreakoutRoomCreated",
                    (e) => {
                        console.log(e);
                        setMainRoom(e.videoroom);
                    }
                );
            })
            .catch((err) => console.log(err));
    }, []);

    return { mainRoom, getMainRoom };
}
