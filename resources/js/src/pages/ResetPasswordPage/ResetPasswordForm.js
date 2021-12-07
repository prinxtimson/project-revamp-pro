import * as React from "react";
import { useLocation, useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" href="#">
                Your Website
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const theme = createTheme();

const ResetPsswordForm = () => {
    const { token } = useParams();
    const search = new URLSearchParams(useLocation().search);
    const [data, setData] = React.useState({
        email: search.get("email"),
        password: "",
        password_confirmation: "",
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [msg, setMsg] = React.useState(null);
    const passwordValidation = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    const [show, setShow] = React.useState(false);

    const handleClickShow = () => {
        setShow(!show);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-console
        console.log({
            email: data.get("email"),
            password: data.get("password"),
        });
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
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Reset Password
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <Typography
                            component="h1"
                            variant="h6"
                            className={classes.headerText}
                        >
                            {data.email}
                        </Typography>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            error={
                                data.password &&
                                !passwordValidation.test(data.password)
                            }
                            label="Password"
                            type={show ? "text" : "password"}
                            id="password"
                            autoComplete="current-password"
                            helperText="Must contain at least one of each sets A-Z,a-z,0-9 and minimum of 8 characters."
                            onChange={(e) =>
                                setData({ ...data, password: e.target.value })
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShow}
                                            onMouseDown={handleMouseDown}
                                        >
                                            {show ? (
                                                <Visibility />
                                            ) : (
                                                <VisibilityOff />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password Confirmation"
                            type={show ? "text" : "password"}
                            id="password_confirmation"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    password_confirmation: e.target.value,
                                })
                            }
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            className={classes.submit}
                            disabled={
                                loading ||
                                !data.password ||
                                data.password !== data.password_confirmation
                            }
                            //onClick={handleSubmit}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Reset Password
                        </Button>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
};

export default ResetPsswordForm;
