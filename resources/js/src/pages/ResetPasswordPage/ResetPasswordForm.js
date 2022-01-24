import * as React from "react";
import { useLocation, useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "../../components/Container";
import { connect } from "react-redux";
import { resetPassword } from "../../actions/auth";
import { setAlert } from "../../actions/alert";

const ResetPsswordForm = ({ alerts, resetPassword, setAlert }) => {
    const { token } = useParams();
    const search = new URLSearchParams(useLocation().search);
    const [data, setData] = React.useState({
        email: search.get("email"),
        password: "",
        password_confirmation: "",
    });
    const [loading, setLoading] = React.useState(false);
    const passwordValidation = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    const [show, setShow] = React.useState(false);

    const handleClickShow = () => {
        setShow(!show);
    };

    const { password, password_confirmation } = data;

    const handleSubmit = (event) => {
        event.preventDefault();
        // eslint-disable-next-line no-console
        if (password !== password_confirmation) {
            setAlert("Password do not match", "danger");
            return;
        }
        resetPassword({ ...data, token }, onSuccessful, setLoading);
    };

    const onSuccessful = () => {
        setData({
            ...data,
            password: "",
            password_confirmation: "",
        });
    };

    return (
        <Container>
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
                    <Typography
                        component="h1"
                        variant="h6"
                        sx={{ textAlign: "center", paddingY: 2 }}
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
        </Container>
    );
};

const mapStateToProps = (state) => ({
    alerts: state.alert,
});

export default connect(mapStateToProps, { setAlert, resetPassword })(
    ResetPsswordForm
);
