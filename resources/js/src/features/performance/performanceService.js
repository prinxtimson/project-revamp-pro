import axios from "axios";

const API_URL = "/api/performance-tracking";

const getPerformances = async () => {
    const res = await axios.get(API_URL);

    return res.data;
};

const getPerformanceById = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);

    return res.data;
};

const submitPerformance = async (data) => {
    const res = await axios.post(API_URL, data);

    return res.data;
};

const updatePerformance = async (data) => {
    const res = await axios.put(`${API_URL}/${data.id}`, data);

    return res.data;
};

const deletePerformance = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);

    return res.data;
};

const performanceService = {
    getPerformances,
    getPerformanceById,
    submitPerformance,
    updatePerformance,
    deletePerformance,
};

export default performanceService;
