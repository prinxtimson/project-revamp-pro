import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import {
    deleteLivecall,
    answerLivecall,
    onSetLivecalls,
    getConnectedLivecalls,
    getLivecalls,
    getLivecallsByPage,
    reset,
    clear,
} from "../../features/livecall/livecallSlice";
import Moment from "react-moment";
import DrawerContainer from "./DrawerContainer";
import { toast } from "react-toastify";

const LiveCallTable = () => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [livecallSummary, setLivecallSummary] = useState({
        total_livecalls: 0,
        total_answered: 0,
        total_left: 0,
    });
    const [queryType, setQueryType] = useState("");
    const [queryFilter, setQueryFilter] = useState("all");
    const [formData, setFormData] = useState({
        from: "",
        to: "",
        type: "",
    });
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        query_type: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        priority: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const { livecalls, isLoading, isSuccess, type, isError, message } =
        useSelector((state) => state.livecall);
    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {
        window.axios
            .get("/api/livecall/summary/get")
            .then((res) => {
                setLivecallSummary(res.data);
            })
            .catch((err) => {
                console.log(err.response);
            });
        if (livecalls) {
            setData(livecalls.data);
            setTotal(livecalls.total);
        }
    }, [livecalls]);

    useEffect(() => {
        if (queryType)
            window.history.replaceState(null, "", `?query_type="${queryType}"`);
        else window.history.replaceState(null, "", "/admin/dashboard/livecall");
    }, [queryType]);

    const handleDelete = (id) => dispatch(deleteLivecall(id));

    const handleConnect = (id) => {
        dispatch(answerLivecall(id));
    };

    const handleOnDownload = () => {
        window.location.href = `/livecall/report/download?from=${formData.from}&to=${formData.to}`;
    };

    const handleChangePage = ({ page }) => {
        dispatch(getLivecallsByPage(page + 1));
    };

    const onFilterSelect = (e) => {
        setQueryFilter(e.target.value);
        if (e.target.value === "waiting") {
            dispatch(getConnectedLivecalls());
        } else {
            dispatch(getLivecalls());
        }
    };

    const handleOnSelectChange = (text) => {
        if (text) {
            setQueryType(text);

            window.axios
                .get(`/api/livecall/search/${text}`)
                .then((res) => {
                    dispatch(onSetLivecalls(res.data));
                })
                .catch((err) => {
                    console.log(err.response);
                });
        } else {
            setQueryType("");

            window.axios
                .get(`/api/livecall`)
                .then((res) => {
                    dispatch(onSetLivecalls(res.data));
                })
                .catch((err) => {
                    console.log(err.response);
                });
        }
    };

    useEffect(() => {
        if (isSuccess && message) {
            toast.success(message);
        }

        dispatch(reset());
    }, [isLoading, isSuccess, type, isError, message]);

    const renderHeader = () => {
        return (
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-items-center">
                <div className="">
                    <h2 className="tw-my-2">Filter Queries</h2>
                    <div className="tw-flex tw-gap-4">
                        <div className="tw-flex tw-items-center">
                            <RadioButton
                                name="filter"
                                value="all"
                                onChange={onFilterSelect}
                                checked={queryFilter == "all"}
                            />
                            <label htmlFor="filter" className="tw-ml-2">
                                All Tickets
                            </label>
                        </div>
                        <div className="tw-flex tw-items-center">
                            <RadioButton
                                name="filter"
                                value="waiting"
                                onChange={onFilterSelect}
                                checked={queryFilter == "waiting"}
                            />
                            <label htmlFor="filter" className="tw-ml-2">
                                Waiting Tickets
                            </label>
                        </div>
                    </div>
                </div>
                <div className="">
                    <Dropdown
                        value={queryType}
                        options={QUERYTPES}
                        onChange={(e) => handleOnSelectChange(e.target.value)}
                        placeholder="Select query type"
                        showClear
                        className="tw-w-full"
                    />
                </div>
            </div>
        );
    };

    const header = renderHeader();

    const durationBodyTemplate = (row) => (
        <div className="">
            {row.answered_at || row.left_at ? (
                <Moment from={row.created_at} ago>
                    {row.answered_at || row.left_at}
                </Moment>
            ) : (
                <Moment fromNow ago>
                    {row.created_at}
                </Moment>
            )}
        </div>
    );

    const statusBodyTemplate = (row) => (
        <div className="">
            {row.answered_at && row.ended_at ? (
                <Tag value="ANSWERED" severity="success" />
            ) : row.answered_at && !row.ended_at ? (
                <Tag value="ONGOING" severity="info" />
            ) : row.left_at ? (
                <Tag value="LEFT" severity="danger" />
            ) : (
                <Tag value="WAITING" severity="warning" />
            )}
        </div>
    );

    const actionBodyTemplate = (row) => (
        <div className="tw-flex tw-gap-4">
            <Button
                label="Connect"
                severity="success"
                onClick={() => handleConnect(row.id)}
                disabled={
                    Boolean(row.answered_at) ||
                    Boolean(row.left_at) ||
                    Boolean(isLoading && type === "livecall/answer/pending")
                }
            />

            <Button
                severity="danger"
                label="Delete"
                onClick={() => handleDelete(row.id)}
                disabled={Boolean(
                    isLoading && type === "livecall/answer/pending"
                )}
            />
        </div>
    );

    const dateBodyTemplate = (rowData) => {
        return (
            <div>
                <Moment format="ll">{rowData.created_at}</Moment>
            </div>
        );
    };

    return (
        <DrawerContainer>
            <div className="tw-m-5 md:tw-my-8 md:tw-mx-6">
                <div className=" tw-py-4 md:tw-py-8 tw-w-full ">
                    <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-3">
                        <div className="tw-bg-white tw-p-2 tw-rounded tw-shadow">
                            <p className="tw-my-2 tw-text-center">
                                Total Live Calls
                            </p>
                            <h2 className="tw-my-0 tw-text-2xl tw-text-center tw-font-semibold">
                                {livecallSummary.total_livecalls}
                            </h2>
                        </div>
                        <div className="tw-bg-white tw-p-2 tw-rounded tw-shadow">
                            <p className="tw-my-2 tw-text-center">
                                Answered Live Calls
                            </p>
                            <h2 className="tw-my-0 tw-text-2xl tw-text-center tw-font-semibold">
                                {livecallSummary.total_answered}
                            </h2>
                        </div>
                        <div className="tw-bg-white tw-p-2 tw-rounded tw-shadow">
                            <p className="tw-my-2 tw-text-center">
                                Abandoned Live Calls
                            </p>
                            <h2 className="tw-my-0 tw-text-2xl tw-text-center tw-font-semibold">
                                {livecallSummary.total_left}
                            </h2>
                        </div>
                    </div>
                </div>

                {user && user?.roles[0].name != "agent" && (
                    <div className="tw-mb-8 tw-p-3 md:tw-p-6 tw-shadow tw-rounded tw-bg-white tw-w-full">
                        <div className="tw-mb-4 ">
                            <h3 className="tw-my-0 tw-font-semibold">
                                Download Report
                            </h3>
                        </div>

                        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-4 tw-gap-2 tw-items-center">
                            <div className="">
                                <Calendar
                                    name="from"
                                    value={formData.from}
                                    placeholder="From"
                                    className="tw-w-full"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            from: e.value,
                                        })
                                    }
                                    maxDate={formData.to}
                                    showButtonBar
                                    showIcon
                                />
                            </div>
                            <div className="">
                                <Calendar
                                    name="to"
                                    value={formData.to}
                                    placeholder="To"
                                    className="tw-w-full"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            to: e.value,
                                        })
                                    }
                                    minDate={formData.from}
                                    showButtonBar
                                    showIcon
                                />
                            </div>
                            <div className="">
                                <Dropdown
                                    options={FORMATS}
                                    value={data.type}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            type: e.value,
                                        })
                                    }
                                    placeholder="Select Format"
                                    optionLabel="label"
                                    className="tw-w-full"
                                />
                            </div>
                            <div className="">
                                <Button
                                    label="Download"
                                    onClick={handleOnDownload}
                                    disabled={
                                        !formData.from ||
                                        !formData.to ||
                                        !formData.type
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="tw-w-full tw-rounded tw-shadow tw-bg-white">
                    <DataTable
                        value={data}
                        paginator
                        rows={20}
                        totalRecords={total}
                        onPage={handleChangePage}
                        tableStyle={{ minWidth: "50rem" }}
                        loading={isLoading}
                        dataKey="id"
                        header={header}
                        emptyMessage="No data found"
                        breakpoint="0px"
                        stripedRows
                        filters={filters}
                    >
                        <Column field="id" header="ID"></Column>
                        <Column
                            field="query_type"
                            header="Query Type"
                            style={{ minWidth: "10rem" }}
                        ></Column>

                        <Column
                            header="Wait Duration"
                            body={durationBodyTemplate}
                        ></Column>
                        <Column
                            header="Status"
                            align="center"
                            body={statusBodyTemplate}
                        ></Column>
                        <Column
                            field="date"
                            header="Date requested"
                            body={dateBodyTemplate}
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            header="Actions"
                            align="center"
                            body={actionBodyTemplate}
                        ></Column>
                    </DataTable>
                </div>
            </div>
        </DrawerContainer>
    );
};

export default LiveCallTable;

const FORMATS = [
    {
        label: "Excel",
        value: "xlsx",
    },
    {
        label: "CSV",
        value: "csv",
    },
    {
        label: "PDF",
        value: "pdf",
    },
];

const QUERYTPES = [
    "Mentor Request",
    "Second Project Request",
    "Referencing",
    "Developer Request",
    "Taster Session",
    "Enquiry",
    "New Candidate Support",
    "Software issues",
    "LMS queries",
    "Access issue",
    "Other IT issues",
];
