import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import settingService from "./settingService";

const initialState = {
    settings: [],
    type: "",
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

export const getSettings = createAsyncThunk(
    "setting/get",
    async (args, thunkAPI) => {
        try {
            return await settingService.getSettings();
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

export const updateSettings = createAsyncThunk(
    "setting/update",
    async (args, thunkAPI) => {
        try {
            return await settingService.updateSettings(args);
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

export const settingSlice = createSlice({
    name: "setting",
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
            state.settings = [];
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
            state.type = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.type = action.type;
                state.settings = action.payload;
            })
            .addCase(getSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateSettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.type = action.type;
                state.settings = action.payload;
            })
            .addCase(updateSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, clear } = settingSlice.actions;
export default settingSlice.reducer;
