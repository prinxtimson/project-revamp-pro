import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { InputTextarea } from "primereact/inputtextarea";
import { toast } from "react-toastify";
import axios from "axios";

const AddFeedbackDialog = ({ visible, handleOnHide, lesson }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        rating1: "0",
        rating2: "0",
        comment: "",
    });

    const handleOnSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        let formData = {
            comment: data.comment,
            support_type: "E-learning",
            support_id: lesson.id,
            data: [
                {
                    question:
                        "How likely are you to recommend this course to other colleagues?",
                    rating: data.rating1,
                },
                {
                    question:
                        "How likely can you say this course has increased your skills?",
                    rating: data.rating2,
                },
            ],
        };
        axios
            .post("/api/feedback", formData)
            .then((res) => {
                setIsLoading(false);
                toast.success("Feedback sudmitted successful");
                setData({
                    rating1: "0",
                    rating2: "0",
                    comment: "",
                });
                handleOnHide();
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
                toast.error("An error occur");
            });
    };

    return (
        <Dialog
            visible={visible}
            onHide={handleOnHide}
            header={`${lesson.title} Feedback`}
            style={{ width: "55vw" }}
            breakpoints={{ "960px": "75vw", "641px": "100vw" }}
        >
            <div className="form-demo">
                <div className="tw-mb-4">
                    <p className="tw-my-0 tw-text-lg">
                        Please answer the below questions to give your feedback
                    </p>
                </div>
                <div className="card">
                    <form className="p-fluid" onSubmit={handleOnSubmit}>
                        <div className="field">
                            <label htmlFor="title">
                                How likely are you to recommend this course to
                                other colleagues?
                            </label>
                            <span className="tw-flex tw-wrap tw-gap-3">
                                <div className="tw-flex tw-items-center">
                                    <RadioButton
                                        inputId="rating1"
                                        name="recommend"
                                        value="2"
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                rating1: e.value,
                                            })
                                        }
                                        checked={data.rating1 === "2"}
                                    />
                                    <label
                                        htmlFor="rating1"
                                        className="tw-ml-2"
                                    >
                                        Highly Unlikely
                                    </label>
                                </div>
                                <div className="tw-flex tw-items-center">
                                    <RadioButton
                                        inputId="rating2"
                                        name="recommend"
                                        value="4"
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                rating1: e.value,
                                            })
                                        }
                                        checked={data.rating1 === "4"}
                                    />
                                    <label
                                        htmlFor="rating2"
                                        className="tw-ml-2"
                                    >
                                        Unlikely
                                    </label>
                                </div>
                                <div className="tw-flex tw-items-center">
                                    <RadioButton
                                        inputId="rating3"
                                        name="recommend"
                                        value="5"
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                rating1: e.value,
                                            })
                                        }
                                        checked={data.rating1 === "5"}
                                    />
                                    <label
                                        htmlFor="rating3"
                                        className="tw-ml-2"
                                    >
                                        Neutral
                                    </label>
                                </div>
                                <div className="tw-flex tw-items-center">
                                    <RadioButton
                                        inputId="rating4"
                                        name="recommend"
                                        value="8"
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                rating1: e.value,
                                            })
                                        }
                                        checked={data.rating1 === "8"}
                                    />
                                    <label
                                        htmlFor="rating4"
                                        className="tw-ml-2"
                                    >
                                        Very Likely
                                    </label>
                                </div>
                                <div className="tw-flex tw-items-center">
                                    <RadioButton
                                        inputId="rating5"
                                        name="recommend"
                                        value="10"
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                rating1: e.value,
                                            })
                                        }
                                        checked={data.rating1 === "10"}
                                    />
                                    <label
                                        htmlFor="rating4"
                                        className="tw-ml-2"
                                    >
                                        Highly Likely
                                    </label>
                                </div>
                            </span>
                        </div>

                        <div className="field">
                            <label htmlFor="title">
                                How likely can you say this course has increased
                                your skills?
                            </label>
                            <span className="tw-flex tw-wrap tw-gap-3">
                                <div className="tw-flex tw-items-center">
                                    <RadioButton
                                        inputId="rating1"
                                        name="recommend"
                                        value="2"
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                rating2: e.value,
                                            })
                                        }
                                        checked={data.rating2 === "2"}
                                    />
                                    <label
                                        htmlFor="rating1"
                                        className="tw-ml-2"
                                    >
                                        Highly Unlikely
                                    </label>
                                </div>
                                <div className="tw-flex tw-items-center">
                                    <RadioButton
                                        inputId="rating2"
                                        name="recommend"
                                        value="4"
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                rating2: e.value,
                                            })
                                        }
                                        checked={data.rating2 === "4"}
                                    />
                                    <label
                                        htmlFor="rating2"
                                        className="tw-ml-2"
                                    >
                                        Unlikely
                                    </label>
                                </div>
                                <div className="tw-flex tw-items-center">
                                    <RadioButton
                                        inputId="rating3"
                                        name="recommend"
                                        value="5"
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                rating2: e.value,
                                            })
                                        }
                                        checked={data.rating2 === "5"}
                                    />
                                    <label
                                        htmlFor="rating3"
                                        className="tw-ml-2"
                                    >
                                        Neutral
                                    </label>
                                </div>
                                <div className="tw-flex tw-items-center">
                                    <RadioButton
                                        inputId="rating4"
                                        name="recommend"
                                        value="8"
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                rating2: e.value,
                                            })
                                        }
                                        checked={data.rating2 === "8"}
                                    />
                                    <label
                                        htmlFor="rating4"
                                        className="tw-ml-2"
                                    >
                                        Very Likely
                                    </label>
                                </div>
                                <div className="tw-flex tw-items-center">
                                    <RadioButton
                                        inputId="rating5"
                                        name="recommend"
                                        value="10"
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                rating2: e.value,
                                            })
                                        }
                                        checked={data.rating2 === "10"}
                                    />
                                    <label
                                        htmlFor="rating4"
                                        className="tw-ml-2"
                                    >
                                        Highly Likely
                                    </label>
                                </div>
                            </span>
                        </div>

                        <div className="field">
                            <label htmlFor="comment">
                                Please give your feedback in the box below
                            </label>
                            <InputTextarea
                                name="comment"
                                value={data.comment}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        comment: e.target.value,
                                    })
                                }
                                rows={4}
                            />
                        </div>

                        <div className="tw-mb-5">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                label="Submit"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </Dialog>
    );
};

export default AddFeedbackDialog;
