import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import activityService from "./activityService";

const initialState = {
    activities: [],
    activity: null,
    type: "",
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

export const getActivities = createAsyncThunk(
    "activity/get",
    async (args, thunkAPI) => {
        try {
            return await activityService.getActivities();
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

export const getAllActivities = createAsyncThunk(
    "activity/all",
    async (args, thunkAPI) => {
        try {
            return await activityService.getAllActivities();
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

export const activitySlice = createSlice({
    initialState,
    name: "activity",
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
            state.type = "";
        },
        clear: (state) => {
            state.activity = null;
            state.activities = [];
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
            state.type = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getActivities.pending, (state, action) => {
                state.isLoading = true;
                state.type = action.type;
            })
            .addCase(getActivities.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.activities = action.payload;
                state.type = action.type;
            })
            .addCase(getActivities.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            })
            .addCase(getAllActivities.pending, (state, action) => {
                state.isLoading = true;
                state.type = action.type;
            })
            .addCase(getAllActivities.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.activities = action.payload;
                state.type = action.type;
            })
            .addCase(getAllActivities.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            });
    },
});

export const { reset, clear } = activitySlice.actions;
export default activitySlice.reducer;
