import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import Tooltip from "@mui/material/Tooltip";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Column } from "primereact/column";
import Moment from "react-moment";
import {
    getTickets,
    clear,
    getTicketsByPage,
    updateTicket,
    reset,
} from "../../features/ticket/ticketSlice";

import DrawerContainer from "./DrawerContainer";
import { toast } from "react-toastify";

const TicketsTable = () => {
    const [data, setData] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [total, setTotal] = useState();
    const [statuses] = useState([
        { name: "OPEN", value: "open" },
        { name: "PENDING", value: "pending" },
        { name: "CLOSE", value: "close" },
    ]);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        ticket_id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        phone: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        query_type: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    const dispatch = useDispatch();

    const { tickets, isLoading, isSuccess, type, isError, message } =
        useSelector((state) => state.ticket);

    useEffect(() => {
        dispatch(getTickets());

        return () => dispatch(clear());
    }, []);

    useEffect(() => {
        if (tickets) {
            setData(tickets.data);
            setTotal(tickets.total);
        }
    }, [tickets]);

    useEffect(() => {
        if (isSuccess && message) {
            toast.success(message);
        }
        dispatch(reset());
    }, [isLoading, isSuccess, type, isError, message]);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end tw-overflow-auto">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Keyword Search"
                    />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const dateBodyTemplate = (rowData) => {
        return <Moment format="ll">{rowData.created_at}</Moment>;
    };

    const handleDelete = (id) => {};

    const handleCheck = (id) => {};

    const actionBodyTemplate = (row) => {
        return (
            <div className="tw-flex">
                <Tooltip title="Close">
                    <span>
                        <IconButton
                            disabled={row.status == "close"}
                            onClick={() => handleCheck(row.id)}
                        >
                            <CheckIcon
                                color={
                                    row.status == "close"
                                        ? "disabled"
                                        : "success"
                                }
                            />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(row.id)}>
                        <DeleteIcon
                            sx={{
                                color: red[500],
                            }}
                        />
                    </IconButton>
                </Tooltip>
            </div>
        );
    };

    const getSeverity = (value) => {
        switch (value) {
            case "open":
                return "info";

            case "pending":
                return "warning";

            case "close":
                return "success";

            default:
                return null;
        }
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <Tag severity={getSeverity(rowData.status)}>
                <div className="tw-flex tw-items-center tw-gap-2">
                    <span className="tw-text-xs">
                        {rowData.status.toUpperCase()}
                    </span>
                </div>
            </Tag>
        );
    };

    return (
        <DrawerContainer>
            <div className="tw-grow tw-p-5 tw-flex tw-flex-col ">
                <div className="tw-flex tw-justify-between tw-items-center tw-m-5"></div>
                <div className="tw-flex tw-gap-2">
                    <div
                        className={`tw-shadow-md tw-p-6 tw-mb-1 tw-bg-white tw-rounded-md ${
                            selectedTicket
                                ? "tw-hidden sm:tw-block sm:tw-w-1/6 md:tw-w-1/2"
                                : "tw-w-full"
                        }`}
                    >
                        <DataTable
                            value={data}
                            paginator
                            rows={20}
                            totalRecords={total}
                            onPage={({ page }) =>
                                dispatch(getTicketsByPage(page + 1))
                            }
                            tableStyle={{ minWidth: "50rem" }}
                            loading={isLoading}
                            globalFilterFields={[
                                "name",
                                "phone",
                                "email",
                                "ticket_id",
                                "query_type",
                                "status",
                            ]}
                            selectionMode="single"
                            selection={selectedTicket}
                            onSelectionChange={(e) =>
                                setSelectedTicket(e.value)
                            }
                            dataKey="id"
                            filters={filters}
                            header={header}
                            breakpoint="0px"
                        >
                            <Column
                                field="id"
                                header="S/N"
                                style={{ minWidth: "5%" }}
                            ></Column>
                            <Column
                                field="ticket_id"
                                header="Ticket No."
                                style={{ minWidth: "10%" }}
                            ></Column>
                            <Column
                                field="name"
                                header="Full name"
                                style={{ minWidth: "20%" }}
                                sortable
                            ></Column>
                            <Column
                                field="email"
                                header="Email"
                                style={{ minWidth: "15%" }}
                            ></Column>
                            <Column
                                field="phone"
                                header="Phone number"
                                style={{ minWidth: "10%" }}
                            ></Column>
                            <Column
                                field="query_type"
                                header="Query Type"
                                style={{ minWidth: "15%" }}
                                resizeable={true}
                                sortable
                            ></Column>
                            <Column
                                field="status"
                                header="Status"
                                align="center"
                                style={{ minWidth: "10%" }}
                                sortable
                                body={statusBodyTemplate}
                            ></Column>

                            <Column
                                field="created_at"
                                header="Date"
                                style={{ minWidth: "15%" }}
                                body={dateBodyTemplate}
                            ></Column>
                        </DataTable>
                    </div>
                    <div
                        className={
                            selectedTicket
                                ? "tw-w-full sm:tw-w-5/6 md:tw-w-1/2 tw-min-h-full"
                                : "tw-hidden"
                        }
                    >
                        {selectedTicket && (
                            <div className="tw-shadow-md tw-p-4 tw-mb-1 tw-bg-white tw-rounded-md tw-h-full">
                                <div className="tw-float-left tw-mt-3">
                                    <p className="tw-font-semibold tw-mb-1">
                                        {selectedTicket.ticket_id}
                                    </p>
                                </div>
                                <div className="tw-float-right tw-mb-2">
                                    <button
                                        className="tw-p-3 tw-font-semibold tw-bg-slate-400 tw-text-white tw-rounded-full tw-w-12"
                                        onClick={() => setSelectedTicket(null)}
                                    >
                                        <i className="pi pi-times"></i>
                                    </button>
                                </div>
                                <div className="tw-clear-both" />

                                <div className="tw-m-2 ">
                                    <div className="tw-mb-6">
                                        <Dropdown
                                            value={selectedTicket.status}
                                            optionLabel="name"
                                            optionValue="value"
                                            options={statuses}
                                            onChange={(e) => {
                                                setSelectedTicket({
                                                    ...selectedTicket,
                                                    status: e.value,
                                                });

                                                dispatch(
                                                    updateTicket({
                                                        ...selectedTicket,
                                                        status: e.value,
                                                    })
                                                );
                                            }}
                                            className="tw-w-1/2"
                                            placeholder="Select a Status"
                                            itemTemplate={(option) => {
                                                let val = option.value;
                                                return (
                                                    <Tag
                                                        value={val.toUpperCase()}
                                                        severity={getSeverity(
                                                            val
                                                        )}
                                                    ></Tag>
                                                );
                                            }}
                                        />
                                    </div>

                                    <div className="tw-mb-4">
                                        <p className="tw-font-semibold tw-mb-1">
                                            Fullname
                                        </p>
                                        <p>{selectedTicket.name}</p>
                                    </div>

                                    <div className="tw-mb-4">
                                        <p className="tw-font-semibold tw-mb-1">
                                            Email
                                        </p>
                                        <p>{selectedTicket.email}</p>
                                    </div>

                                    <div className="tw-mb-4">
                                        <p className="tw-font-semibold tw-mb-1">
                                            Phone Number
                                        </p>
                                        <p>{selectedTicket.phone}</p>
                                    </div>

                                    <div className="tw-mb-4">
                                        <p className="tw-font-semibold tw-mb-1">
                                            Query Type
                                        </p>
                                        <p>{selectedTicket.query_type}</p>
                                    </div>

                                    <div className="tw-mb-4">
                                        <p className="tw-font-semibold tw-mb-1">
                                            Description
                                        </p>
                                        <p>{selectedTicket.description}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DrawerContainer>
    );
};

export default TicketsTable;
