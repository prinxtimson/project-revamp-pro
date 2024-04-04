import axios from "axios";

const API_URL = "/api/tutorials";

const getTutorials = async () => {
    const res = await axios.get(API_URL);

    return res.data;
};

const getTutorialtById = async (id) => {
    const res = await axios.get(`${API_URL}/view/${id}`);

    return res.data;
};

const createTutorial = async (data) => {
    const res = await axios.post(API_URL, data);

    return res.data;
};

const updateTutorial = async (data) => {
    const res = await axios.put(`${API_URL}/${data.id}`, data);

    return res.data;
};

const deleteTutorial = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);

    return res.data;
};

const tutorialService = {
    getTutorials,
    getTutorialtById,
    createTutorial,
    updateTutorial,
    deleteTutorial,
};

export default tutorialService;
