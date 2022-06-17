import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { verifyCode, resendCode } from "../../actions/auth";
import Container from "../../components/Container";

const TwoFactorAuth = (props) => {
    const { verifyCode, resendCode, alerts, loading, user } = props;

    const authUser = JSON.parse(user);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const code = data.get("code");
        // eslint-disable-next-line no-console

        verifyCode({ code });
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
                    Two Factor Verification
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
                    <Box>
                        <Typography>
                            We sent code to your phone :
                            {` ${authUser?.phone.substring(
                                0,
                                5
                            )}******${authUser?.phone.substring(
                                authUser?.phone.length - 2
                            )}`}
                        </Typography>
                    </Box>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="code"
                        label="Enter Code"
                        name="code"
                        autoFocus
                    />
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        onClick={resendCode}
                        sx={{ mb: 2, mt: 1 }}
                    >
                        Resend Code
                    </Button>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        //sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        Verify
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

const mapStateToProps = (state) => ({
    loading: state.auth.loading,
    alerts: state.alert,
});

export default connect(mapStateToProps, { verifyCode, resendCode })(
    TwoFactorAuth
);
