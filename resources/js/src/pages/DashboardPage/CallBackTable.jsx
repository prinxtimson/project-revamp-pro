import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import Moment from "react-moment";
import {
    getCallbacks,
    clear,
    deleteCallback,
    callbackFailed,
    callbackSuccessful,
    getCallbacksByPage,
    reset,
} from "../../features/callback/callbackSlice";
import DrawerContainer from "./DrawerContainer";
import { toast } from "react-toastify";
import moment from "moment";

const axios = window.axios;

const CallBackTable = () => {
    const [searchCallbacks, setSearchCallbacks] = useState([]);
    const [query, setQuery] = useState("");
    const [statuses] = useState([
        { status: "SUCCESSFUL", label: "Successful" },
        { status: "FAILED", label: "Unsuccessful" },
    ]);
    const [priorities] = useState(["low", "medium", "high"]);
    const [data, setData] = useState({
        format: "xlsx",
        from: "",
        to: "",
    });
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        priority: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const dispatch = useDispatch();

    const { callbacks, isLoading, isSuccess, type, isError, message } =
        useSelector((state) => state.callback);
    const { user } = useSelector((state) => state.auth);

    const handleOnDownload = () => {
        window.location.href = `/callback/report/download?from=${data.from}&to=${data.to}`;
    };

    useEffect(() => {
        dispatch(getCallbacks());

        return () => dispatch(clear());
    }, []);

    useEffect(() => {
        if (callbacks) {
            setSearchCallbacks(callbacks.data);
        }
    }, [callbacks]);

    useEffect(() => {
        if (isSuccess && message) {
            toast.success(message);
        }

        dispatch(reset());
    }, [isLoading, isSuccess, type, isError, message]);

    useEffect(() => {
        if (query) {
            axios
                .get(`/api/callback/search/${query}`)
                .then((res) => {
                    setSearchCallbacks(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            if (callbacks) {
                setSearchCallbacks(callbacks.data);
            }
        }
    }, [query]);

    const handleDelete = (row) => {
        dispatch(deleteCallback(row));
    };

    const handleCheck = (id) => dispatch(callbackSuccessful(id));

    const handleCancel = (id) => dispatch(callbackFailed(id));

    const handleChangePage = (newPage) => {
        dispatch(getCallbacksByPage(newPage + 1));
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Keyword Search"
                    />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const actionBodyTemplate = (row) => {
        return (
            <div className="tw-flex tw-gap-2">
                <Button
                    text
                    icon="pi pi-check"
                    severity="success"
                    rounded
                    onClick={() => handleCheck(row.id)}
                    disabled={Boolean(row.called_at)}
                />
                <Button
                    text
                    icon="pi pi-times"
                    severity="warning"
                    rounded
                    onClick={() => handleCancel(row.id)}
                    disabled={Boolean(row.called_at)}
                />
                <Button
                    text
                    icon="pi pi-trash"
                    severity="danger"
                    rounded
                    onClick={() => handleDelete(row.id)}
                />
            </div>
        );
    };

    const statusBodyTemplate = (row) => {
        if (row.status == "FAILED") {
            return <Tag value="Unsuccessful" severity="danger"></Tag>;
        } else if (row.status == "SUCCESSFUL") {
            return <Tag value="Successful" severity="success"></Tag>;
        } else {
            return <div />;
        }
    };

    const priorityRowFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={priorities}
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="Select one"
                showClear
                //style={{ minWidth: "6rem" }}
            />
        );
    };

    const statusRowFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                optionLabel="label"
                optionValue="status"
                onChange={(e) => options.filterApplyCallback(e.value)}
                itemTemplate={statusBodyTemplate}
                placeholder="Select One"
                className="p-column-filter"
                showClear
                //style={{ minWidth: "6rem" }}
            />
        );
    };

    const dateBodyTemplate = (rowData) => {
        return (
            <div>
                <Moment format="ll">{rowData.created_at}</Moment>
            </div>
        );
    };

    const callbackDateBodyTemplate = (rowData) => {
        return (
            <div>
                {`${moment(rowData.date).format("d/M/Y")}-${rowData.time}`}
            </div>
        );
    };

    return (
        <DrawerContainer>
            <div className="tw-m-5 md:tw-my-8 md:tw-mx-6">
                {user && user?.roles[0].name != "agent" && (
                    <div className="tw-mb-8 tw-p-4 md:tw-p-8 tw-shadow tw-rounded tw-bg-white tw-w-full">
                        <div className="tw-mb-4 ">
                            <h3 className="tw-my-0 tw-font-semibold">
                                Download Callback
                            </h3>
                        </div>
                        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-4 tw-gap-2 tw-items-center">
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
                            <div className="">
                                <Dropdown
                                    options={FORMATS}
                                    value={data.format}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            format: e.value,
                                        })
                                    }
                                    placeholder="Select Format"
                                    optionLabel="label"
                                    className="tw-w-full"
                                />
                            </div>
                            <div className="">
                                <Button
                                    label="Generate"
                                    onClick={handleOnDownload}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="tw-w-full tw-rounded tw-shadow">
                    <DataTable
                        value={searchCallbacks}
                        paginator
                        rows={20}
                        totalRecords={callbacks?.total || 0}
                        onPage={({ page }) => handleChangePage(page)}
                        tableStyle={{ minWidth: "40rem" }}
                        loading={isLoading}
                        dataKey="id"
                        header={header}
                        emptyMessage="No data found"
                        breakpoint="0px"
                        stripedRows
                        filters={filters}
                        globalFilterFields={["name", "status"]}
                        filterDisplay="row"
                    >
                        <Column field="id" header="ID"></Column>
                        <Column
                            field="name"
                            header="Requester"
                            filter
                            filterPlaceholder="Search by name"
                            showFilterMenu={false}
                            style={{ minWidth: "10rem" }}
                        ></Column>

                        <Column field="phone" header="Phone number"></Column>

                        <Column
                            field="priority"
                            header="Priority"
                            filter
                            filterElement={priorityRowFilterTemplate}
                            showFilterMenu={false}
                            showClearButton={false}
                        ></Column>
                        <Column
                            field="status"
                            header="Status"
                            filter
                            align="center"
                            body={statusBodyTemplate}
                            filterElement={statusRowFilterTemplate}
                            showFilterMenu={false}
                            showClearButton={false}
                        ></Column>
                        <Column
                            field="date"
                            header="Date requested"
                            body={dateBodyTemplate}
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            field="time"
                            header="Callback date/time"
                            body={callbackDateBodyTemplate}
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

export default CallBackTable;

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
