import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import performanceService from "./performanceService";

const initialState = {
    performances: [],
    performance: null,
    type: "",
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

export const getPerformances = createAsyncThunk(
    "performance/get-all",
    async (args, thunkAPI) => {
        try {
            return await performanceService.getPerformances();
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

export const getPerformanceById = createAsyncThunk(
    "performance/get-single",
    async (id, thunkAPI) => {
        try {
            return await performanceService.getPerformanceById(id);
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

export const submitPerformance = createAsyncThunk(
    "performance/create",
    async (data, thunkAPI) => {
        try {
            await performanceService.submitPerformance(data);
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

export const updatePerformance = createAsyncThunk(
    "performance/update",
    async (data, thunkAPI) => {
        try {
            return await performanceService.updatePerformance(data);
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

export const deletePerformance = createAsyncThunk(
    "performance/delete",
    async (id, thunkAPI) => {
        try {
            const res = await performanceService.deletePerformance(id);

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

export const performanceSlice = createSlice({
    name: "performance",
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
        },
        clear: (state) => {
            state.performances = [];
            state.performance = null;
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPerformances.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPerformances.fulfilled, (state, action) => {
                state.isLoading = false;
                state.performances = action.payload;
            })
            .addCase(getPerformances.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getPerformanceById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPerformanceById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.performance = action.payload;
            })
            .addCase(getPerformanceById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(submitPerformance.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(submitPerformance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.performance = action.payload;
                state.message = "KPI created successful";
            })
            .addCase(submitPerformance.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updatePerformance.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updatePerformance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.performance = action.payload;
                state.message = "KPI updated successful";
            })
            .addCase(updatePerformance.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deletePerformance.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deletePerformance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = "KPI deleted successful";
            })
            .addCase(deletePerformance.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, clear } = performanceSlice.actions;
export default performanceSlice.reducer;
