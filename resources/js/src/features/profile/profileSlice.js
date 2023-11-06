import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import profileService from "./profileService";

const initialState = {
    users: null,
    user: null,
    type: "",
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

export const getProfiles = createAsyncThunk(
    "profile/get-all",
    async (args, thunkAPI) => {
        try {
            return await profileService.getProfiles();
        } catch (err) {
            console.log(err);
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

export const getProfilesByPage = createAsyncThunk(
    "profile/get-by-page",
    async (page, thunkAPI) => {
        try {
            return await profileService.getProfilesByPage(page);
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

export const getAgents = createAsyncThunk(
    "profile/get-all-agents",
    async (args, thunkAPI) => {
        try {
            return await profileService.getAgents();
        } catch (err) {
            console.log(err);
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

export const getAgentsByPage = createAsyncThunk(
    "profile/get-agents-by-page",
    async (page, thunkAPI) => {
        try {
            return await profileService.getAgentsByPage(page);
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

export const addNewUser = createAsyncThunk(
    "profile/new",
    async (data, thunkAPI) => {
        try {
            return await profileService.addNewUser(data);
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

export const getProfileById = createAsyncThunk(
    "profile/get-singe-user",
    async (id, thunkAPI) => {
        try {
            return await profileService.getProfileById(id);
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
            state.type = "";
        },
        clear: (state) => {
            state.users = null;
            state.user = null;
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
            state.type = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProfiles.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProfiles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.type = action.type;
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
                state.type = action.type;
                state.users = action.payload;
            })
            .addCase(getProfilesByPage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAgents.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAgents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.type = action.type;
                state.users = action.payload;
            })
            .addCase(getAgents.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAgentsByPage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAgentsByPage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.type = action.type;
                state.users = action.payload;
            })
            .addCase(getAgentsByPage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getProfileById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProfileById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.user = action.payload;
            })
            .addCase(getProfileById.rejected, (state, action) => {
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
                state.type = action.type;
                state.user = action.payload.user;
                state.message = action.payload.msg;
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
                let index = state.users?.data.findIndex(
                    (item) => item.id === action.payload.id
                );
                state.users?.data.splice(index, 1, action.payload);

                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.users = { ...state.users };
                state.user = action.payload;
            })
            .addCase(enableUser.rejected, (state, action) => {
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
                state.user = action.payload.user;
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
                state.type = action.type;
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
                state.type = action.type;
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
                state.type = action.type;
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
