import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import DrawerContainer from "./DrawerContainer";
import { toast } from "react-toastify";
import {
    logout,
    deleteAccount,
    archiveAccount,
    reset,
} from "../../features/auth/authSlice";

const ProfilePage = () => {
    const [visible, setVisible] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isLoading, isSuccess, type, isError, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isSuccess && type == "auth/delete-account/fulfilled") {
            toast.success("Account permanently deleted successful");
        }

        if (isSuccess && type == "auth/archive-account/fulfilled") {
            toast.success("Account temporarily deleted successful");
        }

        if (isError) {
            toast.error(message);
        }

        dispatch(reset());
    }, [isLoading, isSuccess, type, isError, message]);

    return (
        <DrawerContainer>
            <ConfirmDialog
                visible={visible}
                header="Confirmation"
                message="confirm temporary or permanent delete"
                reject={() => {
                    if (
                        window.confirm(
                            "You are about to delete your account, the account can not be recover?"
                        )
                    ) {
                        dispatch(deleteAccount());
                    }
                }}
                accept={() => dispatch(archiveAccount())}
                onHide={() => setVisible(false)}
                content={({
                    headerRef,
                    contentRef,
                    footerRef,
                    hide,
                    message,
                }) => (
                    <div className="tw-flex tw-flex-col  tw-items-center tw-p-4 tw-surface-overlay tw-rounded tw-bg-white">
                        <div className="tw-w-full tw-flex tw-items-center tw-justify-between tw-mt-2 tw-mb-4">
                            <span
                                className="tw-font-bold tw-text-2xl tw-block tw-my-0"
                                ref={headerRef}
                            >
                                {message.header}
                            </span>
                            <Button
                                icon="pi pi-times"
                                text
                                rounded
                                onClick={(event) => hide(event)}
                            />
                        </div>

                        <p className="tw-my-0" ref={contentRef}>
                            {message.message}
                        </p>
                        <div
                            className="tw-w-full tw-flex tw-items-center tw-gap-2 tw-mt-4"
                            ref={footerRef}
                        >
                            <Button
                                label="Temporary"
                                outlined
                                severity="warning"
                                onClick={(event) => {
                                    hide(event);
                                    accept();
                                }}
                                className="tw-w-full"
                            ></Button>
                            <Button
                                label="Permanent"
                                severity="danger"
                                onClick={(event) => {
                                    hide(event);
                                    reject();
                                }}
                                className="tw-w-full"
                            ></Button>
                        </div>
                    </div>
                )}
            />
            <div className="tw-grow tw-p-2 sm:tw-p-4 tw-flex tw-flex-col tw-items-center tw-justify-center">
                <div className="tw-card tw-bg-white tw-p-6 tw-shadow-md tw-rounded-md tw-w-full md:tw-w-[36.5rem] tw-py-8 tw-border">
                    <div className="tw-text-center tw-mb-6">
                        <h2 className="tw-text-xl tw-font-semibold tw-my-0">
                            Profile summary
                        </h2>
                    </div>

                    <div className="">
                        {user ? (
                            <div className="tw-p-4 tw-bg-white tw-rounded">
                                <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-5 md:tw-gap-10 tw-mb-5">
                                    <div className="tw-justify-self-end">
                                        First Name:
                                    </div>
                                    <div className="md:tw-col-span-2">
                                        <h4 className="tw-my-0">
                                            {user.profile.firstname}
                                        </h4>
                                    </div>
                                </div>

                                <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-5 md:tw-gap-10 tw-mb-5">
                                    <div className="tw-justify-self-end">
                                        Last Name:
                                    </div>
                                    <div className="md:tw-col-span-2">
                                        <h4 className="tw-my-0">
                                            {user.profile.lastname}
                                        </h4>
                                    </div>
                                </div>

                                <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-5 md:tw-gap-10 tw-mb-5">
                                    <div className="tw-justify-self-end">
                                        Username:
                                    </div>
                                    <div className="md:tw-col-span-2">
                                        <h4 className="tw-my-0">
                                            {user.username}
                                        </h4>
                                    </div>
                                </div>

                                <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-5 md:tw-gap-10  tw-mb-5">
                                    <div className="tw-justify-self-end">
                                        Email:
                                    </div>
                                    <div className="md:tw-col-span-2">
                                        <h4 className="tw-my-0">
                                            {user.email}
                                        </h4>
                                    </div>
                                </div>

                                <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-5 md:tw-gap-10  tw-mb-5">
                                    <div className="tw-justify-self-end">
                                        Phone Number:
                                    </div>
                                    <div className="md:tw-col-span-2">
                                        <h4 className="tw-my-0">
                                            {user.profile.phone_number}
                                        </h4>
                                    </div>
                                </div>

                                <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-5 md:tw-gap-10  tw-mb-5">
                                    <div className="tw-justify-self-end">
                                        Role:
                                    </div>
                                    <div className="md:tw-col-span-2">
                                        <h4 className="tw-my-0">
                                            {user?.roles[0].name || ""}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className=""></div>
                        )}
                        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-5 tw-justify-between tw-gap-3">
                            <Button
                                outlined
                                label="Activities"
                                onClick={() =>
                                    navigate("/admin/dashboard/activities")
                                }
                                className="tw-w-full"
                            />
                            <Button
                                outlined
                                severity="success"
                                label="Edit"
                                onClick={() => navigate("edit")}
                                className="tw-w-full"
                            />
                            <Button
                                outlined
                                severity="success"
                                label="Change Password"
                                onClick={() =>
                                    navigate("/dashboard/change-password")
                                }
                                className="tw-w-full"
                            />
                            <Button
                                outlined
                                severity="warning"
                                label="Logout"
                                onClick={() => dispatch(logout())}
                                className="tw-w-full"
                            />
                            <Button
                                severity="danger"
                                label="Delete"
                                onClick={() => setVisible(true)}
                                className="tw-w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DrawerContainer>
    );
};

export default ProfilePage;
