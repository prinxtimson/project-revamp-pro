import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatService from "./chatService";

const initialState = {
    chats: [],
    chat: null,
    type: "",
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

export const getChats = createAsyncThunk("chat/get", async (args, thunkAPI) => {
    try {
        return await chatService.getChats();
    } catch (err) {
        const msg =
            (err.response && err.response.data && err.response.data.message) ||
            err.message ||
            err.toString();

        return thunkAPI.rejectWithValue(msg);
    }
});

export const getChat = createAsyncThunk(
    "chat/get-single",
    async (args, thunkAPI) => {
        try {
            return await chatService.getChat(args);
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

export const startChat = createAsyncThunk(
    "chat/start",
    async (args, thunkAPI) => {
        try {
            return await chatService.startChat(args);
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

export const endChat = createAsyncThunk("chat/end", async (args, thunkAPI) => {
    try {
        return await chatService.endChat(args);
    } catch (err) {
        const msg =
            (err.response && err.response.data && err.response.data.message) ||
            err.message ||
            err.toString();

        return thunkAPI.rejectWithValue(msg);
    }
});

export const searchMessages = createAsyncThunk(
    "chat/search-messages",
    async (args, thunkAPI) => {
        try {
            return await chatService.searchMessages(args);
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

export const sendMessage = createAsyncThunk(
    "chat/send-message",
    async (args, thunkAPI) => {
        try {
            const result = await chatService.sendMessage(args);
            thunkAPI.dispatch(getChats());
            return result;
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

export const readMessage = createAsyncThunk(
    "chat/read-message",
    async (args, thunkAPI) => {
        try {
            return await chatService.readMessage(args);
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

export const deleteMessage = createAsyncThunk(
    "chat/delete-message",
    async (args, thunkAPI) => {
        try {
            return await chatService.deleteMessage(args);
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

export const chatSlice = createSlice({
    initialState,
    name: "chat",
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
            state.type = "";
        },
        clear: (state) => {
            state.chat = null;
            state.chats = [];
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
            state.type = "";
        },
        onNewMessage: (state, action) => {
            if (state.chat.id === action.payload.chat_id) {
                let messages = state.chat.messages;
                let index = messages.findIndex(
                    (item) => item.id === action.payload.id
                );
                if (index > -1) {
                    messages.splice(index, 1, action.payload);
                    state.chat = { ...state.chat, messages };
                } else {
                    state.chat = {
                        ...state.chat,
                        messages: [...messages, action.payload],
                    };
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getChat.pending, (state, action) => {
                state.isLoading = true;
                state.type = action.type;
            })
            .addCase(getChat.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.chat = action.payload;
                state.type = action.type;
            })
            .addCase(getChat.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            })
            .addCase(getChats.pending, (state, action) => {
                state.isLoading = true;
                state.type = action.type;
            })
            .addCase(getChats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.chats = action.payload;
                state.type = action.type;
            })
            .addCase(getChats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            })
            .addCase(startChat.pending, (state, action) => {
                state.isLoading = true;
                state.type = action.type;
            })
            .addCase(startChat.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.chat = action.payload;
                state.type = action.type;
            })
            .addCase(startChat.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            })
            .addCase(endChat.pending, (state, action) => {
                state.isLoading = true;
                state.type = action.type;
            })
            .addCase(endChat.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.chat = null;
                let index = state.chats.findIndex(
                    (item) => item.id === action.payload.id
                );
                state.chats.splice(index, 1, action.payload);
                state.chats = [...state.chats];
                state.type = action.type;
            })
            .addCase(endChat.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            })
            .addCase(searchMessages.pending, (state, action) => {
                state.isLoading = true;
                state.type = action.type;
            })
            .addCase(searchMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.chat = { ...state.chat, messages: action.payload };
                state.type = action.type;
            })
            .addCase(searchMessages.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            })
            .addCase(sendMessage.pending, (state, action) => {
                state.isLoading = true;
                state.type = action.type;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
                let messages = state.chat.messages;
                let index = messages.findIndex(
                    (item) => item.id === action.payload.id
                );
                if (index > -1) {
                    messages.splice(index, 1, action.payload);
                    state.chat = { ...state.chat, messages };
                } else {
                    state.chat = {
                        ...state.chat,
                        messages: [...messages, action.payload],
                    };
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            })
            .addCase(readMessage.pending, (state, action) => {
                state.isLoading = true;
                state.type = action.type;
            })
            .addCase(readMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.type = action.type;
            })
            .addCase(readMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            })
            .addCase(deleteMessage.pending, (state, action) => {
                state.isLoading = true;
                state.type = action.type;
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                let messages = state.chat.messages.filter(
                    (item) => item.id !== action.payload.id
                );
                state.chat = { ...state.chat, messages };
                state.type = action.type;
            })
            .addCase(deleteMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.type = action.type;
                state.message = action.payload;
            });
    },
});

export const { reset, clear, onNewMessage } = chatSlice.actions;
export default chatSlice.reducer;
