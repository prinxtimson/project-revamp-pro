import axios from "axios";

const API_URL = "/api/livecall";

const getLivecalls = async () => {
    const res = await axios.get(API_URL);

    return res.data;
};

const getLivecallsByPage = async (page) => {
    const res = await axios.get(`${API_URL}?page=${page}`);

    return res.data;
};

const getConnectedLivecalls = async () => {
    const res = await axios.get(`${API_URL}/connected/on`);

    return res.data;
};

const requestLivecall = async (data) => {
    const res = await axios.post(API_URL, data);

    return res.data;
};

const getLivecallById = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);

    return res.data;
};

const leaveLivecall = async (id) => {
    const res = await axios.get(`${API_URL}/leave/${id}`);

    return res.data;
};

const answerLivecall = async (data) => {
    const res = await axios.post("/api/room", data);

    return res.data;
};

const endLivecall = async (id) => {
    const res = await axios.get(`/api/room/end/${id}`);

    return res.data;
};

const updateLivecall = async (data) => {
    const res = await axios.put(`${API_URL}/${data.id}`, data);

    return res.data;
};

const getWaitingListPosition = async (id) => {
    const res = await axios.get(`${API_URL}/waiting/position/${id}`);

    return res.data;
};

const deleteLivecall = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);

    return res.data;
};

const livecallService = {
    getLivecalls,
    getLivecallsByPage,
    getConnectedLivecalls,
    requestLivecall,
    getLivecallById,
    leaveLivecall,
    answerLivecall,
    endLivecall,
    updateLivecall,
    getWaitingListPosition,
    deleteLivecall,
};

export default livecallService;
