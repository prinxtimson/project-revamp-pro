import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { toast } from "react-toastify";

import DrawerContainer from "./DrawerContainer";
import { reset, uploadAvatar } from "../../features/auth/authSlice";

const UploadProfileImage = () => {
    const inputRef = useRef(null);
    const [fileInputRef, setFileInputRef] = useState(null);
    const [file, setFile] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isLoading, isSuccess, type, isError, message } = useSelector(
        (state) => state.auth
    );

    const itemTemplate = (file, props) => {
        return (
            <div className="tw-border-0 tw-flex tw-items-center tw-flex-wrap tw-justify-between">
                <div
                    className="tw-flex tw-items-center"
                    style={{ width: "50%" }}
                >
                    <img
                        alt={file.name}
                        role="presentation"
                        src={file.objectURL}
                        width={100}
                    />
                    <span className="tw-flex tw-flex-col tw-text-left tw-ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag
                    value={props.formatSize}
                    severity="warning"
                    className="tw-px-3 tw-py-2"
                />
                <Button
                    type="button"
                    icon="pi pi-times"
                    className="p-button-outlined p-button-rounded p-button-danger ml-auto"
                    onClick={() => onTemplateRemove(file, props.onRemove)}
                />
            </div>
        );
    };

    const onTemplateRemove = (file, callback) => {
        setFile(null);
        callback();
    };

    const emptyTemplate = () => {
        return (
            <div className="tw-border-0 tw-flex tw-items-center tw-flex-col">
                <i
                    className="pi pi-image mt-3 p-5"
                    style={{
                        fontSize: "5em",
                        borderRadius: "50%",
                        backgroundColor: "var(--surface-b)",
                        color: "var(--surface-d)",
                    }}
                ></i>
                <span
                    style={{
                        fontSize: "1.2em",
                        color: "var(--text-color-secondary)",
                    }}
                    className="tw-my-5"
                >
                    Drag and Drop your Photo Here
                </span>
            </div>
        );
    };

    const headerTemplate = () => <div />;

    const handleFileSelect = (e) => {
        setFile(e.files[0]);
    };

    const handleFileSelect2 = (e) => {
        setFile(e.target.files[0]);
        inputRef.current.setFiles([e.target.files[0]]);
    };

    useEffect(() => {
        console.log(file);
    }, [file]);

    useEffect(() => {
        if (isSuccess && message) {
            toast.success(message);
            setFile(null);
            inputRef.current.setFiles([]);
        }

        if (isError) {
            toast.error(message);
        }

        dispatch(reset());
    }, [isLoading, isSuccess, type, isError, message]);

    const handleSubmit = () => {
        let formData = new FormData();
        if (file) {
            formData.append("avatar", file);
        }
        formData.append("_method", "put");
        dispatch(uploadAvatar(formData));
    };

    return (
        <DrawerContainer>
            <div className="tw-grow tw-m-5 md:tw-my-8 md:tw-mx-6 tw-flex tw-items-center">
                <input
                    name="avatar"
                    hidden
                    onChange={(e) => handleFileSelect2(e)}
                    type="file"
                    accept="image/*"
                    ref={(ref) => setFileInputRef(ref)}
                />
                <div className=" tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-4 tw-">
                    <div className="tw-p-4 tw-flex tw-flex-col tw-justify-center">
                        <p className="tw-my-2">
                            Your file format should be in .jpeg or .png
                        </p>
                        <p className="tw-my-2">Your photo should be 5MB max</p>
                    </div>
                    <div className="tw-col-span-2">
                        <FileUpload
                            ref={inputRef}
                            name="avatar"
                            url="#"
                            accept="image/*"
                            maxFileSize={5000000}
                            itemTemplate={itemTemplate}
                            emptyTemplate={emptyTemplate}
                            headerTemplate={headerTemplate}
                            onSelect={handleFileSelect}
                            className="tw-w-full"
                            customUpload
                        />

                        <div className="tw-mt-2 tw-flex tw-items-center tw-justify-center tw-gap-4">
                            <Button
                                label="Select File"
                                onClick={() => fileInputRef.click()}
                                loading={isLoading}
                            />
                            <Button
                                label="Upload"
                                onClick={handleSubmit}
                                loading={isLoading}
                            />
                            <Button
                                outlined
                                severity="danger"
                                label="Cancel"
                                onClick={() => navigate(-1)}
                                loading={isLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DrawerContainer>
    );
};

export default UploadProfileImage;
