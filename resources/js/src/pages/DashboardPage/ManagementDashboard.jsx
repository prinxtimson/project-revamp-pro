import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import { MultiSelect } from "primereact/multiselect";
import DrawerContainer from "./DrawerContainer";
import { getProfiles, clear, reset } from "../../features/profile/profileSlice";
import axios from "axios";
import {
    getFeedbacks,
    onUpdateFeedbacks,
} from "../../features/feedback/feedbackSlice";
import LivecallRequestChart from "../../components/LivecallRequestChart";
import CustomerRatingChart from "../../components/CustomerRatingChart";
import { onUpdateCallbackSummary } from "../../features/callback/callbackSlice";
import { onUpdateLivecallSummary } from "../../features/livecall/livecallSlice";
import { onUpdateTicketSummary } from "../../features/ticket/ticketSlice";
import LeaderboardWidget from "../../components/LeaderboardWidget";
import CallbackChartWidget from "../../components/CallbackChartWidget";
import TicketChartWidget from "../../components/TicketChartWidget";
import {
    getSettings,
    updateSettings,
} from "../../features/setting/settingSlice";
import ShareReportDialog from "../../components/ShareReportDialog";
import { Menu } from "primereact/menu";

const ManagementDashboard = () => {
    const menuRef = useRef();
    const [widgetDisplay, setWidgetDisplay] = useState([]);
    const [queryFilter, setQueryFilter] = useState(null);
    const [selectedWidget, setSelectedWidget] = useState(null);
    const [allSummary, setAllSummary] = useState(null);
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({
        start: null,
        end: null,
        format: "xlsx",
        type: "",
    });
    const [selectedReports, setSelectedReports] = useState([
        "livecalls",
        "livechats",
        "callbacks",
        "tickets",
    ]);

    const reportTypes = [
        { name: "Live calls", value: "livecalls" },
        { name: "Live chats", value: "livechats" },
        { name: "Callbacks", value: "callbacks" },
        { name: "Raised Tickets", value: "tickets" },
    ];

    const dispatch = useDispatch();

    const { settings, isLoading } = useSelector((state) => state.setting);

    useEffect(() => {
        dispatch(getProfiles());
        dispatch(getFeedbacks());
        dispatch(getSettings());

        return () => dispatch(clear());
    }, []);

    useEffect(() => {
        let filterSetting = settings.find((item) => item.key == "widgets");

        if (filterSetting) {
            setWidgetDisplay(JSON.parse(filterSetting.value));
        }
    }, [settings]);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        handleGetSummary(data);
        handleGetCbSummary(data);
        handleGetLcSummary(data);
        handleGetTkSummary(data);
        getFeedbackByDate(data);
    };

    const getFeedbackByDate = (payload) => {
        axios
            .get(
                `/api/summary/feedback?from=${payload.start}&to=${payload.end}`
            )
            .then((res) => {
                dispatch(onUpdateFeedbacks(res.data));
            });
    };

    const handleGetSummary = (payload) => {
        if (payload) {
            axios
                .get(`/api/summary?from=${payload.start}&to=${payload.end}`)
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
                    `/api/summary/callback?from=${payload.start}&to=${payload.end}`
                )
                .then((res) => {
                    dispatch(onUpdateCallbackSummary(res.data));
                });
        } else {
            axios.get("/api/summary/callback").then((res) => {
                dispatch(onUpdateCallbackSummary(res.data));
            });
        }
    };

    const handleGetLcSummary = (payload) => {
        if (payload) {
            axios
                .get(
                    `/api/summary/livecall?from=${payload.start}&to=${payload.end}`
                )
                .then((res) => {
                    dispatch(onUpdateLivecallSummary(res.data));
                });
        } else {
            axios.get("/api/summary/livecall").then((res) => {
                dispatch(onUpdateLivecallSummary(res.data));
            });
        }
    };

    const handleGetTkSummary = (payload) => {
        if (payload) {
            axios
                .get(
                    `/api/summary/ticket?from=${payload.start}&to=${payload.end}`
                )
                .then((res) => {
                    dispatch(onUpdateTicketSummary(res.data));
                });
        } else {
            axios.get("/api/summary/ticket").then((res) => {
                dispatch(onUpdateTicketSummary(res.data));
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
                    dispatch(onUpdateTicketSummary(res.data));
                });
            axios
                .get(`/api/summary/livecall?category=${queryFilter}`)
                .then((res) => {
                    dispatch(onUpdateLivecallSummary(res.data));
                });
            axios
                .get(`/api/summary/callback?category=${queryFilter}`)
                .then((res) => {
                    dispatch(onUpdateCallbackSummary(res.data));
                });
        }
    };

    const handleOnRemoveWidget = (widget) => {
        let selectedWidgets = [...widgetDisplay];

        if (selectedWidgets.includes(widget)) {
            selectedWidgets.splice(selectedWidgets.indexOf(widget), 1);
        }
        let data = [
            {
                key: "widgets",
                value: JSON.stringify(selectedWidgets),
            },
        ];
        dispatch(updateSettings(data));
    };

    const handleOnAddWidget = () => {
        let selectedWidgets = [...widgetDisplay];

        if (!selectedWidgets.includes(selectedWidget)) {
            selectedWidgets.push(selectedWidget);
        }
        let data = [
            {
                key: "widgets",
                value: JSON.stringify(selectedWidgets),
            },
        ];
        dispatch(updateSettings(data));
    };

    const TICKETS = [
        {
            label: "Excel",
            value: "xlsx",
            command: () => {
                // let category = "";

                // selectedReports?.map(
                //     (val) => (category = category + `$category[]=${val}`)
                // );
                window.open(
                    `/report/download?format=xlsx&category=${JSON.stringify(
                        selectedReports
                    )}`,
                    "_blank"
                );
            },
        },
        {
            label: "CSV",
            value: "csv",
            command: () => {
                let category = "";

                selectedReports?.map(
                    (val) => (category = category + `$category[]=${val}`)
                );
                window.open(`/report/download?format=csv${category}`, "_blank");
            },
        },
        {
            label: "PDF",
            value: "pdf",
            command: () => {
                let category = "";
                selectedReports?.map(
                    (val) => (category = category + `$category[]=${val}`)
                );
                window.open(`/report/download?format=pdf${category}`, "_blank");
            },
        },
    ];

    return (
        <DrawerContainer>
            <ShareReportDialog
                visible={visible}
                handleOnHide={() => setVisible(false)}
            />
            <div className="tw-w-full tw-max-h-full">
                <div className="tw-mb-5 tw-border tw-rounded tw-bg-white tw-p-4 sm:tw-flex tw-justify-between">
                    <div className="tw-flex tw-gap-3">
                        <Dropdown
                            value={selectedWidget}
                            options={WIDGETS}
                            onChange={(e) => setSelectedWidget(e.value)}
                            showClear
                            optionLabel="name"
                            optionValue="value"
                            placeholder="Select Widget"
                            className="tw-w-full sm:tw-w-80 tw-mb-2 sm:tw-mb-0"
                        />
                        <Button
                            label="Add Widget"
                            onClick={handleOnAddWidget}
                            className="tw-w-full sm:tw-w-fit"
                        />
                    </div>
                    <div className="tw-flex tw-gap-3">
                        <MultiSelect
                            value={selectedReports}
                            placeholder="Select Reports"
                            options={reportTypes}
                            optionLabel="name"
                            onChange={(e) => setSelectedReports(e.value)}
                            className="tw-w-full sm:tw-w-80 tw-mb-2 sm:tw-mb-0"
                        />
                        <Button
                            label="Download"
                            onClick={(e) => menuRef.current?.toggle(e)}
                            className="tw-w-full sm:tw-w-fit"
                        />
                        <Menu model={TICKETS} ref={menuRef} popup />
                    </div>
                    <div className="">
                        <Button
                            label="Share"
                            onClick={(e) => setVisible(true)}
                            className="tw-w-full sm:tw-w-fit"
                        />
                    </div>
                </div>

                <div className="tw-shadow-md tw-rounded-md tw-bg-white tw-p-5 tw-my-5">
                    <div className="md:tw-flex tw-items-center tw-gap-4">
                        <div className="tw-grow tw-grid tw-grid-col md:tw-grid-cols-3 tw-gap-2 tw-mb-4 sm:tw-mb-0">
                            <div className="p-float-label">
                                <Calendar
                                    value={data.start}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            start: e.value.toISOString(),
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
                                            end: e.value.toISOString(),
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
                                    className="tw-flex-grow"
                                />
                                <Button
                                    label="Clear"
                                    onClick={() => {
                                        handleGetSummary();
                                        handleGetCbSummary();
                                        handleGetLcSummary();
                                        handleGetTkSummary();
                                        dispatch(getFeedbacks());
                                        setData({
                                            start: null,
                                            end: null,
                                            format: "xlsx",
                                            type: "",
                                        });
                                    }}
                                    className="p-button-outlined tw-flex-grow"
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
                            Number of Live Call
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

                {isLoading ? (
                    <div className="tw-grid tw-grid-cols-1 tw-gap-2 md:tw-grid-cols-3  tw-mb-5">
                        <Skeleton width="100%" height="20rem" />
                        <Skeleton width="100%" height="20rem" />
                        <Skeleton width="100%" height="20rem" />
                    </div>
                ) : (
                    <div className="tw-grid tw-grid-cols-1 tw-gap-2 md:tw-grid-cols-3  tw-mb-5">
                        {widgetDisplay.length > 0 ? (
                            widgetDisplay.map((item) => {
                                if (item == "livecall") {
                                    return (
                                        <LivecallRequestChart
                                            key={item}
                                            handleOnRemoveWidget={
                                                handleOnRemoveWidget
                                            }
                                        />
                                    );
                                }
                                if (item == "leaderboard") {
                                    return (
                                        <LeaderboardWidget
                                            key={item}
                                            handleOnRemoveWidget={
                                                handleOnRemoveWidget
                                            }
                                        />
                                    );
                                }
                                if (item == "callback") {
                                    return (
                                        <CallbackChartWidget
                                            key={item}
                                            handleOnRemoveWidget={
                                                handleOnRemoveWidget
                                            }
                                        />
                                    );
                                }
                                if (item == "feedback") {
                                    return (
                                        <CustomerRatingChart
                                            key={item}
                                            handleOnRemoveWidget={
                                                handleOnRemoveWidget
                                            }
                                        />
                                    );
                                }
                                if (item == "ticket_raised") {
                                    return (
                                        <TicketChartWidget
                                            key={item}
                                            handleOnRemoveWidget={
                                                handleOnRemoveWidget
                                            }
                                        />
                                    );
                                }
                            })
                        ) : (
                            <>
                                <LivecallRequestChart
                                    handleOnRemoveWidget={handleOnRemoveWidget}
                                />
                                <LeaderboardWidget
                                    handleOnRemoveWidget={handleOnRemoveWidget}
                                />
                                <CustomerRatingChart
                                    handleOnRemoveWidget={handleOnRemoveWidget}
                                />
                                <CallbackChartWidget
                                    handleOnRemoveWidget={handleOnRemoveWidget}
                                />
                                <TicketChartWidget
                                    handleOnRemoveWidget={handleOnRemoveWidget}
                                />
                            </>
                        )}
                    </div>
                )}
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

const WIDGETS = [
    {
        name: "Live Call Widget",
        value: "livecall",
    },
    {
        name: "Leaderboard Widget",
        value: "leaderboard",
    },
    {
        name: "Callback Widget",
        value: "callback",
    },
    {
        name: "Customer Satisfaction Widget",
        value: "feedback",
    },
    {
        name: "Raised Ticket Widget",
        value: "ticket_raised",
    },
];
