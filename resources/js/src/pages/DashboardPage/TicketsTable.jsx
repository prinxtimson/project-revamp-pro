import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Avatar } from "primereact/avatar";
import { InputTextarea } from "primereact/inputtextarea";
import { Tag } from "primereact/tag";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Moment from "react-moment";
import {
    getTickets,
    clear,
    addComment,
    clearTicket,
    updateTicket,
    reset,
    getTicketById,
    deleteTicket,
} from "../../features/ticket/ticketSlice";

import DrawerContainer from "./DrawerContainer";
import { toast } from "react-toastify";
import moment from "moment";

const TicketsTable = () => {
    const [data, setData] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [total, setTotal] = useState(0);
    const [comment, setComment] = useState("");
    const [statuses] = useState([
        { name: "Open", value: "open" },
        { name: "In Progress", value: "pending" },
        { name: "Resolved", value: "close" },
    ]);
    const [priorities] = useState(["low", "medium", "high"]);
    const [subjects] = useState([
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
    ]);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        ticket_id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        phone: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        query_type: { value: null, matchMode: FilterMatchMode.EQUALS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        priority: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const dispatch = useDispatch();

    const { tickets, ticket, isLoading, isSuccess, type, isError, message } =
        useSelector((state) => state.ticket);

    useEffect(() => {
        dispatch(getTickets());

        return () => dispatch(clear());
    }, []);

    useEffect(() => {
        if (tickets) {
            setData(tickets);
            setTotal(tickets.length);
        }
    }, [tickets]);

    useEffect(() => {
        if (isSuccess && message) {
            toast.success(message);
            setComment("");
        }
        dispatch(reset());
    }, [isLoading, isSuccess, type, isError, message]);

    useEffect(() => {
        if (selectedTicket) {
            dispatch(getTicketById(selectedTicket));
        } else {
            dispatch(clearTicket());
        }
    }, [selectedTicket]);

    const dateBodyTemplate = (rowData) => {
        return <Moment format="ll">{rowData.created_at}</Moment>;
    };

    const handleDelete = (row) => {
        if (
            window.confirm(
                `You are about to delete ticket with ticket ID ${row.ticket_id}, this can not be undone`
            )
        ) {
            dispatch(deleteTicket(row.id));
        }
    };

    const handleCheck = (row) => {
        dispatch(updateTicket({ ...row, status: "close" }));
    };

    const actionBodyTemplate = (row) => {
        return (
            <div className="tw-flex tw-gap-4">
                <Button
                    text
                    icon="pi pi-times"
                    severity="success"
                    rounded
                    onClick={() => handleCheck(row)}
                    disabled={Boolean(row.status == "close")}
                    tooltip="Resolved ticket"
                />
                {/* <Button
                    text
                    icon="pi pi-trash"
                    severity="danger"
                    rounded
                    onClick={() => handleDelete(row)}
                /> */}
            </div>
        );
    };

    const getSeverity = (value) => {
        switch (value) {
            case "open":
                return "danger";

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
            <Tag severity={getSeverity(rowData.status || rowData.value)}>
                <div className="tw-flex tw-items-center tw-gap-2">
                    <span className="tw-text-xs">
                        {rowData.status ? (
                            <span>
                                {rowData.status == "open"
                                    ? rowData.status?.toUpperCase()
                                    : rowData.status == "pending"
                                    ? "In Progress"
                                    : "Resolved"}
                            </span>
                        ) : (
                            rowData.name
                        )}
                    </span>
                </div>
            </Tag>
        );
    };

    const statusRowFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                optionLabel="name"
                onChange={(e) => options.filterApplyCallback(e.value)}
                itemTemplate={statusBodyTemplate}
                placeholder="Select One"
                showClear
                style={{ minWidth: "8rem" }}
            />
        );
    };

    const subjectRowFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={subjects}
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="Select one"
                showClear
                style={{ minWidth: "6rem" }}
            />
        );
    };

    const priorityRowFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={priorities}
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="Select one"
                showClear
                style={{ minWidth: "6rem" }}
            />
        );
    };

    const handleAddComment = () => {
        dispatch(addComment({ comment, ticket_id: selectedTicket }));
    };

    const userBodyTemplate = (rowData) =>
        rowData.user ? (
            <div className="tw-flex tw-items-center tw-gap-2">
                <Avatar image={rowData.user?.avatar} shape="circle" />{" "}
                <span>{rowData.user?.name.split(" ")[0]}</span>
            </div>
        ) : (
            <div />
        );

    return (
        <DrawerContainer>
            <div className="tw-grow tw-p-5 tw-flex tw-flex-col ">
                <div className=" tw-py-4 md:tw-py-8 tw-w-full ">
                    <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-3">
                        <div className="tw-bg-white tw-p-2 tw-rounded tw-shadow">
                            <p className="tw-my-2 tw-text-center">
                                Raised Tickets
                            </p>
                            <h2 className="tw-my-0 tw-text-2xl tw-text-center tw-font-semibold">
                                {tickets?.length}
                            </h2>
                        </div>
                        <div className="tw-bg-white tw-p-2 tw-rounded tw-shadow">
                            <p className="tw-my-2 tw-text-center">
                                Closed Tickets
                            </p>
                            <h2 className="tw-my-0 tw-text-2xl tw-text-center tw-font-semibold">
                                {
                                    tickets?.filter(
                                        (item) => item.status == "close"
                                    ).length
                                }
                            </h2>
                        </div>
                        <div className="tw-bg-white tw-p-2 tw-rounded tw-shadow">
                            <p className="tw-my-2 tw-text-center">
                                Pending Tickets
                            </p>
                            <h2 className="tw-my-0 tw-text-2xl tw-text-center tw-font-semibold">
                                {
                                    tickets?.filter(
                                        (item) => item.status == "pending"
                                    ).length
                                }
                            </h2>
                        </div>
                        <div className="tw-bg-white tw-p-2 tw-rounded tw-shadow">
                            <p className="tw-my-2 tw-text-center">
                                Open Tickets
                            </p>
                            <h2 className="tw-my-0 tw-text-2xl tw-text-center tw-font-semibold">
                                {
                                    tickets?.filter(
                                        (item) => item.status == "open"
                                    ).length
                                }
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="tw-flex tw-justify-between tw-items-center tw-m-5"></div>
                <div className="tw-flex tw-gap-2">
                    <div
                        className={`tw-shadow-md tw-mb-1 tw-bg-white tw-rounded-md ${
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
                            // onPage={({ page }) =>
                            //     dispatch(getTicketsByPage(page + 1))
                            // }
                            //tableStyle={{ minWidth: "50rem" }}
                            loading={isLoading}
                            globalFilterFields={[
                                "name",
                                "phone",
                                "email",
                                "ticket_id",
                                "query_type",
                                "status",
                                "priority",
                            ]}
                            selectionMode="single"
                            selection={selectedTicket}
                            onSelectionChange={(e) =>
                                setSelectedTicket(e.value.id)
                            }
                            dataKey="id"
                            filters={filters}
                            breakpoint="0px"
                            filterDisplay="row"
                        >
                            <Column
                                field="ticket_id"
                                header="ID."
                                style={{ minWidth: "8rem" }}
                            ></Column>
                            <Column
                                field="name"
                                header="Requester"
                                style={{ minWidth: "10rem" }}
                                filter
                                filterPlaceholder="Search by name"
                                showFilterMenu={false}
                            ></Column>
                            <Column
                                field="query_type"
                                header="Subject"
                                align="center"
                                style={{ minWidth: "6rem" }}
                                resizeable={true}
                                filter
                                filterElement={subjectRowFilterTemplate}
                                showFilterMenu={false}
                                showClearButton={false}
                            ></Column>
                            <Column
                                field="user"
                                header="Assignee"
                                body={userBodyTemplate}
                            ></Column>
                            <Column
                                field="priority"
                                header="Priority"
                                style={{ minWidth: "6rem" }}
                                filter
                                filterElement={priorityRowFilterTemplate}
                                showFilterMenu={false}
                                showClearButton={false}
                            ></Column>
                            <Column
                                field="status"
                                header="Status"
                                align="center"
                                style={{ minWidth: "8rem" }}
                                filter
                                body={statusBodyTemplate}
                                filterElement={statusRowFilterTemplate}
                                showFilterMenu={false}
                                showClearButton={false}
                            ></Column>
                            <Column
                                field="created_at"
                                header="Date Created"
                                style={{ minWidth: "8rem" }}
                                body={dateBodyTemplate}
                            ></Column>
                            <Column
                                header="Action"
                                align="center"
                                body={actionBodyTemplate}
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
                        {ticket && (
                            <div className="tw-shadow-md tw-p-4 tw-mb-1 tw-bg-white tw-rounded-md tw-h-full">
                                <div className="tw-float-left tw-mt-3">
                                    <p className="tw-font-semibold tw-mb-1">
                                        {ticket.ticket_id}
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

                                <div className="tw-m-2 tw-flex tw-flex-col tw-gap-4">
                                    <div>
                                        <Dropdown
                                            value={ticket.priority}
                                            options={priorities}
                                            onChange={(e) => {
                                                dispatch(
                                                    updateTicket({
                                                        ...ticket,
                                                        priority: e.value,
                                                    })
                                                );
                                            }}
                                            className="tw-w-1/2"
                                            placeholder="Select a Priority"
                                        />
                                    </div>
                                    <div className="">
                                        <p className="tw-font-semibold tw-mb-1">
                                            Full Name
                                        </p>
                                        <p className="tw-my-1">{ticket.name}</p>
                                    </div>

                                    <div className="">
                                        <p className="tw-font-semibold tw-mb-1">
                                            Email
                                        </p>
                                        <p className="tw-my-1">
                                            {ticket.email}
                                        </p>
                                    </div>

                                    <div className="">
                                        <p className="tw-font-semibold tw-mb-1">
                                            Phone Number
                                        </p>
                                        <p className="tw-my-1">
                                            {ticket.phone}
                                        </p>
                                    </div>

                                    <div className="">
                                        <p className="tw-font-semibold tw-mb-1">
                                            Subject
                                        </p>
                                        <p className="tw-my-1">
                                            {ticket.query_type}
                                        </p>
                                    </div>

                                    <div className="">
                                        <p className="tw-font-semibold tw-mb-1">
                                            Description
                                        </p>
                                        <p className="tw-my-1">
                                            {ticket.description}
                                        </p>
                                    </div>
                                    <div className="tw-grow">
                                        <div className="tw-ml-4 tw-mb-4">
                                            <h3 className="tw-my-2 tw-text-semibold">
                                                Comments
                                            </h3>
                                            <div className="tw-flex tw-flex-col tw-gap-4">
                                                {ticket.ticket_comments.map(
                                                    (val) => (
                                                        <div
                                                            className="tw-flex tw-gap-2 tw-border"
                                                            key={val.id}
                                                        >
                                                            <div className="">
                                                                <Avatar
                                                                    shape="circle"
                                                                    imageAlt={
                                                                        val.user
                                                                            ?.name
                                                                    }
                                                                    image={
                                                                        val.user
                                                                            ?.avatar
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="tw-grow tw-flex tw-flex-col tw-gap-1">
                                                                <div className="tw-flex tw-gap-3">
                                                                    <h4 className="tw-my-0 tw-font-semibold">
                                                                        {
                                                                            val
                                                                                .user
                                                                                ?.name
                                                                        }
                                                                    </h4>
                                                                    <small>
                                                                        {moment(
                                                                            val.created_at
                                                                        ).fromNow()}
                                                                    </small>
                                                                </div>

                                                                <p className="tw-my-0">
                                                                    {
                                                                        val.comment
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div className="tw-ml-4">
                                            <div className="tw-flex tw-gap-2">
                                                <div className="tw-grow">
                                                    <InputTextarea
                                                        value={comment}
                                                        onChange={(e) =>
                                                            setComment(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter your text here...."
                                                        className="tw-w-full"
                                                    />
                                                </div>
                                                <div className="tw-flex tw-gap-2 tw-items-center">
                                                    <Button
                                                        label="Send"
                                                        severity="success"
                                                        className="tw-w-fit"
                                                        onClick={
                                                            handleAddComment
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <Dropdown
                                            value={ticket.status}
                                            optionLabel="name"
                                            optionValue="value"
                                            options={statuses}
                                            onChange={(e) => {
                                                // setSelectedTicket({
                                                //     ...selectedTicket,
                                                //     status: e.value,
                                                // });

                                                dispatch(
                                                    updateTicket({
                                                        ...ticket,
                                                        status: e.value,
                                                    })
                                                );
                                            }}
                                            className="tw-w tw-items-self-end"
                                            placeholder="Select a Status"
                                            itemTemplate={(option) => {
                                                let val = option.value;
                                                return (
                                                    <Tag
                                                        value={option.name.toUpperCase()}
                                                        severity={getSeverity(
                                                            val
                                                        )}
                                                    ></Tag>
                                                );
                                            }}
                                        />
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
