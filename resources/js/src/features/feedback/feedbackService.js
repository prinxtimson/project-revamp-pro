import axios from "axios";

const API_URL = "/api/feedback";

const getFeedbacks = async () => {
    const res = await axios.get(API_URL);

    return res.data;
};

const getFeedbacksByAgent = async (id) => {
    const res = await axios.get(`${API_URL}/agent/${id}`);

    return res.data;
};

const filterFeedback = async ({ user, from, to, category }) => {
    const res = await axios.get(
        `${API_URL}/filter?user_id=${user}&from=${from}&to=${to}&category=${category}`
    );

    return res.data;
};

const getFeedback = async (id) => {
    const res = await axios.get(`${API_URL}/show/${id}`);

    return res.data;
};

const sendFeedback = async (data) => {
    const res = await axios.post(API_URL, data);

    return res.data;
};

const updateFeedback = async (data) => {
    const res = await axios.put(`${API_URL}/${data.id}`, data);

    return res.data;
};

const deleteFeedback = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);

    return res.data;
};

const feedbackService = {
    getFeedbacks,
    getFeedback,
    filterFeedback,
    sendFeedback,
    getFeedbacksByAgent,
    updateFeedback,
    deleteFeedback,
};

export default feedbackService;
