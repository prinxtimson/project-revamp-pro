import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../features/auth/authSlice";
import Container from "../../components/Container";

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoading, isSuccess, isError, type, message } = useSelector(
        (state) => state.auth
    );

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-console

        dispatch(
            login({ email: data.get("email"), password: data.get("password") })
        );
    };

    useEffect(() => {
        if (isSuccess && type === "auth/login/fulfilled") {
            navigate("/admin/two-factor-auth");
        }
    }, [isLoading, isSuccess, isError, type, message]);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <Container>
            <Box
                sx={{
                    marginTop: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "white",
                    padding: 3,
                    width: "100%",
                    maxWidth: 456,
                    mx: "auto",
                }}
            >
                <Box
                    component="span"
                    sx={{
                        margin: 2,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Avatar
                        variant="square"
                        alt="Tritek Live"
                        src="/images/logo.png"
                        sx={{ width: 128, height: 32 }}
                    >
                        Tritek Live
                    </Avatar>
                </Box>
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Stack sx={{ width: "100%" }} spacing={2}>
                    {isError && message && (
                        <Alert severity="error">{message}</Alert>
                    )}
                </Stack>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        autoComplete="current-password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isLoading}
                        id="login-btn"
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link to="forgot-password" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item></Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginForm;
