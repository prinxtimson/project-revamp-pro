import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { toast } from "react-toastify";

import { reset, addNewUser } from "../features/profile/profileSlice";

const ROLES = [
    { name: "Admin", value: "admin" },
    { name: "Manager", value: "manager" },
    { name: "Agent", value: "agent" },
];

const AddUser = ({ title, user_type, handleOnSuccess, open, handleOnHide }) => {
    const [data, setData] = useState({
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        password: "",
        job_title: "",
        role: "agent",
    });

    const { firstname, lastname, email, phone, role, job_title } = data;

    const dispatch = useDispatch();

    const { isLoading, isSuccess, isError, type, message } = useSelector(
        (state) => state.profile
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess && type === "profile/new/fulfilled") {
            toast.success(message);
            updateData();
            handleOnSuccess();
        }

        dispatch(reset());
    }, [isError, isSuccess, message, dispatch]);

    useEffect(() => {
        updateData();
    }, []);

    const handleOnChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const updateData = () => {
        let result = [];
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@-%$#!&+?";
        const charLength = characters.length;
        for (let i = 0; i < 8; i++) {
            result.push(
                characters.charAt(Math.floor(Math.random() * charLength))
            );
        }

        setData({
            firstname: "",
            lastname: "",
            phone: "",
            email: "",
            job_title: "",
            password: result.join(""),
            role: user_type || "",
        });
    };

    const submit = (e) => {
        e.preventDefault();
        dispatch(addNewUser(data));
    };

    return (
        <Dialog visible={open} onHide={handleOnHide}>
            <div className="tw-bg-white tw-rounded-md tw-w-full md:tw-w-[34.5rem] tw-w-auto">
                <div className="form-demo">
                    <div className="card">
                        <div className="tw-text-center tw-mb-4">
                            <h2 className="tw-text-2xl tw-font-semimedium tw-mb-2">
                                {title}
                            </h2>
                        </div>
                        <form className="p-fluid" onSubmit={submit}>
                            <div className="field tw-mb-8">
                                <span className="p-float-label ">
                                    <InputText
                                        name="firstname"
                                        type="text"
                                        value={firstname}
                                        onChange={handleOnChange}
                                        required
                                    />
                                    <label htmlFor="firstname">
                                        Firstname *
                                    </label>
                                </span>
                            </div>
                            <div className="field tw-mb-8">
                                <span className="p-float-label ">
                                    <InputText
                                        name="lastname"
                                        type="text"
                                        value={lastname}
                                        onChange={handleOnChange}
                                        required
                                    />
                                    <label htmlFor="lastname">Lastname *</label>
                                </span>
                            </div>

                            <div className="field tw-mb-8">
                                <span className="p-float-label p-input-icon-right">
                                    <i className="pi pi-envelope" />
                                    <InputText
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={handleOnChange}
                                        required
                                    />
                                    <label htmlFor="email">
                                        Email Address *
                                    </label>
                                </span>
                            </div>
                            <div className="field tw-mb-8">
                                <span className="p-float-label ">
                                    <InputText
                                        name="job_title"
                                        type="text"
                                        value={job_title}
                                        onChange={handleOnChange}
                                        required
                                    />
                                    <label htmlFor="job_title">
                                        Job Title *
                                    </label>
                                </span>
                            </div>
                            <div className="field tw-mb-8">
                                <span className="p-float-label custom-label">
                                    <InputText
                                        name="phone"
                                        type="text"
                                        value={phone}
                                        onChange={handleOnChange}
                                    />
                                    <label htmlFor="phone">Phone Number</label>
                                </span>
                            </div>
                            {!user_type && (
                                <div className="field tw-mb-8">
                                    <span className="p-float-label custom-label">
                                        <Dropdown
                                            name="role"
                                            value={role}
                                            options={ROLES}
                                            onChange={handleOnChange}
                                            optionLabel="name"
                                            optionValue="value"
                                            placeholder="Select Role"
                                            className="tw-w-full"
                                        />
                                        <label htmlFor="role">
                                            Select Role
                                        </label>
                                    </span>
                                </div>
                            )}
                            <div className="tw-mb-5"></div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                label="Submit"
                                className="tw-w-full"
                            />
                        </form>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default AddUser;
