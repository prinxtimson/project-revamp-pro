import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const initialState = {
    user: null,
    isAuthenticated: false,
    type: "",
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

//  user
export const register = createAsyncThunk(
    "auth/register",
    async (data, thunkAPI) => {
        try {
            return await authService.register(data);
        } catch (err) {
            const msg =
                (err.response &&
                    err.response.data &&
                    err.response.data.message) ||
                err.message ||
                err.toString();

            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
    try {
        return await authService.login(data);
    } catch (err) {
        const msg =
            (err.response && err.response.data && err.response.data.message) ||
            err.message ||
            err.toString();

        return thunkAPI.rejectWithValue(msg);
    }
});

export const updateUser = createAsyncThunk(
    "auth/update",
    async (data, thunkAPI) => {
        try {
            return await authService.updateUser(data);
        } catch (err) {
            const msg =
                (err.response &&
                    err.response.data &&
                    err.response.data.message) ||
                err.message ||
                err.toString();

            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const forgotPass = createAsyncThunk(
    "auth/forgot-password",
    async (email, thunkAPI) => {
        try {
            return await authService.forgotPass(email);
        } catch (err) {
            const msg =
                (err.response &&
                    err.response.data &&
                    err.response.data.message) ||
                err.message ||
                err.toString();

            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const resetPass = createAsyncThunk(
    "auth/reset-password",
    async (data, thunkAPI) => {
        try {
            const res = await authService.resetPass(data);

            return res;
        } catch (err) {
            const msg =
                (err.response &&
                    err.response.data &&
                    err.response.data.message) ||
                err.message ||
                err.toString();

            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const changePass = createAsyncThunk(
    "auth/change-password",
    async (data, thunkAPI) => {
        try {
            return await authService.changePass(data);
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem("user");
                thunkAPI.dispatch(clearUser());
            }
            const msg =
                (err.response &&
                    err.response.data &&
                    err.response.data.message) ||
                err.message ||
                err.toString();

            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const getCurrentUser = createAsyncThunk(
    "auth/me",
    async (args, thunkAPI) => {
        try {
            return await authService.getCurrentUser();
        } catch (err) {
            const msg =
                (err.response &&
                    err.response.data &&
                    err.response.data.message) ||
                err.message ||
                err.toString();

            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const resendVerification = createAsyncThunk(
    "auth/resend-verification",
    async (args, thunkAPI) => {
        try {
            return await authService.resendVerification();
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem("user");
                thunkAPI.dispatch(clearUser());
            }
            const msg =
                (err.response &&
                    err.response.data &&
                    err.response.data.message) ||
                err.message ||
                err.toString();

            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const verifyOTP = createAsyncThunk(
    "auth/verify-otp",
    async (data, thunkAPI) => {
        try {
            return await authService.verifyOTP(data);
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem("user");
                thunkAPI.dispatch(clearUser());
            }
            const msg =
                (err.response &&
                    err.response.data &&
                    err.response.data.message) ||
                err.message ||
                err.toString();

            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const resendOTP = createAsyncThunk(
    "auth/resend-otp",
    async (args, thunkAPI) => {
        try {
            return await authService.resendOTP();
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem("user");
                thunkAPI.dispatch(clearUser());
            }
            const msg =
                (err.response &&
                    err.response.data &&
                    err.response.data.message) ||
                err.message ||
                err.toString();

            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const deleteAccount = createAsyncThunk(
    "auth/delete-account",
    async (args, thunkAPI) => {
        try {
            return await authService.deleteAccount();
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem("user");
                thunkAPI.dispatch(clearUser());
            }
            const msg =
                (err.response &&
                    err.response.data &&
                    err.response.data.message) ||
                err.message ||
                err.toString();

            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const archiveAccount = createAsyncThunk(
    "auth/archive-account",
    async (args, thunkAPI) => {
        try {
            return await authService.archiveAccount();
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem("user");
                thunkAPI.dispatch(clearUser());
            }
            const msg =
                (err.response &&
                    err.response.data &&
                    err.response.data.message) ||
                err.message ||
                err.toString();

            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async () => {
    return await authService.logout();
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
            state.type = "";
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.message = action.payload.message;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.message = "Profile update successful";
                state.user = action.payload.user;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isAuthenticated = false;
                state.isSuccess = true;
                state.type = action.type;
                state.user = null;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(deleteAccount.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteAccount.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.isAuthenticated = false;
                state.user = null;
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(archiveAccount.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(archiveAccount.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.isAuthenticated = false;
                state.user = null;
            })
            .addCase(archiveAccount.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(getCurrentUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.type = action.type;
                state.user = action.payload.user;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(changePass.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(changePass.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.message = action.payload.message;
            })
            .addCase(changePass.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            })
            .addCase(forgotPass.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(forgotPass.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.message = action.payload.message;
            })
            .addCase(forgotPass.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            })
            .addCase(resendVerification.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(resendVerification.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.message = action.payload.message;
            })
            .addCase(resendVerification.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            })
            .addCase(verifyOTP.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.message = "verification successful";
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            })
            .addCase(resendOTP.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(resendOTP.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.message = "New OTP code had been sent";
            })
            .addCase(resendOTP.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            })
            .addCase(resetPass.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(resetPass.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.message = action.payload.message;
            })
            .addCase(resetPass.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            });
    },
});

export const { reset, clearUser } = authSlice.actions;
export default authSlice.reducer;
