import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar } from "primereact/avatar";
import { ProgressBar } from "primereact/progressbar";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import DrawerContainer from "./DrawerContainer";
import { getAgents, clear, reset } from "../../features/profile/profileSlice";
import axios from "axios";
import { getFeedbacks } from "../../features/feedback/feedbackSlice";
import LivecallRequestChart from "../../components/LivecallRequestChart";
import CustomerRatingChart from "../../components/CustomerRatingChart";

const ManagementDashboard = () => {
    const [queryFilter, setQueryFilter] = useState(null);
    const [allSummary, setAllSummary] = useState(null);
    const [cbSummary, setCbSummary] = useState([]);
    const [lcSummary, setLcSummary] = useState([]);
    const [tkSummary, setTkSummary] = useState([]);
    const [data, setData] = useState({
        start: null,
        end: null,
        format: "xlsx",
        type: "",
    });
    const [agents, setAgents] = useState([]);
    const dispatch = useDispatch();

    const { users, isLoading, isSuccess, type, isError, message } = useSelector(
        (state) => state.profile
    );
    const { feedbacks } = useSelector((state) => state.feedback);

    useEffect(() => {
        dispatch(getAgents());
        dispatch(getFeedbacks());

        return () => dispatch(clear());
    }, []);

    useEffect(() => {
        if (users) {
            setAgents(users.data);
        }
    }, [users]);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        handleGetSummary(data);
        handleGetCbSummary(data);
        handleGetLcSummary(data);
        handleGetTkSummary(data);
    };

    const handleGetSummary = (payload) => {
        if (payload) {
            axios
                .get(`/api/summary?from=${payload.from}&to=${payload.to}`)
                .then((res) => {
                    setAllSummary(res.data);
                });
        } else {
            axios.get("/api/summary").then((res) => {
                setAllSummary(res.data);
            });
        }
    };

    const handleGetCbSummary = (payload) => {
        if (payload) {
            axios
                .get(
                    `/api/summary/callback?from=${payload.from}&to=${payload.to}`
                )
                .then((res) => {
                    setCbSummary(res.data);
                });
        } else {
            axios.get("/api/summary/callback").then((res) => {
                setCbSummary(res.data);
            });
        }
    };

    const handleGetLcSummary = (payload) => {
        if (payload) {
            axios
                .get(
                    `/api/summary/livecall?from=${payload.from}&to=${payload.to}`
                )
                .then((res) => {
                    setLcSummary(res.data);
                });
        } else {
            axios.get("/api/summary/livecall").then((res) => {
                setLcSummary(res.data);
            });
        }
    };

    const handleGetTkSummary = (payload) => {
        if (payload) {
            axios
                .get(
                    `/api/summary/ticket?from=${payload.from}&to=${payload.to}`
                )
                .then((res) => {
                    setTkSummary(res.data);
                });
        } else {
            axios.get("/api/summary/ticket").then((res) => {
                setTkSummary(res.data);
            });
        }
    };

    useEffect(() => {
        handleOnQueryFilter();
    }, [queryFilter]);

    const handleOnQueryFilter = () => {
        if (!queryFilter) {
            handleGetSummary();
            handleGetCbSummary();
            handleGetLcSummary();
            handleGetTkSummary();
        } else {
            axios.get(`/api/summary?category=${queryFilter}`).then((res) => {
                setAllSummary(res.data);
            });
            axios
                .get(`/api/summary/ticket?category=${queryFilter}`)
                .then((res) => {
                    setTkSummary(res.data);
                });
            axios
                .get(`/api/summary/livecall?category=${queryFilter}`)
                .then((res) => {
                    setLcSummary(res.data);
                });
            axios
                .get(`/api/summary/callback?category=${queryFilter}`)
                .then((res) => {
                    setCbSummary(res.data);
                });
        }
    };

    return (
        <DrawerContainer>
            <div className="tw-w-full tw-max-h-full">
                <div className="tw-shadow-md tw-rounded-md tw-bg-white tw-p-6 tw-my-6">
                    <div className="md:tw-flex tw-items-center tw-gap-4">
                        <div className="tw-grow tw-grid tw-grid-col md:tw-grid-cols-3 tw-gap-2">
                            <div className="p-float-label">
                                <Calendar
                                    value={data.start}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            start: e.value,
                                        })
                                    }
                                    maxDate={new Date()}
                                    className="tw-w-full"
                                />
                                <label htmlFor="start">Start Date</label>
                            </div>
                            <div className="p-float-label">
                                <Calendar
                                    value={data.end}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            end: e.value,
                                        })
                                    }
                                    maxDate={new Date()}
                                    className="tw-w-full"
                                />
                                <label htmlFor="end">End Date</label>
                            </div>
                            <div className="tw-flex tw-gap-2">
                                <Button
                                    label="Filter"
                                    onClick={handleOnSubmit}
                                    className=""
                                />
                                <Button
                                    label="Clear"
                                    onClick={() => {
                                        handleGetSummary();
                                        handleGetCbSummary();
                                        handleGetLcSummary();
                                        handleGetTkSummary();
                                        setData({
                                            start: null,
                                            end: null,
                                            format: "xlsx",
                                            type: "",
                                        });
                                    }}
                                    className="p-button-outlined"
                                />
                            </div>
                        </div>

                        <div className="tw-gap-2 tw-flex tw-items-center">
                            <h4 className="tw-w-24">Filter By:</h4>
                            <Dropdown
                                value={queryFilter}
                                options={QUERY_TYPE}
                                onChange={(e) => setQueryFilter(e.value)}
                                filter
                                showClear
                                placeholder="Filter by Query Category"
                                className="tw-w-full"
                            />
                        </div>
                    </div>
                </div>
                <div className="tw-grid tw-grid-cols-1 tw-gap-2 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-mb-5">
                    <div className="tw-border tw-rounded tw-py-2 tw-px-4 tw-bg-white">
                        <h2 className="tw-font-bold tw-text-xl tw-my-0">
                            {allSummary?.total_livecalls}
                        </h2>
                        <p className="tw-text-lg tw-font-medium ">
                            Number of Livecall
                        </p>
                    </div>
                    <div className="tw-border tw-rounded tw-py-2 tw-px-4 tw-bg-white">
                        <h2 className="tw-font-bold tw-text-xl tw-my-0">
                            {allSummary?.total_tickets}
                        </h2>
                        <p className="tw-text-lg tw-font-medium ">
                            Number of Ticket
                        </p>
                    </div>
                    <div className="tw-border tw-rounded tw-py-2 tw-px-4  tw-bg-white">
                        <h2 className="tw-font-bold tw-text-xl tw-my-0">
                            {allSummary?.total_callbacks}
                        </h2>
                        <p className="tw-text-lg tw-font-medium ">
                            Number of Callback
                        </p>
                    </div>
                    <div className="tw-border tw-rounded tw-py-2 tw-px-4 tw-bg-white">
                        <h2 className="tw-font-bold tw-text-xl tw-my-0">
                            {allSummary?.total_unresolve_query}
                        </h2>
                        <p className="tw-text-lg tw-font-medium ">
                            Unresolved Request
                        </p>
                    </div>
                </div>

                <div className="tw-grid tw-grid-cols-1 tw-gap-2 md:tw-grid-cols-3  tw-mb-5">
                    <div className="tw-border tw-rounded tw-p-4 tw-bg-white tw-shadow-md tw-overflow-hidden">
                        <div className="">
                            <a
                                href="/livecall/report/download"
                                className="tw-float-right"
                                download
                            >
                                <i className="pi pi-fw pi-download" />
                            </a>

                            <h2 className="tw-text-center tw-text-lg tw-font-semibold">
                                Livecall Request Category
                            </h2>
                        </div>
                        <div className="tw-h-full tw-overflow-auto">
                            {/* {lcSummary.map((item) => (
                                <div
                                    className="tw-flex tw-justify-between tw-items-center tw-p-4 tw-border-b"
                                    key={item.query_type}
                                >
                                    <p className="tw-my-0">{item.query_type}</p>
                                    <p className="tw-my-0">{item.total}</p>
                                </div>
                            ))} */}
                            <LivecallRequestChart livecall={lcSummary} />
                        </div>
                    </div>
                    <div className="tw-border tw-rounded tw-p-4 tw-bg-white  tw-shadow-md tw-overflow-hidden">
                        <div className="tw-text-center">
                            <h2 className="tw-text-lg tw-font-semibold">
                                Leaderboard
                            </h2>
                        </div>
                        <div className="tw-h-full tw-overflow-auto">
                            {agents.map((agent) => (
                                <div
                                    className="tw-p-2 tw-flex tw-items-center tw-gap-2 tw-border-b"
                                    key={agent.id}
                                >
                                    <div className="tw-flex tw-items-center">
                                        <Avatar
                                            image={agent.avatar}
                                            className="tw-mr-2"
                                            shape="circle"
                                        />
                                        <span>{agent.name}</span>
                                    </div>
                                    <div className="tw-grow">
                                        <ProgressBar
                                            value={
                                                feedbacks &&
                                                Math.round(
                                                    feedbacks
                                                        .filter(
                                                            (item) =>
                                                                item.user_id ==
                                                                agent.id
                                                        )
                                                        .map(
                                                            (item) =>
                                                                item.data
                                                                    .map(
                                                                        (val) =>
                                                                            val.rating
                                                                    )
                                                                    ?.reduce(
                                                                        (
                                                                            total,
                                                                            val
                                                                        ) =>
                                                                            total +
                                                                            val,
                                                                        0
                                                                    ) / 3
                                                        )
                                                        .reduce(
                                                            (total, val) =>
                                                                total + val,
                                                            0
                                                        )
                                                )
                                            }
                                            style={{ height: "18px" }}
                                        ></ProgressBar>
                                    </div>
                                    <div className="">
                                        {feedbacks &&
                                            Math.round(
                                                feedbacks
                                                    .filter(
                                                        (item) =>
                                                            item.user_id ==
                                                            agent.id
                                                    )
                                                    .map(
                                                        (item) =>
                                                            item.data
                                                                .map(
                                                                    (val) =>
                                                                        val.rating
                                                                )
                                                                ?.reduce(
                                                                    (
                                                                        total,
                                                                        val
                                                                    ) =>
                                                                        total +
                                                                        val,
                                                                    0
                                                                ) / 3
                                                    )
                                                    ?.reduce(
                                                        (total, val) =>
                                                            total + val,
                                                        0
                                                    )
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="tw-border tw-rounded tw-p-4 tw-bg-white  tw-shadow-md tw-overflow-hidden">
                        <div className="tw-text-center">
                            <a
                                href="/callback/report/download"
                                className="tw-float-right"
                                download
                            >
                                <i className="pi pi-fw pi-download" />
                            </a>
                            <h2 className="tw-text-lg tw-font-semibold">
                                Customer Satisfaction
                            </h2>
                        </div>
                        <div className="tw-h-full tw-overflow-auto">
                            {/* {cbSummary.map((item) => (
                                <div
                                    className="tw-flex tw-justify-between tw-items-center tw-p-4 tw-border-b"
                                    key={item.query_type}
                                >
                                    <p className="tw-my-0">{item.query_type}</p>
                                    <p className="tw-my-0">{item.total}</p>
                                </div>
                            ))} */}
                            <CustomerRatingChart feedbacks={feedbacks} />
                        </div>
                    </div>
                </div>
            </div>
        </DrawerContainer>
    );
};

export default ManagementDashboard;

const QUERY_TYPE = [
    "Second Project Request",
    "Mentor Request",
    "Developer Request",
    "Referencing",
    "Taster Session",
    "Course Enquiry",
    "New Candidate Support",
    "Software Issues",
    "LMS Queries",
    "Access Issue",
    "Other IT Issues",
];
