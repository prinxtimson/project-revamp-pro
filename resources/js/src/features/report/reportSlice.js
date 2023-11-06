import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reportService from "./reportService";

const initialState = {
    reports: null,
    report: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

export const saveReport = createAsyncThunk(
    "report/save",
    async (args, thunkAPI) => {
        try {
            return await reportService.saveReport(args);
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

export const generateReport = createAsyncThunk(
    "report/generate",
    async (data, thunkAPI) => {
        try {
            return await reportService.generateReport(data);
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

export const shareReport = createAsyncThunk(
    "report/share",
    async (data, thunkAPI) => {
        try {
            return await reportService.shareReport(data);
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

export const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
        },
        clear: (state) => {
            state.reports = null;
            state.report = null;
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveReport.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(saveReport.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.report = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(saveReport.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(generateReport.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(generateReport.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.report = action.payload.data;
                state.message = "Report generated successful!";
            })
            .addCase(generateReport.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(shareReport.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(shareReport.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(shareReport.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, clear } = reportSlice.actions;
export default reportSlice.reducer;
