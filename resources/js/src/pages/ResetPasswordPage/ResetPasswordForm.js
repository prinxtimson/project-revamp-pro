import * as React from "react";
import { useLocation, useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
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
        security_question: "",
        security_answer: "",
    });
    const [loading, setLoading] = React.useState(false);
    const passwordValidation = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

    const getFormErrorMessage = () => {
        return data.password &&
            !data.password.match(data.password_confirmation) ? (
            <small className="p-error">Password is not a match</small>
        ) : null;
    };
    const footer = (
        <>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </>
    );

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
                        alt="Dev Arena"
                        src="/images/logo.png"
                        sx={{ width: 128, height: 32 }}
                    >
                        Dev Arena
                    </Avatar>
                </Box>
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
                    autoComplete="off"
                    noValidate
                    sx={{ mt: 1, width: "100%" }}
                >
                    <Typography
                        component="h1"
                        variant="h6"
                        sx={{ textAlign: "center", paddingY: 3 }}
                    >
                        {data.email}
                    </Typography>
                    <div style={{ marginBottom: 22 }}>
                        <span className="p-float-label">
                            <Dropdown
                                inputId="security_question"
                                value={data.security_question}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        security_question: e.value,
                                    })
                                }
                                options={QUESTIONS}
                                style={{ width: "100%" }}
                                className="w-full"
                            />
                            <label htmlFor="security_question">
                                Select Security Question
                            </label>
                        </span>
                    </div>
                    <div style={{ marginBottom: 22 }}>
                        <span className="p-float-label">
                            <InputText
                                id="security_answer"
                                value={data.security_answer}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        security_answer: e.target.value,
                                    })
                                }
                                style={{ width: "100%" }}
                                autoComplete="new-answer"
                            />
                            <label htmlFor="security_answer">
                                Security Answer
                            </label>
                        </span>
                    </div>
                    <div style={{ marginBottom: 22 }}>
                        <span className="p-float-label">
                            <Password
                                value={data.password}
                                name="password"
                                id="password"
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        password: e.target.value,
                                    })
                                }
                                footer={footer}
                                toggleMask
                                className={classNames({
                                    "p-invalid":
                                        data.password &&
                                        !passwordValidation.test(data.password),
                                })}
                            />
                            <label htmlFor="password">Password</label>
                        </span>
                    </div>

                    <div style={{ marginBottom: 10 }}>
                        <span className="p-float-label">
                            <Password
                                value={data.password_confirmation}
                                name="password_confirmation"
                                id="password_confirmation"
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        password_confirmation: e.target.value,
                                    })
                                }
                                toggleMask
                                className={classNames({
                                    "p-invalid":
                                        data.password &&
                                        !data.password.match(
                                            data.password_confirmation
                                        ),
                                })}
                            />
                            <label htmlFor="password">Confirm Password</label>
                        </span>
                        {getFormErrorMessage()}
                    </div>

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
                        sx={{ mt: 2, mb: 2 }}
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

const QUESTIONS = [
    "What is the name of your project?",
    "What is the name of your PM?",
    "What is your pet name?",
];
