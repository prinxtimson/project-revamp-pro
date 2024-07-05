import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { resetPass, reset } from "../../features/auth/authSlice";
import AuthContainer from "../../layouts/AuthContainer";

const ResetPsswordForm = () => {
    const toastRef = useRef(null);
    const passwordValidation = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    const { token } = useParams();
    const search = new URLSearchParams(useLocation().search);
    const [data, setData] = useState({
        token: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoading, isSuccess, isError, message, type } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        setData({ ...data, token, email: search.get("email") });
    }, []);

    useEffect(() => {
        if (isError && type == "auth/reset-password/rejected") {
            toastRef.current.show({
                severity: "error",
                summary: "Error",
                detail: message,
                life: 5000,
            });
        }

        if (isSuccess && type == "auth/reset-password/fulfilled") {
            toastRef.current.show({
                severity: "success",
                summary: "Success",
                detail: message,
                life: 5000,
            });
            setData({
                token: "",
                email: "",
                password: "",
                password_confirmation: "",
            });
            if (message == "Password reset successful") {
                dispatch(reset());
                navigate("/");
            }
        }

        dispatch(reset());
    }, [isError, isSuccess, message, dispatch]);

    const handleOnChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const submit = (e) => {
        e.preventDefault();
        dispatch(resetPass(data));
    };

    return (
        <AuthContainer toast={toastRef}>
            <div className="form-demo">
                <div className="card">
                    <div className="tw-text-center tw-mb-5">
                        <h2 className=" tw-font-semibold  tw-m-0">
                            Reset Password
                        </h2>
                    </div>

                    <form onSubmit={submit} className="tw-py-5 p-fluid">
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
                                <InputText
                                    name="email"
                                    value={data.email}
                                    readOnly
                                />
                                <label htmlFor="email">Email</label>
                            </span>
                        </div>

                        <div className="field">
                            <span className="p-float-label ">
                                <Password
                                    name="password"
                                    value={data.password}
                                    toggleMask
                                    autoComplete="new password"
                                    className={
                                        data.password &&
                                        !passwordValidation.test(data.password)
                                            ? "p-invalid"
                                            : ""
                                    }
                                    onChange={handleOnChange}
                                    required
                                />

                                <label htmlFor="password">Password *</label>
                            </span>
                            {data.password &&
                                !passwordValidation.test(data.password) && (
                                    <small
                                        id="password-help"
                                        className="p-error block"
                                    >
                                        Must contain at least one of each sets
                                        A-Z, a-z, 0-9 and minimum of 8
                                        characters.
                                    </small>
                                )}
                        </div>
                        <div className="field">
                            <span className="p-float-label ">
                                <Password
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={handleOnChange}
                                    toggleMask
                                    className={
                                        data.password_confirmation &&
                                        data.password !==
                                            data.password_confirmation
                                            ? "p-invalid"
                                            : ""
                                    }
                                    required
                                />

                                <label htmlFor="password_confirmation">
                                    Confirm password *
                                </label>
                            </span>
                            {data.password_confirmation &&
                                data.password !==
                                    data.password_confirmation && (
                                    <small
                                        id="password-help"
                                        className="p-error block"
                                    >
                                        Password do not match
                                    </small>
                                )}
                        </div>

                        <Button
                            className=" custom-btn"
                            type="submit"
                            label="Change Password"
                            loading={isLoading}
                            pt={{
                                root: {
                                    className:
                                        "tw-bg-[#293986] tw-border-[#293986]",
                                },
                            }}
                        />
                    </form>
                </div>
            </div>
        </AuthContainer>
    );
};

export default ResetPsswordForm;

const QUESTIONS = [
    "What is the name of your project?",
    "What is the name of your PM?",
    "What is your pet name?",
];
