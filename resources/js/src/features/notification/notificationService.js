import axios from "axios";

const API_URL = "/api/notifications";

const getNotification = async () => {
    const res = await axios.get(API_URL);

    return res.data;
};

const markNotification = async () => {
    const res = await axios.get(`${API_URL}/mark`);

    return res.data;
};

const notificationService = {
    getNotification,
    markNotification,
};

export default notificationService;
