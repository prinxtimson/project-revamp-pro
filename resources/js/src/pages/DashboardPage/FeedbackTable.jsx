import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Knob } from "primereact/knob";
import { Rating } from "primereact/rating";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import {
    getFeedbacks,
    clear,
    reset,
    filterFeedback,
} from "../../features/feedback/feedbackSlice";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import DrawerContainer from "./DrawerContainer";
import { toast } from "react-toastify";
import moment from "moment";
import _ from "lodash";
import {
    getAgents,
    clear as clearAgent,
} from "../../features/profile/profileSlice";

const FeedbackTable = () => {
    const [chatData, setChatData] = useState(null);
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [feedbackRatings, setFeedbackRatings] = useState([]);
    const [data, setData] = useState({
        user: null,
        from: null,
        to: null,
        category: null,
    });

    const { feedbacks, isLoading, isSuccess, type, isError, message } =
        useSelector((state) => state.feedback);
    const { users } = useSelector((state) => state.profile);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getFeedbacks());
    }, []);

    const handleFilterFeedback = () => {
        dispatch(filterFeedback(data));
    };

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

            let labels = [];
            let data = [];
            let _feedbacks = _.groupBy(feedbacks, (val) =>
                moment(val.created_at.split("T")[0]).format("ll")
            );

            Object.keys(_feedbacks).map((key) => {
                labels.push(key);
                data.push(_feedbacks[key].length);
            });
            const documentStyle = getComputedStyle(document.documentElement);
            let _chatData = {
                labels,
                datasets: [
                    {
                        label: "Feedabck",
                        data,
                        fill: false,
                        backgroundColor:
                            documentStyle.getPropertyValue("--green-500"),
                        borderColor:
                            documentStyle.getPropertyValue("--green-500"),
                        tension: 0.4,
                    },
                ],
            };

            setChatData(_chatData);
        }
    }, [feedbacks]);

    useEffect(() => {
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
            <div className="tw-w-full tw-h-full tw-flex tw-flex-col tw-gap-4">
                <div className="tw-my-5 tw-p-3 md:tw-p-6 tw-shadow tw-rounded tw-bg-white tw-w-full">
                    <div className="tw-mb-2 ">
                        <h3 className="tw-my-0 tw-font-semibold">Filter By:</h3>
                    </div>
                    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-5 tw-gap-2 tw-items-center">
                        <div className="">
                            <Dropdown
                                value={data.user}
                                options={agents}
                                onChange={(e) =>
                                    setData({ ...data, user: e.value })
                                }
                                optionLabel="name"
                                optionValue="id"
                                filter
                                showClear
                                placeholder="Select user"
                                className="tw-w-full"
                            />
                        </div>
                        <div className="tw-flex tw-gap-2 tw-col-span-2">
                            <div className="">
                                <Calendar
                                    name="from"
                                    value={data.from}
                                    placeholder="From"
                                    className="tw-w-full"
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            from: e.value,
                                        })
                                    }
                                    maxDate={data.to}
                                    showButtonBar
                                    showIcon
                                />
                            </div>
                            <div className="">
                                <Calendar
                                    name="to"
                                    value={data.to}
                                    placeholder="To"
                                    className="tw-w-full"
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            to: e.value,
                                        })
                                    }
                                    minDate={data.from}
                                    showButtonBar
                                    showIcon
                                />
                            </div>
                        </div>
                        <div className="">
                            <Dropdown
                                value={data.category}
                                options={CATEGORIES}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        category: e.target.value,
                                    })
                                }
                                placeholder="Select category"
                                showClear
                                className="tw-w-full"
                            />
                        </div>
                        <div className="">
                            <Button
                                label="Filter"
                                className="tw-w-full md:tw-w-40"
                                onClick={handleFilterFeedback}
                            />
                        </div>
                    </div>
                </div>

                <div className="tw-mb-5 tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-5 tw-gap-2 sm:tw-gap-4">
                    <div className="tw-rounded tw-shadow tw-p-3 tw-text-center tw-bg-white">
                        <h3 className="tw-mt-0 tw-mb-2">Not at all likely</h3>
                        <p className="tw-my-0">
                            {" "}
                            {feedbackRatings?.filter((item) => item < 3).length}
                        </p>
                    </div>
                    <div className="tw-rounded tw-shadow tw-p-3 tw-text-center tw-bg-white">
                        <h3 className="tw-mt-0 tw-mb-2">Somewhat likely</h3>
                        <p className="tw-my-0">
                            {" "}
                            {
                                feedbackRatings?.filter(
                                    (item) => item > 3 && item < 5
                                ).length
                            }
                        </p>
                    </div>
                    <div className="tw-rounded tw-shadow tw-p-3 tw-text-center tw-bg-white">
                        <h3 className="tw-mt-0 tw-mb-2">Neutral</h3>
                        <p className="tw-my-0">
                            {
                                feedbackRatings?.filter((item) => item === 5)
                                    .length
                            }
                        </p>
                    </div>
                    <div className="tw-rounded tw-shadow tw-p-3 tw-text-center tw-bg-white">
                        <h3 className="tw-mt-0 tw-mb-2">Somewhat likely</h3>
                        <p className="tw-my-0">
                            {
                                feedbackRatings?.filter(
                                    (item) => item > 5 && item < 9
                                ).length
                            }
                        </p>
                    </div>
                    <div className="tw-rounded tw-shadow tw-p-3 tw-text-center tw-bg-white">
                        <h3 className="tw-mt-0 tw-mb-2">Very likely</h3>
                        <p className="tw-my-0">
                            {
                                feedbackRatings?.filter((item) => item >= 9)
                                    .length
                            }
                        </p>
                    </div>
                </div>

                <div className=" tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                    <div className="">
                        <div className="tw-p-4 tw-shadow-md tw-rounded-md tw-bg-white">
                            {chatData && (
                                <Chart
                                    type="bar"
                                    data={chatData}
                                    options={basicOptions}
                                />
                            )}
                        </div>
                    </div>
                    <div className="">
                        <div className="tw-h-full tw-p-4 tw-shadow-md tw-rounded-md tw-bg-white tw-flex tw-flex-col tw-items-center tw-justify-center">
                            <Knob
                                value={(
                                    feedbackRatings.reduce((a, b) => a + b, 0) /
                                    feedbackRatings.length
                                ).toFixed(1)}
                                readOnly
                                size={200}
                                max={10}
                                //valueColor="blue"
                            />
                            <div className="tw-my-2 tw-text-center">
                                <h3 className="tw-my-2">Average star rating</h3>

                                <Rating
                                    value={
                                        feedbackRatings.reduce(
                                            (a, b) => a + b,
                                            0
                                        ) / feedbackRatings.length
                                    }
                                    readOnly
                                    cancel={false}
                                    stars={10}
                                />
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
    aspectRatio: 0.8,
    plugins: {
        legend: {
            labels: {
                color: "#495057",
            },
        },
    },
};

const CATEGORIES = ["Feedback", "Callback", "Livecall", "Livechat"];
