import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import livecallService from "./livecallService";

const initialState = {
    livecalls: null,
    livecall: null,
    summary: [],
    type: "",
    count: 0,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

export const getLivecalls = createAsyncThunk(
    "livecall/get-all",
    async (args, thunkAPI) => {
        try {
            return await livecallService.getLivecalls();
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

export const getLivecallsByPage = createAsyncThunk(
    "livecall/get-by-page",
    async (page, thunkAPI) => {
        try {
            return await livecallService.getLivecallsByPage(page);
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

export const getLivecallById = createAsyncThunk(
    "livecall/get-single",
    async (id, thunkAPI) => {
        try {
            return await livecallService.getLivecallById(id);
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

export const getConnectedLivecalls = createAsyncThunk(
    "livecall/get-connected",
    async (args, thunkAPI) => {
        try {
            return await livecallService.getConnectedLivecalls();
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

export const requestLivecall = createAsyncThunk(
    "livecall/request",
    async (data, thunkAPI) => {
        try {
            return await livecallService.requestLivecall(data);
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

export const leaveLivecall = createAsyncThunk(
    "livecall/leave",
    async (id, thunkAPI) => {
        try {
            return await livecallService.leaveLivecall(id);
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

export const answerLivecall = createAsyncThunk(
    "livecall/answer",
    async (data, thunkAPI) => {
        try {
            return await livecallService.answerLivecall(data);
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

export const updateLivecall = createAsyncThunk(
    "livecall/update",
    async (data, thunkAPI) => {
        try {
            return await livecallService.updateLivecall(data);
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

export const endLivecall = createAsyncThunk(
    "livecall/end",
    async (id, thunkAPI) => {
        try {
            return await livecallService.endLivecall(id);
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

export const getWaitingListPosition = createAsyncThunk(
    "livecall/waiting-list",
    async (id, thunkAPI) => {
        try {
            return await livecallService.getWaitingListPosition(id);
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

export const deleteLivecall = createAsyncThunk(
    "livecall/delete",
    async (id, thunkAPI) => {
        try {
            return await livecallService.deleteLivecall(id);
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

export const livecallSlice = createSlice({
    name: "livecall",
    initialState,
    reducers: {
        onUpdateLivecall: (state, action) => {
            let _livecall = state.livecall;
            let index = state.livecalls.data.findIndex(
                (item) => item.id === action.payload.id
            );
            if (index > -1) {
                state.livecalls.data[index] = action.payload;
            } else {
                state.livecalls.data.unshift(action.payload);
            }

            state.isLoading = false;
            state.livecalls = { ...state.livecalls };
            state.type = action.type;
            if (_livecall && _livecall.id === action.payload.id) {
                state.livecall = action.payload;
            }
        },
        onSetLivecalls: (state, action) => {
            state.type = action.type;
            state.livecalls = action.payload;
        },
        reset: (state) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
            state.type = "";
        },
        clear: (state) => {
            state.livecalls = null;
            state.livecall = null;
            state.type = "";
            state.count = 0;
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
            state.summary = [];
        },
        onUpdateLivecallSummary: (state, action) => {
            state.summary = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLivecalls.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getLivecalls.fulfilled, (state, action) => {
                state.isLoading = false;
                state.type = action.type;
                state.livecalls = action.payload;
            })
            .addCase(getLivecalls.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getLivecallsByPage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getLivecallsByPage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.type = action.type;
                state.livecalls = action.payload;
            })
            .addCase(getLivecallsByPage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(requestLivecall.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(requestLivecall.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.livecall = action.payload;
                state.message = "You are connected";
            })
            .addCase(requestLivecall.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getLivecallById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getLivecallById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.livecall = action.payload;
            })
            .addCase(getLivecallById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getConnectedLivecalls.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getConnectedLivecalls.fulfilled, (state, action) => {
                state.isLoading = false;
                state.type = action.type;
                state.livecalls = action.payload;
            })
            .addCase(getConnectedLivecalls.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            })
            .addCase(leaveLivecall.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(leaveLivecall.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.livecall = action.payload;
            })
            .addCase(leaveLivecall.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateLivecall.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateLivecall.fulfilled, (state, action) => {
                let index = state.livecalls.data.findIndex(
                    (item) => item.id === action.payload.id
                );
                state.livecalls.data.splice(index, 1, action.payload);

                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.livecalls = { ...state.livecalls };
            })
            .addCase(updateLivecall.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(answerLivecall.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(answerLivecall.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.livecall = action.payload;
            })
            .addCase(answerLivecall.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(endLivecall.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(endLivecall.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.livecall = action.payload;
            })
            .addCase(endLivecall.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getWaitingListPosition.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getWaitingListPosition.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.count = action.payload;
            })
            .addCase(getWaitingListPosition.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteLivecall.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteLivecall.fulfilled, (state, action) => {
                let data = state.livecalls.data.filter(
                    (item) => item.id === action.payload.id
                );

                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                state.livecalls = { ...state.livecalls, data };
            })
            .addCase(deleteLivecall.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const {
    onSetLivecalls,
    onUpdateLivecall,
    reset,
    clear,
    onUpdateLivecallSummary,
} = livecallSlice.actions;
export default livecallSlice.reducer;
