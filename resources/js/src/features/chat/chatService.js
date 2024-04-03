import axios from "axios";

const API_URL = "/api/chats";

const getChats = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

const getChat = async (id) => {
    const res = await axios.get(`${API_URL}/get/${id}`);
    return res.data;
};

const startChat = async () => {
    const res = await axios.get(`${API_URL}/new`);
    return res.data;
};

const searchMessages = async (data) => {
    const res = await axios.get(
        `${API_URL}/messages/search/${data.id}?query=${data.query}`
    );
    return res.data;
};

const sendMessage = async (data) => {
    const res = await axios.post(`${API_URL}/messages/${data.chat_id}`, data);
    return res.data;
};

const readMessage = async (id) => {
    const res = await axios.get(`${API_URL}/messages/read/${id}`);
    return res.data;
};

const deleteMessage = async (id) => {
    const res = await axios.delete(`${API_URL}/messages/delete/${id}`);
    return res.data;
};

const chatService = {
    getChats,
    startChat,
    sendMessage,
    readMessage,
    deleteMessage,
    getChat,
    searchMessages,
};

export default chatService;
