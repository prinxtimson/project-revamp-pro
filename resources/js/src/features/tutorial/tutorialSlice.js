import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clearUser } from "../auth/authSlice";
import tutorialService from "./tutorialService";

const initialState = {
    lessons: [],
    lesson: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

// get tickets
export const getTutorials = createAsyncThunk(
    "tutorial/get",
    async (args, thunkAPI) => {
        try {
            return await tutorialService.getTutorials();
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

export const getTutorialtById = createAsyncThunk(
    "tutorial/get-single",
    async (id, thunkAPI) => {
        try {
            return await tutorialService.getTutorialtById(id);
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

export const createTutorial = createAsyncThunk(
    "tutorial/new",
    async (data, thunkAPI) => {
        try {
            await tutorialService.createTutorial(data);
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

export const updateTutorial = createAsyncThunk(
    "tutorial/update",
    async (data, thunkAPI) => {
        try {
            return await tutorialService.updateTutorial(data);
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

export const deleteTutorial = createAsyncThunk(
    "tutorial/delete",
    async (id, thunkAPI) => {
        try {
            const res = await tutorialService.deleteTutorial(id);

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
    name: "tutorial",
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
        },
        clear: (state) => {
            state.lessons = [];
            state.lesson = null;
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTutorials.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTutorials.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lessons = action.payload;
            })
            .addCase(getTutorials.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getTutorialtById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTutorialtById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lesson = action.payload.data;
            })
            .addCase(getTutorialtById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createTutorial.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createTutorial.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.lesson = action.payload;
                state.message = "Lesson added successful";
            })
            .addCase(createTutorial.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateTutorial.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateTutorial.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.lesson = action.payload;
                state.message = "Lesson updated successful";
            })
            .addCase(updateTutorial.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteTutorial.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteTutorial.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = "Lesson deleted successful";
                let data = state.lessons.filter(
                    (item) => item.id !== action.payload.id
                );
                state.lessons = [...data];
            })
            .addCase(deleteTutorial.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, clear } = ticketSlice.actions;
export default ticketSlice.reducer;
