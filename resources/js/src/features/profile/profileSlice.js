import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import profileService from "./profileService";

const initialState = {
    users: null,
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

export const getProfiles = createAsyncThunk("profile/get", async (thunkAPI) => {
    try {
        return await profileService.getProfiles();
    } catch (err) {
        if (err.response.status === 401) {
            localStorage.removeItem("user");
            thunkAPI.dispatch(clearUser());
        }
        const msg =
            (err.response && err.response.data && err.response.data.message) ||
            err.message ||
            err.toString();

        return thunkAPI.rejectWithValue(msg);
    }
});

export const getProfilesByPage = createAsyncThunk(
    "profile/get-by-page",
    async (page, thunkAPI) => {
        try {
            return await profileService.getProfilesByPage(page);
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

export const addNewUser = createAsyncThunk(
    "profile/new",
    async (data, thunkAPI) => {
        try {
            return await profileService.addNewUser(data);
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

export const updateUser = createAsyncThunk(
    "profile/update",
    async (data, thunkAPI) => {
        try {
            return await profileService.updateUser(data);
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

export const enableUser = createAsyncThunk(
    "profile/enable",
    async (id, thunkAPI) => {
        try {
            return await profileService.enableUser(id);
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

export const disableUser = createAsyncThunk(
    "profile/disable",
    async (id, thunkAPI) => {
        try {
            return await profileService.disableUser(id);
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

export const approveUser = createAsyncThunk(
    "profile/approve",
    async (id, thunkAPI) => {
        try {
            return await profileService.approveUser(id);
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

export const deleteUser = createAsyncThunk(
    "profile/delete",
    async (id, thunkAPI) => {
        try {
            return await profileService.deleteUser(id);
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

export const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
        },
        clear: (state) => {
            state.users = null;
            state.user = null;
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProfiles.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProfiles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(getProfiles.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getProfilesByPage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProfilesByPage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(getProfilesByPage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(addNewUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addNewUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(addNewUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(enableUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(enableUser.fulfilled, (state, action) => {
                let index = state.users.data.findIndex(
                    (item) => item.id === payload.id
                );
                state.users.data.splice(index, 1, payload);

                state.isLoading = false;
                state.isSuccess = true;
                state.users = { ...state.users };
                state.user = action.payload;
            })
            .addCase(addNewUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                let index = state.users.data.findIndex(
                    (item) => item.id === payload.id
                );
                state.users.data.splice(index, 1, payload);

                state.isLoading = false;
                state.isSuccess = true;
                state.users = { ...state.users };
                state.user = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(disableUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(disableUser.fulfilled, (state, action) => {
                let index = state.users.data.findIndex(
                    (item) => item.id === action.payload.id
                );
                state.users.data.splice(index, 1, action.payload);

                state.isLoading = false;
                state.isSuccess = true;
                state.users = { ...state.users };
                state.user = action.payload;
            })
            .addCase(disableUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(approveUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(approveUser.fulfilled, (state, action) => {
                let index = state.users.data.findIndex(
                    (item) => item.id === action.payload.id
                );
                state.users.data.splice(index, 1, action.payload);

                state.isLoading = false;
                state.isSuccess = true;
                state.users = { ...state.users };
                state.user = action.payload;
            })
            .addCase(approveUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                let data = state.users.data.filter(
                    (item) => item.id === action.payload.id
                );

                state.isLoading = false;
                state.isSuccess = true;
                state.users = { ...state.users, data };
                state.user = action.payload;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, clear } = profileSlice.actions;
export default profileSlice.reducer;
