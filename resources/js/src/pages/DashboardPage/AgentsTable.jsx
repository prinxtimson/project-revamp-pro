import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Column } from "primereact/column";
import DrawerContainer from "./DrawerContainer";
import {
    getAgents,
    enableUser,
    disableUser,
    deleteUser,
    getAgentsByPage,
    clear,
    reset,
} from "../../features/profile/profileSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AddUser from "../../components/AddUser";

const axios = window.axios;

const AgentsTable = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [query, setQuery] = useState("");
    const [data, setData] = useState([]);
    const [total, setTotal] = useState();
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        event_title: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        phone: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { users, isLoading, isSuccess, type, isError, message } = useSelector(
        (state) => state.profile
    );

    useEffect(() => {
        dispatch(getAgents());

        return () => dispatch(clear());
    }, []);

    const handleGetUsers = () => {
        dispatch(getAgents());
    };

    useEffect(() => {
        if (users) {
            setData(users.data);
            setTotal(data.total);
        }
    }, [users, isSuccess]);

    useEffect(() => {
        if (isSuccess && message) {
            toast.success(message);
        }

        dispatch(reset());
    }, [isLoading, isSuccess, type, isError, message]);

    useEffect(() => {
        if (query) {
            axios
                .get(`/api/users/search/${query}`)
                .then((res) => {
                    setData(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            if (users) {
                setData(users.data);
            }
        }
    }, [query]);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="sm:tw-flex tw-gap-2 tw-justify-between tw-items-center">
                <span className="p-input-icon-left tw-w-full sm:tw-w-80 tw-mb-2 sm:tw-mb-0">
                    <i className="pi pi-search" />
                    <Dropdown
                        value={globalFilterValue}
                        options={data}
                        onChange={onGlobalFilterChange}
                        optionLabel="name"
                        optionValue="name"
                        filter
                        showClear
                        filterBy="name"
                        placeholder="Search Agent"
                        className="tw-w-full"
                    />
                </span>
                <Button
                    type="button"
                    onClick={() => setOpenDialog(true)}
                    label="Add Agent"
                    className="p-button-outlined tw-w-full sm:tw-w-fit"
                />
            </div>
        );
    };

    const header = renderHeader();

    const roleBodyTemplate = (rowData) => {
        return (
            <div className="tw-text-base">
                {rowData.roles[0].name.replace("-", " ")}
            </div>
        );
    };

    const handleDelete = (row) => dispatch(deleteUser(row));

    const handleDisable = (row) => dispatch(disableUser(row));

    const handleEnable = (row) => dispatch(enableUser(row));

    return (
        <DrawerContainer>
            <div className="tw-w-full tw-h-full tw-p-5 tw-flex tw-flex-col ">
                <div className="tw-shadow tw-rounded">
                    <DataTable
                        value={data}
                        paginator
                        rows={20}
                        totalRecords={total}
                        loading={
                            isLoading &&
                            type == "profile/get-all-agents/pending"
                        }
                        dataKey="id"
                        filters={filters}
                        header={header}
                        onPage={({ page }) =>
                            dispatch(getAgentsByPage(page + 1))
                        }
                        responsiveLayout="scroll"
                        selectionMode="single"
                        onSelectionChange={(e) =>
                            navigate(`/admin/dashboard/agent/${e.value.id}`)
                        }
                        breakpoint="0px"
                    >
                        <Column field="id" header="ID"></Column>
                        <Column
                            field="name"
                            header="Full name"
                            style={{ width: "20%" }}
                        ></Column>
                        <Column
                            field="username"
                            header="Username"
                            style={{ width: "15%" }}
                        ></Column>
                        <Column
                            field="email"
                            header="Email"
                            style={{ width: "15%" }}
                        ></Column>
                        <Column
                            field="role"
                            header="Role"
                            body={roleBodyTemplate}
                        ></Column>
                    </DataTable>
                </div>

                <AddUser
                    open={openDialog}
                    title="Add Agent"
                    user_type="agent"
                    handleOnHide={() => setOpenDialog(false)}
                    handleOnSuccess={handleGetUsers}
                />
            </div>
        </DrawerContainer>
    );
};

export default AgentsTable;
