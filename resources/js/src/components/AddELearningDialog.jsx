import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { createTutorial } from "../features/tutorial/tutorialSlice";

const AddELearningDialog = ({ visible, handleOnHide }) => {
    const [data, setData] = useState({
        title: "",
        description: "",
        preview_image: null,
        video_url: "",
    });

    const { isLoading, isSuccess } = useSelector((state) => state.tutorial);

    const dispatch = useDispatch();

    const handleOnChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    useEffect(() => {
        if (isSuccess) {
            setData({
                title: "",
                description: "",
                preview_image: null,
                video_url: "",
            });
            handleOnHide();
        }
    }, [isLoading, isSuccess]);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("_method", "post");
        for (const key in data) {
            formData.append(`${key}`, data[key]);
        }

        dispatch(createTutorial(formData));
    };

    return (
        <Dialog visible={visible} onHide={handleOnHide} header="Add Training">
            <div className="tw-bg-white tw-rounded-md tw-w-full md:tw-w-[34.5rem] tw-w-auto form-demo">
                <div className="card">
                    <form className="p-fluid" onSubmit={handleOnSubmit}>
                        <div className="field">
                            <span className="p-float-label">
                                <InputText
                                    name="title"
                                    value={data.title}
                                    onChange={handleOnChange}
                                    required
                                />
                                <label htmlFor="title">Title *</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <InputTextarea
                                    name="description"
                                    value={data.description}
                                    onChange={handleOnChange}
                                    rows={4}
                                />
                                <label htmlFor="description">Description</label>
                            </span>
                        </div>

                        <div className="field tw-flex tw-flex-col tw-gap-2">
                            <label htmlFor="preview_image">Preview Image</label>
                            <input
                                type="file"
                                name="preview_image"
                                accept="image/*"
                                className="tw-border"
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        preview_image: e.target.files[0],
                                    })
                                }
                            />
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <InputText
                                    name="video_url"
                                    value={data.video_url}
                                    onChange={handleOnChange}
                                    required
                                />
                                <label htmlFor="video_link">Video URL *</label>
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

export default AddELearningDialog;
