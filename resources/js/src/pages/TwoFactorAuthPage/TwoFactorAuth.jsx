import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { getCurrentUser, reset } from "../../features/auth/authSlice";
import Container from "../../components/Container";
import { toast } from "react-toastify";
import axios from "axios";

const TwoFactorAuth = () => {
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
            navigate("/admin/dashboard");
        }
        if (!isAuthenticated) {
            navigate("/admin");
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
            })
            .catch((e) => {
                setLoading(false);
                toast.error(e.response.data.message);
            });
    };

    const handleResendToken = () => {
        setLoading(true);
        axios
            .get("/two-factor-auth/resend")
            .then(() => {
                setLoading(false);
                onCodeResend();
                toast.success("OTP sent successful");
            })
            .catch((e) => {
                setLoading(false);
                toast.error(e.response.data.message);
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
        <Container>
            <div className="tw-grow tw-p-4 tw-flex tw-flex-col tw-items-center tw-justify-center">
                <div className="tw-shadow-lg tw-bg-white tw-rounded-md md:tw-p-6 tw-w-full md:tw-w-[34.5rem] tw-w-auto  tw-p-3 ">
                    <div className="form-demo">
                        <div className="card">
                            <div className="tw-text-center tw-mb-5">
                                <h2 className="tw-text-2xl tw-font-semimedium  tw-mb-2">
                                    Two Factor Verification
                                </h2>
                            </div>
                            <form onSubmit={onSubmit} className="p-fluid">
                                <div className="field">
                                    <span className="p-float-label ">
                                        <InputText
                                            name="code"
                                            value={code}
                                            autoComplete="off"
                                            onChange={handleOnChange}
                                        />
                                        <label htmlFor="code">Code</label>
                                    </span>
                                </div>

                                <div className="tw-my-4 tw-flex tw-items-center tw-justify-between tw-gap-2">
                                    <Button
                                        type="submit"
                                        label="Verify"
                                        disabled={loading}
                                        className="custom-btn "
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
                                                      (remainingTime %
                                                          (1000 * 60)) /
                                                          1000
                                                  )}`
                                        })`}
                                        disabled={Boolean(
                                            remainingTime > 1000 || loading
                                        )}
                                        className="custom-btn p-button-outlined"
                                        onClick={handleResendToken}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default TwoFactorAuth;
