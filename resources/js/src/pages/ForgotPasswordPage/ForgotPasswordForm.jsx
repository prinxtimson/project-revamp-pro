import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { forgotPass, reset } from "../../features/auth/authSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContainer from "../../layouts/AuthContainer";

const ForgotPasswordForm = () => {
    const toastRef = useRef(null);
    const [data, setData] = useState({
        email: "",
    });

    const dispatch = useDispatch();

    const { isLoading, isSuccess, isError, type, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError && type == "auth/forgot-password/rejected") {
            toastRef.current.show({
                severity: "error",
                summary: "Error",
                detail: message,
                life: 5000,
            });
        }

        if (isSuccess && type == "auth/forgot-password/fulfilled") {
            toastRef.current.show({
                severity: "success",
                summary: "Success",
                detail: message,
                life: 5000,
            });
            setData({
                email: "",
            });
        }

        dispatch(reset());
    }, [isError, isSuccess, message, dispatch]);

    const onHandleChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const submit = (e) => {
        e.preventDefault();
        dispatch(forgotPass(data));
    };

    return (
        <AuthContainer toast={toastRef}>
            <div className="form-demo">
                <div className="card">
                    <div className="tw-text-center tw-mb-6">
                        <h2 className="tw-font-semibold tw-m-0">
                            Forgot Password
                        </h2>
                    </div>

                    <form onSubmit={submit} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label p-input-icon-right custom-label">
                                <i className="pi pi-envelope" />
                                <InputText
                                    name="email"
                                    value={data.email}
                                    autoFocus
                                    onChange={onHandleChange}
                                    required
                                />
                                <label htmlFor="email">Email *</label>
                            </span>
                        </div>
                        <Button
                            className="tw-mb-2 custom-btn"
                            type="submit"
                            label="Reset Password"
                            loading={isLoading}
                            pt={{
                                root: {
                                    className:
                                        "tw-bg-[#293986] tw-border-[#293986]",
                                },
                            }}
                        />
                        <div className="tw-mb-5"></div>
                        <div className="">
                            <span className="">
                                Remember password?{" "}
                                <Link
                                    to="/"
                                    className="tw-underline tw-text-blue-500 hover:tw-text-blue-800"
                                >
                                    Sign-in
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </AuthContainer>
    );
};

export default ForgotPasswordForm;
