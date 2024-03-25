import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import { changePass, reset } from "../../features/auth/authSlice";
import DrawerContainer from "./DrawerContainer";
import { toast } from "react-toastify";

const ChangePasswordForm = () => {
    const passwordValidation = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    const [formData, setFormData] = useState({
        password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    const dispatch = useDispatch();

    const { isLoading, isSuccess, type, isError, message } = useSelector(
        (state) => state.auth
    );

    const { password, new_password, new_password_confirmation } = formData;

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

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess && message) {
            toast.success(message);
        }

        dispatch(reset());
    }, [isLoading, isSuccess, type, isError, message]);

    const handleOnChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(changePass(formData));
    };

    return (
        <DrawerContainer>
            <div className="tw-grow tw-p-2 sm:tw-p-4 tw-flex tw-flex-col tw-items-center tw-justify-center">
                <div className="tw-card tw-bg-white tw-p-6 tw-shadow-md tw-rounded-md tw-w-full md:tw-w-[36.5rem] tw-py-8 tw-border">
                    <div className="tw-text-center tw-mb-6">
                        <h2 className="tw-text-xl tw-font-semibold tw-my-0">
                            Change Password
                        </h2>
                    </div>

                    <form className="p-fluid" onSubmit={handleSubmit}>
                        <div className="field tw-mb-6">
                            <span className="p-float-label ">
                                <Password
                                    name="password"
                                    className="tw-w-full "
                                    toggleMask
                                    value={password}
                                    onChange={handleOnChange}
                                    autoComplete="off"
                                    feedback={false}
                                    required
                                />
                                <label htmlFor="password" className="">
                                    Current Password *
                                </label>
                            </span>
                        </div>
                        <div className="field tw-mb-6">
                            <span className="p-float-label ">
                                <Password
                                    name="new_password"
                                    toggleMask
                                    value={new_password}
                                    onChange={handleOnChange}
                                    feedback={false}
                                    className={
                                        new_password &&
                                        !passwordValidation.test(data.password)
                                            ? "p-invalid"
                                            : ""
                                    }
                                    required
                                />
                                <label htmlFor="new_password" className="">
                                    New Password *
                                </label>
                            </span>
                            {new_password &&
                                !passwordValidation.test(new_password) && (
                                    <small
                                        id="password-help"
                                        className="p-error block"
                                    >
                                        Must contain at least one of each sets
                                        A-Z, a-z, 0-9, must be at least 10
                                        characters and must have special
                                        characters {"(~,@,:,?,>,<,},{ )"}
                                    </small>
                                )}
                        </div>
                        <div className="field tw-mb-6">
                            <span className="p-float-label">
                                <Password
                                    name="new_password_confirmation"
                                    toggleMask
                                    value={new_password_confirmation}
                                    onChange={handleOnChange}
                                    required
                                    feedback={false}
                                    className={
                                        new_password_confirmation &&
                                        new_password !==
                                            new_password_confirmation
                                            ? "p-invalid"
                                            : ""
                                    }
                                />
                                <label
                                    htmlFor="new_password_confirmation"
                                    className=""
                                >
                                    Confirm Password *
                                </label>
                            </span>
                            {new_password_confirmation &&
                                new_password !== new_password_confirmation && (
                                    <small
                                        id="password-help"
                                        className="p-error block"
                                    >
                                        Passwords do not match
                                    </small>
                                )}
                        </div>

                        <div className="tw-flex tw-items-center tw-justify-between">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                label="Update"
                                className="tw-w-full"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </DrawerContainer>
    );
};

export default ChangePasswordForm;
