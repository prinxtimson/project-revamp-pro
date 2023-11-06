import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clearUser } from "../auth/authSlice";
import ticketService from "./ticketService";

const initialState = {
    tickets: null,
    ticket: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

// get tickets
export const getTickets = createAsyncThunk(
    "ticket/get",
    async (args, thunkAPI) => {
        try {
            return await ticketService.getTickets();
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

export const getTicketsByPage = createAsyncThunk(
    "ticket/get-by-page",
    async (page, thunkAPI) => {
        try {
            return await ticketService.getTicketsByPage(page);
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

export const getTicketById = createAsyncThunk(
    "ticket/get-single",
    async (id, thunkAPI) => {
        try {
            return await ticketService.getTicketById(id);
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

export const submitTicket = createAsyncThunk(
    "ticket/submit",
    async (data, thunkAPI) => {
        try {
            await ticketService.submitTicket(data);
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

export const updateTicket = createAsyncThunk(
    "ticket/update",
    async (data, thunkAPI) => {
        try {
            return await ticketService.updateTicket(data);
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

export const deleteTicket = createAsyncThunk(
    "ticket/delete",
    async (id, thunkAPI) => {
        try {
            const res = await ticketService.deleteTicket(id);

            return res;
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

export const ticketSlice = createSlice({
    name: "ticket",
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
        },
        clear: (state) => {
            state.tickets = null;
            state.ticket = null;
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTickets.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTickets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tickets = action.payload;
            })
            .addCase(getTickets.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getTicketsByPage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTicketsByPage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tickets = action.payload;
            })
            .addCase(getTicketsByPage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getTicketById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTicketById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.ticket = action.payload.data;
            })
            .addCase(getTicketById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(submitTicket.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(submitTicket.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.ticket = action.payload.data;
                state.message = action.payload.msg;
            })
            .addCase(submitTicket.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateTicket.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateTicket.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.ticket = action.payload.data;
                state.message = action.payload.msg;
            })
            .addCase(updateTicket.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteTicket.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteTicket.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.msg;
            })
            .addCase(deleteTicket.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, clear } = ticketSlice.actions;
export default ticketSlice.reducer;
