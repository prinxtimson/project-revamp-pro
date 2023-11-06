import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Rating } from "primereact/rating";
import { ProgressBar } from "primereact/progressbar";
import "react-phone-input-2/lib/material.css";
import PhoneInput from "react-phone-input-2";
import DrawerContainer from "./DrawerContainer";
import {
    getProfileById,
    updateUser,
    reset,
    clear,
} from "../../features/profile/profileSlice";
import { toast } from "react-toastify";
import moment from "moment";
import CourseRecomendationDialog from "../../components/CourseRecomendationDialog";

const AgentPage = () => {
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [data, setData] = useState({
        id: "",
        firstname: "",
        lastname: "",
        email: "",
        job_title: "",
        phone: "",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isLoading, isSuccess, type, isError, message } = useSelector(
        (state) => state.profile
    );

    useEffect(() => {
        dispatch(getProfileById(id));

        return () => dispatch(clear());
    }, []);

    const handleOnChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    useEffect(() => {
        if (user) {
            setData({
                id: user.id,
                firstname: user.profile.firstname,
                email: user.email,
                lastname: user.profile.lastname,
                phone: user.phone || "",
                job_title: user.profile.job_title || "",
            });
        }
    }, [user]);

    useEffect(() => {
        if (isError && message) {
            toast.error(message);
        }

        if (isSuccess && message) {
            toast.success(message);
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, dispatch]);

    const submit = (e) => {
        e.preventDefault();
        let formData = new FormData();

        formData.append("_method", "post");
        for (const key in data) {
            formData.append(`${key}`, data[key]);
        }

        dispatch(updateUser({ id: user.id, formData }));
    };

    return (
        <DrawerContainer>
            <div className="tw-w-full tw-h-full tw-p-5">
                {isLoading || !user ? (
                    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
                        <div className="tw-h-80">
                            <Skeleton width="100%" height="100%" />
                        </div>
                        <div className="tw-gap-4 tw-col-span-2">
                            <Skeleton width="100%" height="20rem" />
                            <Skeleton width="100%" height="20rem" />
                        </div>
                    </div>
                ) : (
                    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
                        <div className="tw-shadow-md tw-bg-white tw-rounded tw-p-6">
                            <div className="tw-mb-2 tw-flex tw-items-center">
                                <div
                                    className={`tw-p-2 tw-rounded-full ${
                                        !user.login_at
                                            ? "tw-bg-red-500"
                                            : moment().diff(
                                                  moment(user.login_at),
                                                  "minutes"
                                              ) >= 10
                                            ? "tw-bg-gray-400"
                                            : "tw-bg-green-500"
                                    } tw-mr-2`}
                                ></div>
                                <small className="tw-my-0">
                                    {!user.login_at
                                        ? "Offline"
                                        : moment().diff(
                                              moment(user.login_at),
                                              "minutes"
                                          ) > 10
                                        ? "Away"
                                        : "Online"}
                                </small>
                            </div>
                            <div className="tw-mx-auto tw-mb-4">
                                <img
                                    src={user.avatar}
                                    className={`tw-rounded-full tw-w-52 tw-h-52 `}
                                />
                            </div>
                            <div className="tw-my-4">
                                <div className="tw-flex tw-items-center tw-gap-4 tw-mt-4">
                                    <h4 className="tw-my-0">Name:</h4>
                                    <p className="tw-my-0">{user.name}</p>
                                </div>
                                <div className="tw-flex tw-items-center tw-gap-4 tw-mt-4">
                                    <h4 className="tw-my-0">Job Title:</h4>
                                    <p className="tw-my-0">
                                        {user.profile.job_title}
                                    </p>
                                </div>
                                <div className="tw-flex tw-items-center tw-gap-4 tw-mt-4">
                                    <h4 className="tw-my-0">ID:</h4>
                                    <p className="tw-my-0">{user.id}</p>
                                </div>
                                <div className="tw-flex tw-items-center tw-gap-4 tw-mt-4">
                                    <h4 className="tw-my-0">Tel:</h4>
                                    <p className="tw-my-0">{user.phone}</p>
                                </div>
                                <div className="tw-flex tw-items-center tw-gap-4 tw-mt-4">
                                    <h4 className="tw-my-0">Email:</h4>
                                    <p className="tw-my-0">{user.email}</p>
                                </div>
                            </div>
                            <div className="">
                                <Button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => setOpen(true)}
                                    label="Edit Profile"
                                    className="tw-w-full"
                                />
                            </div>
                        </div>

                        <div className="tw-gap-4 tw-col-span-2 tw-flex tw-flex-col">
                            <div className="tw-shadow-md tw-rounded tw-bg-white tw-p-4 tw-mb-4">
                                <div className="tw-flex tw-justify-between tw-items-center">
                                    <div className="tw-flex tw-gap-4 tw-items-center">
                                        <h3>Agent Ranking</h3>

                                        <Rating
                                            value={4.5}
                                            readOnly
                                            cancel={false}
                                        />
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={() => setOpenDialog(true)}
                                        label="Recommend Training"
                                        className=" p-button-outlined"
                                    />
                                </div>
                            </div>

                            <div className="tw-grow tw-shadow-md tw-rounded tw-bg-white tw- md:tw-p-6">
                                <div className="tw-grid tw-items-center tw-grid-cols-6 tw-gap-2 tw-mb-2">
                                    <h5>CSAT</h5>
                                    <ProgressBar
                                        value={
                                            user.performance_indicators
                                                .customer_satisfaction
                                        }
                                        style={{ height: "15px" }}
                                        className="tw-col-span-4"
                                    ></ProgressBar>
                                    <h5>
                                        {
                                            user.performance_indicators
                                                .customer_satisfaction
                                        }
                                        %
                                    </h5>
                                </div>

                                <div className="tw-grid tw-items-center tw-grid-cols-6 tw-gap-2 tw-mb-2">
                                    <h5>AHT</h5>
                                    <ProgressBar
                                        value={
                                            user.performance_indicators
                                                .average_handle_time
                                        }
                                        style={{ height: "15px" }}
                                        className="tw-col-span-4"
                                    ></ProgressBar>
                                    <h5>
                                        {
                                            user.performance_indicators
                                                .average_handle_time
                                        }
                                    </h5>
                                </div>

                                <div className="tw-grid tw-items-center tw-grid-cols-6 tw-gap-2 tw-mb-2">
                                    <h5>ART</h5>
                                    <ProgressBar
                                        value={
                                            user.performance_indicators
                                                .customer_satisfaction
                                        }
                                        style={{ height: "15px" }}
                                        className="tw-col-span-4"
                                    ></ProgressBar>
                                    <h5>
                                        {
                                            user.performance_indicators
                                                .customer_satisfaction
                                        }
                                    </h5>
                                </div>

                                <div className="tw-grid tw-items-center tw-grid-cols-6 tw-gap-2 tw-mb-2">
                                    <h5>CWT</h5>
                                    <ProgressBar
                                        value={
                                            user.performance_indicators
                                                .customer_satisfaction
                                        }
                                        style={{ height: "15px" }}
                                        className="tw-col-span-4"
                                    ></ProgressBar>
                                    <h5>
                                        {
                                            user.performance_indicators
                                                .customer_satisfaction
                                        }
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <CourseRecomendationDialog
                    open={openDialog}
                    user_id={id}
                    handleOnHide={() => setOpenDialog(false)}
                />
                <Dialog
                    visible={open}
                    maximized
                    modal
                    onHide={() => setOpen(false)}
                >
                    <div className="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
                        <div className="tw-shadow-md tw-rounded-md tw-p-4 md:tw-p-8 tw-w-full md:tw-w-[34.5rem]">
                            <div className="">
                                <div className="tw-text-center tw-mb-6">
                                    <h2 className="tw-text-2xl tw-font-semimedium tw-mb-0">
                                        Edit Profile
                                    </h2>
                                </div>
                                <form className="p-fluid" onSubmit={submit}>
                                    <div className="field tw-mb-8">
                                        <span className="p-float-label ">
                                            <InputText
                                                name="firstname"
                                                type="text"
                                                value={data.firstname}
                                                onChange={handleOnChange}
                                                required
                                            />
                                            <label htmlFor="name" className="">
                                                Firstname *
                                            </label>
                                        </span>
                                    </div>
                                    <div className="field tw-mb-8">
                                        <span className="p-float-label ">
                                            <InputText
                                                name="lastname"
                                                type="text"
                                                value={data.lastname}
                                                readOnly
                                            />
                                            <label
                                                htmlFor="lastname"
                                                className=""
                                            >
                                                Lastname *
                                            </label>
                                        </span>
                                    </div>
                                    <div className="field tw-mb-8">
                                        <span className="p-float-label p-input-icon-right">
                                            <i className="pi pi-envelope" />
                                            <InputText
                                                name="email"
                                                type="email"
                                                value={data.email}
                                                onChange={handleOnChange}
                                            />
                                            <label htmlFor="email" className="">
                                                Email *
                                            </label>
                                        </span>
                                    </div>
                                    <div className="field tw-mb-8">
                                        <span className="p-float-label ">
                                            <InputText
                                                name="job_title"
                                                type="text"
                                                value={data.job_title}
                                                onChange={handleOnChange}
                                                required
                                            />
                                            <label
                                                htmlFor="job_title"
                                                className=""
                                            >
                                                Job Title
                                            </label>
                                        </span>
                                    </div>

                                    <div className="field tw-mb-8">
                                        <span className=" ">
                                            <PhoneInput
                                                inputStyle={{
                                                    paddingTop: "14.5px",
                                                    paddingBottom: "14.5px",
                                                    width: "100%",
                                                }}
                                                country={"gb"}
                                                value={data.phone}
                                                onChange={handleOnChange}
                                                specialLabel="Phone Number *"
                                            />
                                        </span>
                                    </div>
                                    <div className="tw-flex tw-items-center tw-gap-4">
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            label="Submit"
                                            className="tw-w-full"
                                        />
                                        <Button
                                            type="button"
                                            disabled={isLoading}
                                            label="Cancel"
                                            className="tw-w-full p-button-outlined"
                                            onClick={() => setOpen(false)}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </DrawerContainer>
    );
};

export default AgentPage;
