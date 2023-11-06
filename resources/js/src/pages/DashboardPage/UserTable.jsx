import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Column } from "primereact/column";

import DrawerContainer from "./DrawerContainer";
import {
    getProfiles,
    getProfilesByPage,
    clear,
    reset,
} from "../../features/profile/profileSlice";
import AddUser from "../../components/AddUser";

const UserTable = () => {
    const [openDialog, setOpenDialog] = useState(false);
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

    const { users, isLoading, isSuccess, type, isError, message } = useSelector(
        (state) => state.profile
    );

    useEffect(() => {
        dispatch(getProfiles());

        return () => dispatch(clear());
    }, []);

    useEffect(() => {
        if (users) {
            setData(users.data);
            setTotal(data.total);
        }
    }, [users, isSuccess]);

    useEffect(() => {
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
            <div className="tw-flex tw-justify-between tw-items-center">
                <span className="p-input-icon-left tw-w-80">
                    <Dropdown
                        value={globalFilterValue}
                        options={data}
                        onChange={onGlobalFilterChange}
                        optionLabel="name"
                        optionValue="name"
                        filter
                        showClear
                        filterBy="name"
                        placeholder="Search User"
                        className="tw-w-full"
                    />
                </span>

                <Button
                    type="button"
                    onClick={() => setOpenDialog(true)}
                    label="Add User"
                    className="p-button-outlined"
                />
            </div>
        );
    };

    const header = renderHeader();

    const roleBodyTemplate = (rowData) => {
        return (
            <div className="tw-text-base ">
                {rowData.roles[0].name.replace("-", " ")}
            </div>
        );
    };

    return (
        <DrawerContainer>
            <div className="tw-w-full tw-h-full tw-p-5 tw-flex tw-flex-col">
                <div className="tw-shadow tw-rounded tw-w-full">
                    <DataTable
                        value={data}
                        paginator
                        rows={20}
                        totalRecords={total}
                        loading={isLoading && type == "profile/get-all/pending"}
                        dataKey="id"
                        filters={filters}
                        header={header}
                        onPage={({ page }) =>
                            dispatch(getProfilesByPage(page + 1))
                        }
                        breakpoint="0px"
                    >
                        <Column field="id"></Column>
                        <Column
                            field="name"
                            header="Full name"
                            style={{ width: "20%" }}
                        ></Column>
                        <Column
                            field="username"
                            header="Username"
                            style={{ width: "10%" }}
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
                    title="Add User"
                    handleOnSuccess={() => dispatch(getProfiles())}
                    handleOnHide={() => setOpenDialog(false)}
                />
            </div>
        </DrawerContainer>
    );
};

export default UserTable;
