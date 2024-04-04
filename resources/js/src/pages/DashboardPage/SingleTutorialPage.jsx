import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";

import DrawerContainer from "./DrawerContainer";
import {
    getTutorialtById,
    clear,
    reset,
} from "../../features/tutorial/tutorialSlice";
import AddFeedbackDialog from "../../components/AddFeedbackDialog";

const SingleTutorialPage = () => {
    const [visible, setVisible] = useState(false);
    const { id } = useParams();

    const { lesson, isLoading, isSuccess, isError, type, message } =
        useSelector((state) => state.tutorial);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTutorialtById(id));

        return () => dispatch(clear());
    }, []);

    useEffect(() => {
        if (isError && message) {
            toast.error(message);
        }

        if (isSuccess && message) {
            toast.success(message);
        }

        dispatch(reset());
    }, [isLoading, isSuccess, type, isError, message]);

    return (
        <DrawerContainer>
            {lesson && (
                <>
                    <AddFeedbackDialog
                        visible={visible}
                        handleOnHide={() => setVisible(false)}
                        lesson={lesson}
                    />
                    <div className="tw-grow tw-p-3 sm:tw-p-6">
                        <div className="">
                            <div className="tw-mb-4">
                                <ReactPlayer
                                    url={lesson.video_url}
                                    controls={true}
                                />
                            </div>
                            <div className="">
                                <h2 className="tw-mb-3 tw-mt-0 tw-text-2xl">
                                    {lesson.title}
                                </h2>
                                <p className="tw-my-2 tw-text-lg">
                                    {lesson.description}
                                </p>
                            </div>
                            <div className="tw-flex tw-justify-end">
                                <Button
                                    label="Feedback"
                                    onClick={() => setVisible(true)}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </DrawerContainer>
    );
};

export default SingleTutorialPage;
