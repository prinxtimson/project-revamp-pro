import React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

const AddUserForm = () => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [msg, setMsg] = React.useState(null);
    const [data, setData] = React.useState({
        firstname: "",
        lastname: "",
        email: "",
        role: "",
        password: "",
        confirm_password: "",
        showPassword: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
    };

    const handleOnFocus = () => {
        // const generatedPass = generatePassword(8);
        // setData({
        //     ...data,
        //     password: generatedPass,
        //     confirm_password: generatedPass
        // })
    };

    const handleClickShowPassword = () => {
        setData({ ...data, showPassword: !data.showPassword });
    };

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Add User
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="firstname"
                            label="Firstname"
                            name="firstname"
                            autoFocus
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
                            id="lastname"
                            label="Lastname"
                            name="lastname"
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
                            id="email_address"
                            label="Email Address"
                            name="email"
                            value={data.email}
                            onChange={(e) =>
                                setData({ ...data, email: e.target.value })
                            }
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={data.showPassword ? "text" : "password"}
                            id="password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={
                                                handleMouseDownPassword
                                            }
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
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default AddUserForm;
