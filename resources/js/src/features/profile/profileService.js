import axios from "axios";

const API_URL = "/api";

const getProfiles = async () => {
    const res = await axios.get(`${API_URL}/users`);

    return res.data;
};

const getProfilesByPage = async (page) => {
    const res = await axios.get(`${API_URL}/users?page=${page}`);

    return res.data;
};

const getProfileById = async (id) => {
    const res = await axios.get(`${API_URL}/users/${id}`);

    return res.data;
};

const getAgents = async () => {
    const res = await axios.get(`${API_URL}/agents`);

    return res.data;
};

const getAgentsByPage = async (page) => {
    const res = await axios.get(`${API_URL}/agents?page=${page}`);

    return res.data;
};

const addNewUser = async (data) => {
    const res = await axios.post(`${API_URL}/users`, data);

    return res.data;
};

const updateUser = async (data) => {
    const res = await axios.post(`${API_URL}/users/${data.id}`, data.formData);

    return res.data;
};

const enableUser = async (id) => {
    const res = await axios.put(`${API_URL}/users/enable/${id}`);

    return res.data;
};

const disableUser = async (id) => {
    const res = await axios.put(`${API_URL}/users/disable/${id}`);

    return res.data;
};

const approveUser = async (id) => {
    const res = await axios.put(`${API_URL}/users/approved/${id}`);

    return res.data;
};

const deleteUser = async (id) => {
    const res = await axios.delete(`${API_URL}/users/${id}`);

    return res.data;
};

const profileService = {
    getProfiles,
    getProfilesByPage,
    addNewUser,
    enableUser,
    disableUser,
    approveUser,
    deleteUser,
    updateUser,
    getAgents,
    getAgentsByPage,
    getProfileById,
};

export default profileService;
