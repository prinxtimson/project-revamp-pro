import axios from "axios";

const API_URL = "/api/tickets";

const getTickets = async () => {
    const res = await axios.get(API_URL);

    return res.data;
};

const getTicketsByPage = async (page) => {
    const res = await axios.get(`${API_URL}?page=${page}`);

    return res.data;
};

const getTicketById = async (id) => {
    const res = await axios.get(API_URL + "/" + id);

    return res.data;
};

const submitTicket = async (data) => {
    const res = await axios.post(API_URL, data);

    return res.data;
};

const updateTicket = async (data) => {
    const res = await axios.put(`${API_URL}/${data.id}`, data);

    return res.data;
};

const deleteTicket = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);

    return res.data;
};

const ticketService = {
    getTickets,
    getTicketById,
    submitTicket,
    getTicketsByPage,
    updateTicket,
    deleteTicket,
};

export default ticketService;
