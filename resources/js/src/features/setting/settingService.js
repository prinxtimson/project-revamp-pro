import axios from "axios";

const API_URL = "/api/settings";

const getSettings = async () => {
    const res = await axios.get(API_URL);

    return res.data;
};

const updateSettings = async (data) => {
    const res = await axios.post(API_URL, data);

    return res.data;
};

const settingService = { getSettings, updateSettings };

export default settingService;
