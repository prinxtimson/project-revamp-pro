import "react-phone-input-2/lib/material.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PhoneInput from "react-phone-input-2";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { addNewUser, reset } from "../../features/profile/profileSlice";
import { toast } from "react-toastify";

const AddUserForm = ({ handleGetUsers }) => {
    const [data, setData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        role: "admin",
        password: "",
        phone: "",
        showPassword: false,
    });

    const dispatch = useDispatch();

    const { isLoading, isSuccess, type, isError, message } = useSelector(
        (state) => state.profile
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addNewUser(data));
    };

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess) {
            toast.success(message);
            onSuccessfull();
        }

        dispatch(reset());
    }, [isLoading, isSuccess, type, isError, message]);

    const onSuccessfull = () => {
        setData({
            firstname: "",
            lastname: "",
            email: "",
            role: "admin",
            phone: "+44",
            password: "",
            showPassword: false,
        });
        handleGetUsers();
    };

    const handleOnFocus = () => {
        const password = generatePassword(8);

        setData({ ...data, password });
    };

    const generatePassword = (len) => {
        let result = [];
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@-%$#!&+?";
        const charLength = characters.length;
        for (let i = 0; i < len; i++) {
            result.push(
                characters.charAt(Math.floor(Math.random() * charLength))
            );
        }
        return result.join("");
    };

    const handleClickShowPassword = () => {
        setData({ ...data, showPassword: !data.showPassword });
    };

    return (
        <Box
            sx={{
                marginTop: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "white",
                padding: 5,
                borderRadius: 2,
            }}
        >
            <Typography component="h1" variant="h5">
                Add Admin
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1, width: "100%", maxWidth: 468 }}
            >
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Firstname"
                    name="firstname"
                    value={data.firstname}
                    onChange={(e) =>
                        setData({ ...data, firstname: e.target.value })
                    }
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Lastname"
                    value={data.lastname}
                    onChange={(e) =>
                        setData({ ...data, lastname: e.target.value })
                    }
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Email Address"
                    value={data.email}
                    onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                    }
                />
                <PhoneInput
                    inputProps={{
                        required: true,
                    }}
                    inputStyle={{
                        width: "100%",
                        paddingTop: "14.5px",
                        paddingBottom: "14.5px",
                    }}
                    containerStyle={{
                        marginBottom: 5,
                        marginTop: 10,
                    }}
                    specialLabel="Phone *"
                    country={"gb"}
                    value={data.phone}
                    onChange={(val) => setData({ ...data, phone: val })}
                />

                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type={data.showPassword ? "text" : "password"}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                >
                                    {data.showPassword ? (
                                        <Visibility />
                                    ) : (
                                        <VisibilityOff />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    value={data.password}
                    onFocus={handleOnFocus}
                    onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                    }
                    autoComplete="new-password"
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isLoading}
                >
                    Submit
                </Button>
            </Box>
        </Box>
    );
};

export default AddUserForm;
