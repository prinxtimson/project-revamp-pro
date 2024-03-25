import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import DrawerContainer from "./DrawerContainer";
import { toast } from "react-toastify";
import { logout } from "../../features/auth/authSlice";

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isLoading, isSuccess, type, isError, message } = useSelector(
        (state) => state.auth
    );

    return (
        <DrawerContainer>
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
                        <div className="tw-flex tw-justify-between">
                            <Button
                                text
                                label="Activitics"
                                onClick={() => navigate("")}
                            />
                            <Button
                                label="Edit"
                                onClick={() => navigate("edit")}
                            />
                            <Button
                                outlined
                                label="Logout"
                                onClick={() => dispatch(logout())}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DrawerContainer>
    );
};

export default ProfilePage;
