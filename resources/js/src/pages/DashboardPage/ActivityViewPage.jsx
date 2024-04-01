import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DashboardContainer from "../../components/DashboardContainer";
import { getActivities, clear } from "../../features/activity/activitySlice";
import moment from "moment";

const ActivityViewPage = () => {
    const dispatch = useDispatch();

    const { activities, isLoading, isSuccess } = useSelector(
        (state) => state.activity
    );
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getActivities());

        return () => dispatch(clear());
    }, []);

    const dateBodyTemplate = (rowData) => {
        return moment(rowData.created_at).format("lll");
    };

    const typeBodyTemplate = (rowData) => {
        return (
            <p className="tw-my-0">
                <span className="tw-font-semibold">{`${
                    rowData.user?.id == user.id ? "You" : rowData.user?.name
                }`}</span>
                {` ${rowData.type}`}
            </p>
        );
    };

    return (
        <DashboardContainer>
            <div className="tw-p-4 tw-h-full">
                <div className=" tw-flex tw-justify-center">
                    <div className="tw-bg-white tw-shadow-md tw-p-4">
                        <div className="">
                            <DataTable
                                value={activities}
                                paginator
                                rows={20}
                                totalRecords={activities.length}
                                breakpoint="0px"
                                tableStyle={{ minWidth: "50rem" }}
                                // onPage={({ page }) =>
                                //     dispatch(getTicketsByPage(page + 1))
                                // }
                                dataKey="id"
                                stripedRows
                                // header={header}
                                loading={isLoading}
                            >
                                <Column field="id" header="#" sortable></Column>
                                <Column
                                    field="created_at"
                                    header="Date"
                                    body={dateBodyTemplate}
                                ></Column>
                                <Column
                                    field="type"
                                    header="Activity"
                                    body={typeBodyTemplate}
                                ></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardContainer>
    );
};

export default ActivityViewPage;
