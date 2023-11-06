const axios = window.axios;

const API_URL = "/api";

const register = async (userData) => {
    const res = await axios.post(`${API_URL}/register`, userData);

    return res.data;
};

const getCurrentUser = async () => {
    const res = await axios.get(`${API_URL}/me`);

    // if (res.data) {
    //     localStorage.setItem("user", JSON.stringify(res.data));
    // }

    return res.data;
};

const isEmailVerify = async () => {
    const res = await axios.get(`${API_URL}/email/verify`);

    return res.data;
};

const logout = async () => {
    const res = await axios.post(`${API_URL}/logout`);

    return res.data;
};

const login = async (userData) => {
    await axios.get(`/sanctum/csrf-cookie`);
    const res = await axios.post(`/login`, userData);

    return res.data;
};

const forgotPass = async (email) => {
    const res = await axios.post(API_URL + "/forgot-password", email);

    return res.data;
};

const resetPass = async (data) => {
    const res = await axios.post(API_URL + "/reset-password", data);

    return res.data;
};

const changePass = async (data) => {
    const res = await axios.put(API_URL + "/change-password", data);

    return res.data;
};

const updateUser = async (data) => {
    const res = await axios.post(API_URL + "/update", data);

    return res.data;
};

const resendVerification = async () => {
    const res = await axios.post(`${API_URL}/email/verification-notification`);
    return res.data;
};

const verifyOTP = async (data) => {
    const res = await axios.post("/two-factor-auth", data);

    return res.data;
};

const resendOTP = async () => {
    const res = await axios.get("/two-factor-auth/resent");

    return res.data;
};

const deleteAccount = async () => {
    const res = await axios.delete(`${API_URL}/delete`);

    return res.data;
};

const authService = {
    register,
    logout,
    login,
    updateUser,
    forgotPass,
    resetPass,
    changePass,
    resendVerification,
    getCurrentUser,
    isEmailVerify,
    verifyOTP,
    resendOTP,
    deleteAccount,
};

export default authService;
