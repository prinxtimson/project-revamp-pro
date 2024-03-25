import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Container from "../../components/Container";
import { forgotPass, reset } from "../../features/auth/authSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPasswordForm = () => {
    const [data, setData] = useState({
        email: "",
    });

    const dispatch = useDispatch();

    const { isLoading, isSuccess, isError, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess) {
            toast.success(message);
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
        <Container>
            <div className="tw-w-full tw-p-3 md:tw-p-6">
                <div className="form-demo">
                    <div className="card">
                        <div className="tw-text-center tw-mb-6">
                            <h2 className="tw-text-3xl tw-font-semibold  tw-mb-2">
                                Hello, Welcome Back
                            </h2>
                            <p className="tw-my-3 tw-text-xl">
                                Forgot Password
                            </p>
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
                                disabled={isLoading}
                            />
                            <div className="tw-mb-5"></div>
                            <div className="">
                                <span className="">
                                    Remember password?{" "}
                                    <Link
                                        to="/admin"
                                        className="tw-underline tw-text-blue-500 hover:tw-text-blue-800"
                                    >
                                        Sign-in
                                    </Link>
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default ForgotPasswordForm;
