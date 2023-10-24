import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationService from "./notificationService";

const initialState = {
    notifications: null,
    type: "",
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

export const getNotification = createAsyncThunk(
    "notification/get",
    async (args, thunkAPI) => {
        try {
            return await notificationService.getNotification();
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

export const markNotification = createAsyncThunk(
    "notification/mark",
    async (args, thunkAPI) => {
        try {
            return await notificationService.markNotification();
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

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.type = "";
            state.message = "";
        },
        onNewNotification: (state, action) => {
            if (
                state.notifications.data.filter(
                    (val) => val.id === action.payload.id
                ).length === 0
            ) {
                let data = [action.payload, ...state.notifications.data];
                let count = state.notifications.count + 1;
                state.notifications = { data, count };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotification.pending, (state, action) => {
                state.isLoading = true;
                state.type = action.type;
            })
            .addCase(getNotification.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.notifications = action.payload;
                state.type = action.type;
            })
            .addCase(getNotification.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            })
            .addCase(markNotification.pending, (state, action) => {
                state.isLoading = true;
                state.type = action.type;
            })
            .addCase(markNotification.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.notifications = action.payload;
                state.type = action.type;
            })
            .addCase(markNotification.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            });
    },
});

export const { reset, onNewNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
