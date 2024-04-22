import axios from "axios";

const API_URL = "/api/report";

const saveReport = async (data) => {
    const res = await axios.post(`${API_URL}/save`, data);

    return res.data;
};

const generateReport = async (data) => {
    const res = await axios.post(`${API_URL}/generate`, data);

    return res.data;
};

const shareReport = async (data) => {
    const res = await axios.post(`${API_URL}/share`, data);

    return res.data;
};

const shareAllReport = async (data) => {
    const res = await axios.post(`${API_URL}/share/all`, data);

    return res.data;
};

const reportService = {
    saveReport,
    generateReport,
    shareAllReport,
    shareReport,
};

export default reportService;
