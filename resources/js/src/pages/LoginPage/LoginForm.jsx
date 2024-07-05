import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { login, reset } from "../../features/auth/authSlice";
import AuthContainer from "../../layouts/AuthContainer";

const LoginForm = () => {
    const toastRef = useRef(null);
    const [data, setData] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const { email, password, remember } = data;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoading, isSuccess, isError, type, message } = useSelector(
        (state) => state.auth
    );
    const handleOnChange = (event) => {
        setData({
            ...data,
            [event.target.name]:
                event.target.type === "checkbox"
                    ? event.target.checked
                    : event.target.value,
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(login(data));
    };

    useEffect(() => {
        if (isError && type == "auth/login/rejected") {
            toastRef.current.show({
                severity: "error",
                summary: "Error",
                detail: message,
                life: 5000,
            });
        }

        if (isSuccess && type == "auth/login/fulfilled") {
            navigate("/admin/two-factor-auth");
        }

        dispatch(reset());
    }, [isError, isSuccess, message, navigate, dispatch]);

    return (
        <AuthContainer toast={toastRef}>
            <div className="form-demo">
                <div className="card">
                    <div className="tw-text-center tw-mb-6">
                        <h2 className="tw-font-semibold  tw-m-0">Login</h2>
                    </div>
                    <form onSubmit={onSubmit} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
                                <InputText
                                    name="email"
                                    value={email}
                                    autoComplete="off"
                                    onChange={handleOnChange}
                                />
                                <label htmlFor="email">Email *</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Password
                                    name="password"
                                    toggleMask
                                    value={password}
                                    autoComplete="off"
                                    feedback={false}
                                    onChange={handleOnChange}
                                />

                                <label htmlFor="password">Password *</label>
                            </span>
                        </div>
                        <div className="tw-flex tw-mb-4 tw-justify-between">
                            <div className="field-checked tw-text-gray-900">
                                {/* <Checkbox
                                    name="remember"
                                    onChange={handleOnChange}
                                    checked={data.remember}
                                    className="tw-mr-2"
                                />

                                <label htmlFor="accept">Remember me</label> */}
                            </div>
                            <Link
                                to="forgot-password"
                                className="tw-underline tw-text-sm tw-text-blue-500 hover:tw-text-blue-800 tw-float-right"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                        <div className="tw-mb-5">
                            <Button
                                type="submit"
                                label="Login"
                                loading={isLoading}
                                pt={{
                                    root: {
                                        className:
                                            "tw-bg-[#293986] tw-border-[#293986]",
                                    },
                                }}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </AuthContainer>
    );
};

export default LoginForm;
