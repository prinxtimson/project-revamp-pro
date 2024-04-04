import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DrawerContainer from "./DrawerContainer";
import AddELearningDialog from "../../components/AddELearningDialog";
import {
    getTutorials,
    clear,
    reset,
} from "../../features/tutorial/tutorialSlice";
import RecommendedLessonDialog from "../../components/RecommendedLessonDialog";

const ELearningPage = () => {
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);

    const { lessons, isLoading, isSuccess, isError, type, message } =
        useSelector((state) => state.tutorial);
    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getTutorials());

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
            <div className="tw-grow tw-w-full tw-m-4 md:tw-m-8 tw-flex tw-flex-col tw-gap-4">
                <AddELearningDialog
                    visible={visible}
                    handleOnHide={() => setVisible(false)}
                />
                <RecommendedLessonDialog
                    visible={visible2}
                    handleOnHide={() => setVisible2(false)}
                    lessons={lessons}
                />
                {user && user?.roles[0].name == "super-admin" && (
                    <div className="tw-mb-4">
                        <Button
                            label="Add Training"
                            onClick={() => setVisible(true)}
                        />
                    </div>
                )}

                <div className="tw-grow tw-overflow-auto tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                    {lessons.map((lesson) => (
                        <div
                            className="tw-rounded tw-shadow tw-bg-white tw-flex tw-flex-col tw-gap-3"
                            key={lesson.id}
                        >
                            <div className="">
                                <img
                                    alt={lesson.title}
                                    src={lesson.preview_image}
                                    height={350}
                                    width={"100%"}
                                />
                            </div>
                            <div className="tw-p-4">
                                <h2 className="tw-my-2 tw-text-xl">
                                    {lesson.title}
                                </h2>
                                <p className="tw-my-2 tw-text-md">
                                    {lesson.description.length > 100
                                        ? `${lesson.description.slice(
                                              0,
                                              100
                                          )}...`
                                        : lesson.description}
                                </p>
                                <div className="">
                                    <Button
                                        label="Read more"
                                        link
                                        text
                                        onClick={() =>
                                            navigate(`view/${lesson.id}`)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="tw-flex tw-justify-center tw-p-3">
                    <Button
                        label="Recommended courses"
                        onClick={() => setVisible2(true)}
                    />
                </div>
            </div>
        </DrawerContainer>
    );
};

export default ELearningPage;
