import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { login, reset } from "../../features/auth/authSlice";
import Container from "../../components/Container";
import { toast } from "react-toastify";

const LoginForm = () => {
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
            toast.error(message);
        }

        if (isSuccess && type == "auth/logout/fulfilled") {
            toast.success("Logout successful");
        }

        if (isSuccess && type == "auth/login/fulfilled") {
            navigate("/admin/two-factor-auth");
        }

        dispatch(reset());
    }, [isError, isSuccess, message, navigate, dispatch]);

    return (
        <Container>
            <div className="tw-p-3 md:tw-p-6 tw-w-full">
                <div className="form-demo">
                    <div className="card">
                        <div className="tw-text-center tw-mb-5">
                            <h2 className="tw-text-3xl tw-font-semibold  tw-mb-2">
                                Hello, Welcome Back
                            </h2>
                            <p className="tw-my-3 tw-text-xl">
                                Please enter your log in credentials
                            </p>
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
                                    <Checkbox
                                        name="remember"
                                        value={remember}
                                        onChange={handleOnChange}
                                        checked={data.remember}
                                        className="tw-mr-2"
                                    />

                                    <label htmlFor="accept">Remember me</label>
                                </div>
                                <Link
                                    to="forgot-password"
                                    className="tw-underline tw-text-sm tw-text-blue-500 hover:tw-text-blue-800 tw-float-right"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <div className="tw-mb-5"></div>
                            <Button
                                type="submit"
                                label="LOGIN"
                                disabled={isLoading}
                                className="custom-btn "
                            />
                        </form>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default LoginForm;
