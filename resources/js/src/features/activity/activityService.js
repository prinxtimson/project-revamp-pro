import axios from "axios";

const API_URL = "/api/activities";

const getActivities = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

const getAllActivities = async () => {
    const res = await axios.get(`${API_URL}/all`);
    return res.data;
};

const activityService = { getActivities, getAllActivities };

export default activityService;
