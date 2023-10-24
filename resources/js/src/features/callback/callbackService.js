import axios from "axios";

const API_URL = "/api";

const getCallbacks = async () => {
    const res = await axios.get(`${API_URL}/callback`, userData);

    return res.data;
};

const getCallbacksByPage = async (page) => {
    const res = await axios.get(`${API_URL}/callback?page=${page}`);

    return res.data;
};

const getCallbacksByDate = async (date) => {
    const res = await axios.get(`${API_URL}/callback/search/${date}}`);

    return res.data;
};

const requestCallback = async (data) => {
    const res = await axios.post(`${API_URL}/callback`, data);

    return res.data;
};

const getCallbackById = async (id) => {
    const res = await axios.get(`${API_URL}/callback/${id}`);

    return res.data;
};

const updateCallback = async (data) => {
    const res = await axios.put(`${API_URL}/callback/${data.id}`, data);

    return res.data;
};

const callbackSuccessful = async (id) => {
    const res = await axios.put(`${API_URL}/callback/success/${id}`);

    return res.data;
};

const callbackFailed = async (id) => {
    const res = await axios.put(`${API_URL}/callback/fail/${id}`);

    return res.data;
};

const cancelCallback = async (id) => {
    const res = await axios.put(`${API_URL}/callback/cancel/${id}`);

    return res.data;
};

const deleteCallback = async (id) => {
    const res = await axios.delete(`${API_URL}/callback/${id}`);

    return res.data;
};

const callbackService = {
    getCallbacks,
    getCallbacksByPage,
    getCallbacksByDate,
    getCallbackById,
    updateCallback,
    requestCallback,
    callbackFailed,
    callbackSuccessful,
    cancelCallback,
    deleteCallback,
};

export default callbackService;
