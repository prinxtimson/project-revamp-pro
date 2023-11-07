import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BsEmojiFrown,
    BsEmojiSmile,
    BsEmojiNeutral,
    BsChatDots,
} from "react-icons/bs";
import {
    getFeedbacks,
    getFeedbacksByAgent,
    clear,
    reset,
} from "../../features/feedback/feedbackSlice";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import DrawerContainer from "./DrawerContainer";
import { toast } from "react-toastify";
import moment from "moment";
import {
    getAgents,
    clear as clearAgent,
} from "../../features/profile/profileSlice";

const FeedbackTable = () => {
    const [chatData, setChatData] = useState(null);
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [feedbackRatings, setFeedbackRatings] = useState([]);
    const [page, setPage] = useState(0);
    const [curreentDate, setCurrentDate] = useState("");

    const { feedbacks, isLoading, isSuccess, type, isError, message } =
        useSelector((state) => state.feedback);
    const { users } = useSelector((state) => state.profile);

    const dispatch = useDispatch();

    const handleDelete = (row) => {};

    const handleDisable = (row) => {};

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        if (selectedAgent) {
            dispatch(getFeedbacksByAgent(selectedAgent.id));
        } else {
            dispatch(getFeedbacks());
        }
    }, [selectedAgent]);

    useEffect(() => {
        if (isSuccess && message) {
            toast.success(message);
        }

        dispatch(reset());
    }, [isLoading, isSuccess, type, isError, message]);

    useEffect(() => {
        if (feedbacks) {
            let _newArr = feedbacks.map((item) => ({
                created_at: moment(item.created_at.split("T")[0]).format("ll"),
                ratings: item.data.map((val) => val.rating),
            }));

            _newArr = _newArr.map((item) => ({
                ...item,
                ratings: Math.round(
                    item.ratings.reduce((total, val) => total + val) / 3
                ),
            }));

            setFeedbackRatings(_newArr.map((val) => val.ratings));
            let _chatData = {
                labels: _newArr.map((val) => val.created_at),
                datasets: [
                    {
                        label: "Feedabck Ratings",
                        data: _newArr.map((val) => val.ratings),
                        fill: false,
                        borderColor: "#42A5F5",
                        tension: 0.4,
                    },
                ],
            };

            setChatData(_chatData);
        }
    }, [feedbacks]);

    useEffect(() => {
        let _d = new Date().toISOString();
        _d = _d.split("T")[0];
        setCurrentDate(_d);

        dispatch(getAgents());

        return () => {
            dispatch(clear());
            dispatch(clearAgent());
        };
    }, []);

    useEffect(() => {
        if (users) {
            setAgents(users.data);
        }
    }, [users]);

    return (
        <DrawerContainer>
            <div className="tw-w-full tw-h-full">
                <div className="tw-p-2 tw-mb-2 tw-w-full sm:tw-w-80">
                    <Dropdown
                        value={selectedAgent}
                        options={agents}
                        onChange={(e) => setSelectedAgent(e.value)}
                        optionLabel="name"
                        filter
                        showClear
                        placeholder="Agent"
                        className="tw-w-full"
                    />
                </div>
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                    <div className="tw-shadow-md tw-bg-white tw-rounded-md tw-overflow-hidden">
                        <div className="tw-border tw-text-center tw-bg-amber-400">
                            <h3>Feedback Report Analytics</h3>
                        </div>
                        <div className="tw-p-8">
                            <div className="tw-border tw-rounded tw-p-4 tw-mb-4">
                                <div className="tw-flex tw-items-center tw-gap-4">
                                    <div className="tw-rounded-full tw-p-3 tw-border-2 tw-border-blue-500">
                                        <BsChatDots color="blue" size={35} />
                                    </div>
                                    <div className="tw-grow">
                                        <h4 className="tw-my-1">
                                            {feedbacks?.length}
                                        </h4>
                                        <p className="tw-my-0">
                                            Total Feedbacks
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="tw-border tw-rounded tw-p-4 tw-mb-4">
                                <div className="tw-flex tw-items-center tw-gap-4">
                                    <div className="tw-rounded-full tw-p-3 tw-border-2 tw-border-blue-500">
                                        <BsChatDots color="blue" size={35} />
                                    </div>
                                    <div className="tw-grow">
                                        <h4 className="tw-my-1">
                                            {
                                                feedbacks?.filter(
                                                    (item) =>
                                                        item.created_at.split(
                                                            "T"
                                                        ) == curreentDate
                                                ).length
                                            }
                                        </h4>
                                        <p className="tw-my-0">
                                            Today's Feedbacks
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="tw-border tw-rounded tw-p-4 tw-mb-4">
                                <div className="tw-flex tw-items-center tw-gap-4">
                                    <div className="tw-rounded-full tw-p-3 tw-border-2 tw-border-red-500">
                                        <BsEmojiFrown color="red" size={35} />
                                    </div>
                                    <div className="tw-grow">
                                        <h4 className="tw-my-1">
                                            {
                                                feedbackRatings?.filter(
                                                    (item) => item < 5
                                                ).length
                                            }
                                        </h4>
                                        <p className="tw-my-0">
                                            Nagative Feedbacks
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="tw-border tw-rounded tw-p-4 tw-mb-4">
                                <div className="tw-flex tw-items-center tw-gap-4">
                                    <div className="tw-rounded-full tw-p-3 tw-border-2 tw-border-gray-500">
                                        <BsEmojiNeutral size={35} />
                                    </div>
                                    <div className="tw-grow">
                                        <h4 className="tw-my-1">
                                            {
                                                feedbackRatings?.filter(
                                                    (item) => item === 5
                                                ).length
                                            }
                                        </h4>
                                        <p className="tw-my-0">
                                            Neutral Feedbacks
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="tw-border tw-rounded tw-p-4 tw-mb-4">
                                <div className="tw-flex tw-items-center tw-gap-4">
                                    <div className="tw-rounded-full tw-p-3 tw-border-2 tw-border-green-500">
                                        <BsEmojiSmile
                                            color="#22c561"
                                            size={35}
                                        />
                                    </div>
                                    <div className="tw-grow">
                                        <h4 className="tw-my-1">
                                            {
                                                feedbackRatings?.filter(
                                                    (item) => item > 5
                                                ).length
                                            }
                                        </h4>
                                        <p className="tw-my-0">
                                            Positive Feedbacks
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tw-flex tw-flex-col tw-gap-4">
                        <div className="tw-shadow-md tw-rounded-md tw-bg-white tw-grow tw-overflow-hidden tw-h-1/2">
                            <div className="tw-border tw-text-center tw-bg-teal-400">
                                <h3>Current Feedbacks</h3>
                            </div>

                            <div className="tw-h-full tw-overflow-auto tw-p-2">
                                {feedbacks?.map((item) => (
                                    <div
                                        className="tw-border-b tw-p-2 tw-text-base"
                                        key={item.id}
                                    >
                                        {item.comment}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="tw-shadow-md tw-rounded-md tw-bg-white tw-grow tw-overflow-hidden tw-h-1/2">
                            <div className="tw-border tw-text-center tw-bg-lime-400">
                                <h3>Monthly Feedback</h3>
                            </div>

                            <div className="tw-p-4 ">
                                {chatData && (
                                    <Chart
                                        type="line"
                                        data={chatData}
                                        options={basicOptions}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DrawerContainer>
    );
};

export default FeedbackTable;

const basicOptions = {
    maintainAspectRatio: false,
    aspectRatio: 1.3,
    plugins: {
        legend: {
            labels: {
                color: "#495057",
            },
        },
    },
    scales: {
        x: {
            ticks: {
                color: "#495057",
            },
            grid: {
                color: "#ebedef",
            },
        },
        y: {
            ticks: {
                color: "#495057",
            },
            grid: {
                color: "#ebedef",
            },
        },
    },
};
