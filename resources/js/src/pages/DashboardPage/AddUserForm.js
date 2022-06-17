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
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { connect } from "react-redux";
import { addUser } from "../../actions/auth";

const theme = createTheme();

const AddUserForm = ({ alerts, loading, addUser }) => {
    const [data, setData] = React.useState({
        firstname: "",
        lastname: "",
        email: "",
        role: "admin",
        password: "",
        showPassword: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addUser(data, onSuccessfull);
    };

    const onSuccessfull = () => {
        setData({
            firstname: "",
            lastname: "",
            email: "",
            role: "admin",
            password: "",
            showPassword: false,
        });
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
                    <Stack sx={{ width: "100%" }} spacing={2}>
                        {alerts.map(
                            (alert) =>
                                alert.alertType === "danger" && (
                                    <Alert key={alert.id} severity="error">
                                        {alert.msg}
                                    </Alert>
                                )
                        )}
                    </Stack>
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
                            value={data.email}
                            onChange={(e) =>
                                setData({ ...data, email: e.target.value })
                            }
                            autoComplete={false}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type={data.showPassword ? "text" : "password"}
                            id="password"
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
                            autoComplete={false}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading,
    alerts: state.alert,
});

export default connect(mapStateToProps, { addUser })(AddUserForm);
