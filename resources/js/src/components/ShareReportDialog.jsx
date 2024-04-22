import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { shareAllReport } from "../features/report/reportSlice";

const ShareReportDialog = ({ visible, handleOnHide }) => {
    const [data, setData] = useState({
        user_id: "",
    });
    const [selectedReports, setSelectedReports] = useState([]);
    const reportTypes = [
        { name: "Live calls", value: "livecalls" },
        { name: "Live chats", value: "livechats" },
        { name: "Callbacks", value: "callbacks" },
        { name: "Raised Tickets", value: "tickets" },
    ];

    const dispatch = useDispatch();

    const { isSuccess, isLoading, type } = useSelector((state) => state.report);
    const { users } = useSelector((state) => state.profile);

    useEffect(() => {
        if (isSuccess && type == "report/share-report/fulfilled") {
            dispatch(reset());
            onHide();
        }
    }, [isSuccess]);

    const onCategoryChange = (e) => {
        let _selectedReport = [...selectedReports];

        if (e.checked) _selectedReport.push(e.value);
        else
            _selectedReport = _selectedReport.filter(
                (item) => item !== e.value
            );

        setSelectedReports(_selectedReport);
    };

    const onHide = () => {
        setData({
            user_id: "",
        });
        setSelectedReports([]);
        handleOnHide();
    };

    const handleSubmit = () => {
        dispatch(
            shareAllReport({
                ...data,
                category: selectedReports,
                format: "xlsx",
            })
        );
    };

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            className=" "
            header="Share Report with other member of the team"
        >
            <div className="tw-mt-5 tw-w-full sm:tw-w-[35rem]">
                <div className="tw-mb-4 tw-flex tw-flex-col tw-gap-2">
                    <label htmlFor="title">Select charts to share:</label>
                    <div className="">
                        <div className="tw-flex tw-flex-col tw-gap-3">
                            {reportTypes.map((report) => {
                                return (
                                    <div
                                        key={report.value}
                                        className="tw-flex tw-items-center"
                                    >
                                        <Checkbox
                                            inputId={report.value}
                                            name="report"
                                            value={report.value}
                                            onChange={onCategoryChange}
                                            checked={selectedReports.some(
                                                (item) => item === report.value
                                            )}
                                        />
                                        <label
                                            htmlFor={report.value}
                                            className="tw-ml-2"
                                        >
                                            {report.name}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="tw-mb-4 tw-flex tw-flex-col tw-gap-2">
                    <label htmlFor="title">Share with:</label>
                    <Dropdown
                        name="user_id"
                        options={users?.data}
                        optionLabel="name"
                        optionValue="id"
                        showFilterClear
                        filter
                        filterBy="name,email"
                        onChange={(e) => setData({ ...data, user_id: e.value })}
                    />
                </div>
            </div>
            <div className="tw-my-4 tw-flex tw-items-center tw-justify-between">
                <Button
                    label="Share"
                    onClick={handleSubmit}
                    loading={isLoading}
                />
                <Button
                    outlined
                    label="Cancel"
                    severity="secondary"
                    onClick={onHide}
                    disabled={isLoading}
                />
            </div>
        </Dialog>
    );
};

export default ShareReportDialog;
