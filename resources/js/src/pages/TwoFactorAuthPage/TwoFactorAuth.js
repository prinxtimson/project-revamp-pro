import React from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { connect } from "react-redux";
import { verifyCode, resendCode } from "../../actions/auth";
import Container from "../../components/Container";

const TwoFactorAuth = (props) => {
    const [reset, setReset] = React.useState(0);
    const { verifyCode, resendCode, alerts, loading, user } = props;
    const [authUser, setAuthUser] = React.useState(null);
    const [remainingTime, setRemainingTime] = React.useState(0);

    const navigate = useNavigate();

    React.useEffect(() => {
        const userJson = JSON.parse(user || "{}");
        setAuthUser(userJson);

        return () => setAuthUser(null);
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const code = data.get("code");

        if (code) {
            verifyCode({ code }, onSuccessful);
        }
    };

    const onSuccessful = () => {
        navigate("/admin/dashboard");
    };

    React.useEffect(() => {
        const targetTime = new Date().getTime() + 90000;
        setRemainingTime(targetTime);
        const interval = setInterval(() => {
            const currentMin = targetTime - new Date().getTime();
            if (currentMin > 0) {
                setRemainingTime(currentMin);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [reset]);

    const onCodeResend = () => setReset(reset + 1);

    return (
        <Container>
            <Box
                sx={{
                    marginTop: 8,
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
                            We sent code to your Email :
                            {` ${authUser?.email?.substring(
                                0,
                                3
                            )}******${authUser?.email?.substring(
                                authUser?.email?.length - 8
                            )}`}
                        </Typography>
                    </Box>
                    <TextField
                        margin="dense"
                        required
                        fullWidth
                        id="code"
                        label="Enter Code"
                        name="code"
                        size="small"
                    />
                    <Button
                        type="button"
                        fullWidth
                        variant="outlined"
                        onClick={() => resendCode(onCodeResend)}
                        disabled={remainingTime > 1000 || loading}
                        sx={{ mb: 1.5, mt: 1 }}
                    >
                        Resend Code in{" "}
                        {remainingTime === 0
                            ? "00:00"
                            : `${Math.floor(
                                  (remainingTime % (1000 * 60 * 60)) /
                                      (1000 * 60)
                              )}:${Math.floor(
                                  (remainingTime % (1000 * 60)) / 1000
                              )}`}
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
