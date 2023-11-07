import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import callbackService from "./callbackService";

const initialState = {
    callbacks: null,
    callback: null,
    summary: [],
    type: "",
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

export const getCallbacks = createAsyncThunk(
    "callback/get-all",
    async (args, thunkAPI) => {
        try {
            return await callbackService.getCallbacks();
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

export const getCallbacksByPage = createAsyncThunk(
    "callback/get-by-page",
    async (page, thunkAPI) => {
        try {
            return await callbackService.getCallbacksByPage(page);
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

export const getCallbacksByDate = createAsyncThunk(
    "callback/get-by-date",
    async (date, thunkAPI) => {
        try {
            return await callbackService.getCallbacksByDate(date);
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

export const requestCallback = createAsyncThunk(
    "callback/new",
    async (data, thunkAPI) => {
        try {
            return await callbackService.requestCallback(data);
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

export const getCallbackById = createAsyncThunk(
    "callback/get-single",
    async (id, thunkAPI) => {
        try {
            return await callbackService.getCallbackById(id);
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

export const callbackSuccessful = createAsyncThunk(
    "callback/success",
    async (id, thunkAPI) => {
        try {
            return await callbackService.callbackSuccessful(id);
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

export const callbackFailed = createAsyncThunk(
    "callback/fail",
    async (id, thunkAPI) => {
        try {
            return await callbackService.callbackFailed(id);
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

export const updateCallback = createAsyncThunk(
    "callback/update",
    async (data, thunkAPI) => {
        try {
            return await callbackService.updateCallback(data);
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

export const cancelCallback = createAsyncThunk(
    "callback/cancel",
    async (id, thunkAPI) => {
        try {
            return await callbackService.cancelCallback(id);
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

export const deleteCallback = createAsyncThunk(
    "callback/delete",
    async (id, thunkAPI) => {
        try {
            return await callbackService.deleteCallback(id);
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

export const callbackSlice = createSlice({
    name: "callback",
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
            state.callbacks = null;
            state.callback = null;
            state.isError = false;
            state.type = "";
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
            state.summary = [];
        },
        onUpdateCallbackSummary: (state, action) => {
            state.summary = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCallbacks.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCallbacks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.type = action.type;
                state.callbacks = action.payload;
            })
            .addCase(getCallbacks.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getCallbacksByPage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCallbacksByPage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.type = action.type;
                state.callbacks = action.payload;
            })
            .addCase(getCallbacksByPage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getCallbacksByDate.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCallbacksByDate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.type = action.type;
                state.callbacks = { data: action.payload };
            })
            .addCase(getCallbacksByDate.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(requestCallback.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(requestCallback.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.callback = action.payload;
                state.message =
                    "Booking successful. A confirmation will be sent to your email shortly.";
            })
            .addCase(requestCallback.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getCallbackById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCallbackById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.type = action.type;
                state.isSuccess = true;
                state.callback = action.payload;
            })
            .addCase(getCallbackById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateCallback.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCallback.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.callback = action.payload;
                state.message =
                    "Booking successful. A confirmation will be sent to your email shortly.";
            })
            .addCase(updateCallback.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(cancelCallback.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(cancelCallback.fulfilled, (state, action) => {
                let index = state.callbacks.data.findIndex(
                    (item) => item.id === action.payload.id
                );
                state.callbacks.data.splice(index, 1, action.payload);

                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.callbacks = { ...state.callbacks };
                state.callback = action.payload;
            })
            .addCase(cancelCallback.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(callbackSuccessful.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(callbackSuccessful.fulfilled, (state, action) => {
                let index = state.callbacks.data.findIndex(
                    (item) => item.id === action.payload.id
                );
                state.callbacks.data.splice(index, 1, action.payload);

                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.callbacks = { ...state.callbacks };
                state.callback = action.payload;
            })
            .addCase(callbackSuccessful.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(callbackFailed.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(callbackFailed.fulfilled, (state, action) => {
                let index = state.callbacks.data.findIndex(
                    (item) => item.id === action.payload.id
                );
                state.callbacks.data.splice(index, 1, action.payload);

                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.callbacks = { ...state.callbacks };
                state.callback = action.payload;
            })
            .addCase(callbackFailed.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteCallback.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCallback.fulfilled, (state, action) => {
                let data = state.callbacks.data.filter(
                    (item) => item.id === action.payload.id
                );

                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.callbacks = { ...state.callbacks, data };
                state.callback = action.payload;
            })
            .addCase(deleteCallback.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, clear, onUpdateCallbackSummary } = callbackSlice.actions;
export default callbackSlice.reducer;
