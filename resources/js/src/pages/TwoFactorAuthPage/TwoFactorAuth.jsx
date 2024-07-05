import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { getCurrentUser, reset } from "../../features/auth/authSlice";
import axios from "axios";
import AuthContainer from "../../layouts/AuthContainer";
import { getFCMToken } from "../../firebase";

const TwoFactorAuth = () => {
    const toastRef = useRef(null);
    const [reset, setReset] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [data, setData] = useState({
        code: "",
    });
    const [loading, setLoading] = useState(false);

    const { code } = data;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
        if (!isAuthenticated) {
            navigate("/");
        }
    }, [user, isAuthenticated]);

    const handleOnChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios
            .post("/two-factor-auth", data)
            .then(() => {
                dispatch(getCurrentUser());
                getFCMToken();
            })
            .catch((e) => {
                setLoading(false);
                toastRef.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: e.response.data.message,
                    life: 5000,
                });
            });
    };

    const handleResendToken = () => {
        setLoading(true);
        axios
            .get("/two-factor-auth/resend")
            .then(() => {
                setLoading(false);
                onCodeResend();
                toastRef.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "OTP sent successful",
                    life: 5000,
                });
            })
            .catch((e) => {
                setLoading(false);
                toastRef.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: e.response.data.message,
                    life: 5000,
                });
            });
    };

    useEffect(() => {
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
        <AuthContainer toast={toastRef}>
            <div className="form-demo">
                <div className="card">
                    <div className="tw-text-center tw-mb-6">
                        <h2 className="tw-font-semibold  tw-m-0">Enter OTP</h2>
                    </div>
                    <form onSubmit={onSubmit} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label ">
                                <InputText
                                    name="code"
                                    value={code}
                                    autoComplete="new code"
                                    onChange={handleOnChange}
                                    placeholder="Enter Verification Code"
                                />
                                <label htmlFor="code">Verification Code</label>
                            </span>
                        </div>

                        <div className="tw-my-4 tw-flex tw-items-center tw-justify-between tw-gap-2">
                            <Button
                                type="submit"
                                label="Verify Code"
                                loading={loading}
                                className="custom-btn "
                                pt={{
                                    root: {
                                        className:
                                            "tw-bg-[#293986] tw-border-[#293986]",
                                    },
                                }}
                            />
                            <Button
                                type="button"
                                label={`Resend OTP (${
                                    remainingTime === 0
                                        ? "00:00"
                                        : `${Math.floor(
                                              (remainingTime %
                                                  (1000 * 60 * 60)) /
                                                  (1000 * 60)
                                          )}:${Math.floor(
                                              (remainingTime % (1000 * 60)) /
                                                  1000
                                          )}`
                                })`}
                                loading={Boolean(
                                    remainingTime > 1000 || loading
                                )}
                                className="custom-btn p-button-outlined"
                                onClick={handleResendToken}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </AuthContainer>
    );
};

export default TwoFactorAuth;
