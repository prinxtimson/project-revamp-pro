import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { toast } from "react-toastify";
import axios from "axios";

const CourseRecomendationDialog = ({ open, handleOnHide, user_id }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        user_id,
        course: "",
        reason: "",
        expected_end_date: "",
    });

    const handleOnChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const submit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        axios
            .post("/api/agents/recommend-training", data)
            .then((res) => {
                setIsLoading(false);
                setData({
                    user_id,
                    course: "",
                    reason: "",
                    expected_end_date: "",
                });
                toast.success("Training recommendation successful");
                handleOnHide();
            })
            .catch((err) => {
                setIsLoading(false);
                toast.error(err.response.data.message);
            });
    };

    return (
        <Dialog visible={open} onHide={handleOnHide}>
            <div className="tw-bg-white tw-rounded-md tw-w-full md:tw-w-[34.5rem] tw-w-auto">
                <div className="card">
                    <div className="tw-text-center tw-mb-4">
                        <h2 className="tw-text-2xl tw-font-semimedium tw-mb-4">
                            Recommend Training
                        </h2>
                    </div>
                    <form className="p-fluid" onSubmit={submit}>
                        <div className="field tw-mb-8">
                            <span className="p-float-label ">
                                <InputText
                                    name="course"
                                    type="text"
                                    value={data.course}
                                    onChange={handleOnChange}
                                    required
                                />
                                <label htmlFor="course">Course Name *</label>
                            </span>
                        </div>
                        <div className="field tw-mb-8">
                            <span className="p-float-label ">
                                <InputTextarea
                                    name="reason"
                                    type="text"
                                    value={data.reason}
                                    onChange={handleOnChange}
                                    rows={4}
                                />
                                <label htmlFor="reason">Reason *</label>
                            </span>
                        </div>

                        <div className="field tw-mb-8">
                            <span className="p-float-label">
                                <Calendar
                                    name="expected_end_date"
                                    value={data.expected_end_date}
                                    onChange={handleOnChange}
                                />
                                <label htmlFor="target_value">
                                    Expected End Date *
                                </label>
                            </span>
                        </div>

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
        </Dialog>
    );
};

export default CourseRecomendationDialog;
