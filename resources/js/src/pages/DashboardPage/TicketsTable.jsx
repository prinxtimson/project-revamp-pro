import { useEffect, useState } from "react";
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
import { connect } from "react-redux";
import {
    getTickets,
    clearTicket,
    getTicketsByPageNo,
    updateTicket,
} from "../../actions/ticket";

import DrawerContainer from "./DrawerContainer";

const TicketsTable = ({
    loading,
    tickets,
    getTickets,
    clearTicket,
    updateTicket,
    getTicketsByPageNo,
}) => {
    const [data, setData] = useState([]);
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

    useEffect(() => {
        getTickets();
    }, []);

    useEffect(() => {
        if (tickets) {
            setData(tickets.data);
            setTotal(tickets.total);
        }
    }, [tickets]);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
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
            <Tag
                severity={getSeverity(rowData.status)}
                style={{ cursor: "pointer" }}
            >
                <div className="tw-flex tw-items-center tw-gap-2">
                    <span className="tw-text-xs">
                        {rowData.status.toUpperCase()}
                    </span>
                    <i className="pi pi-angle-down tw-text-xs"></i>
                </div>
            </Tag>
        );
    };

    const statusEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                autoFocus
                size={10}
                optionLabel="name"
                optionValue="value"
                options={statuses}
                onChange={(e) => {
                    options.editorCallback(e.value);
                    let newData = { ...options.rowData, status: e.value };
                    updateTicket(newData.id, newData);
                }}
                placeholder="Select a Status"
                itemTemplate={(option) => {
                    let val = option.value;
                    return (
                        <Tag
                            value={val.toUpperCase()}
                            severity={getSeverity(val)}
                        ></Tag>
                    );
                }}
            />
        );
    };

    const handleUpdateTicket = (e) => {
        let { newRowData, rowIndex, originalEvent: event } = e;

        let _data = data;
        _data[rowIndex] = newRowData;
        setData(_data);
    };

    return (
        <DrawerContainer>
            <div className="tw-grow tw-p-5 tw-flex tw-flex-col ">
                <div className="tw-flex tw-justify-between tw-items-center tw-m-5"></div>
                <div className="">
                    <div className="tw-shadow-md tw-p-6 tw-mb-1 tw-bg-white tw-rounded-md">
                        <DataTable
                            value={data}
                            paginator
                            rows={20}
                            totalRecords={total}
                            onPage={({ page }) => getTicketsByPageNo(page + 1)}
                            //rowsPerPageOptions={[25]}
                            tableStyle={{ minWidth: "50rem" }}
                            loading={loading}
                            globalFilterFields={[
                                "name",
                                "phone",
                                "email",
                                "ticket_id",
                                "query_type",
                                "status",
                            ]}
                            dataKey="id"
                            filters={filters}
                            header={header}
                            editMode="cell"
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
                                header="Event"
                                style={{ minWidth: "15%" }}
                                sortable
                            ></Column>
                            <Column
                                field="status"
                                header="Status"
                                style={{ minWidth: "10%" }}
                                sortable
                                body={statusBodyTemplate}
                                editor={statusEditor}
                                onCellEditComplete={handleUpdateTicket}
                            ></Column>

                            <Column
                                field="created_at"
                                header="Date"
                                style={{ minWidth: "15%" }}
                                body={dateBodyTemplate}
                            ></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </DrawerContainer>
    );
};

const mapStateToProps = (state) => ({
    loading: state.ticket.loading,
    message: state.ticket.message,
    tickets: state.ticket.tickets,
});

export default connect(mapStateToProps, {
    getTickets,
    clearTicket,
    getTicketsByPageNo,
    updateTicket,
})(TicketsTable);
