import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RadioButton } from "primereact/radiobutton";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { BsClipboardData, BsShare, BsBoxArrowRight } from "react-icons/bs";

import DrawerContainer from "./DrawerContainer";
import {
    generateReport,
    saveReport,
    reset,
} from "../../features/report/reportSlice";
import ReportExportDialog from "../../components/ReportExportDialog";
import { toast } from "react-toastify";

const ReportPage = () => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({
        performance_indicators: [],
    });

    const dispatch = useDispatch();

    const { report, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.report
    );

    const handleOnChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const onKpiChange = (e) => {
        let selectedKpi = [...data.performance_indicators];

        if (e.checked) selectedKpi.push(e.value);
        else selectedKpi.splice(selectedKpi.indexOf(e.value), 1);

        setData({ ...data, performance_indicators: selectedKpi });
    };

    useEffect(() => {
        if (isError && message) {
            toast.error(message);
        }

        if (isSuccess && message) {
            toast.success(message);
            setOpen(false);
        }

        dispatch(reset());
    }, [isError, isSuccess, message, dispatch]);

    const handleGenerateReport = () => {
        dispatch(generateReport(data));
    };

    const handleSaveReport = () => {
        dispatch(saveReport(report));
    };

    return (
        <DrawerContainer>
            <div className="tw-w-full tw-h-full tw-p-4">
                <div className="tw-flex tw-flex-col tw-justify-center">
                    <div className="tw-border tw-rounded-md tw-mb-4 tw-bg-white">
                        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-items-center tw-gap-4 tw-p-5">
                            <div className="">
                                <h2 className=" tw-font-semibold">
                                    Report Base
                                </h2>
                            </div>
                            <div className="tw-col-span-2 tw-flex tw-items-center tw-gap-4">
                                <div className="field-radiobutton">
                                    <RadioButton
                                        inputId="category1"
                                        name="category"
                                        value="agent"
                                        onChange={handleOnChange}
                                        checked={data.category === "agent"}
                                    />
                                    <label htmlFor="category1">Agents</label>
                                </div>
                                <div className="field-radiobutton tw-ml-4">
                                    <RadioButton
                                        inputId="category2"
                                        name="category"
                                        value="request"
                                        onChange={handleOnChange}
                                        checked={data.category === "request"}
                                    />
                                    <label htmlFor="category2">Category</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tw-border tw-rounded-md tw-mb-4 tw-bg-white">
                        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-items-center tw-gap-4 tw-p-5">
                            <div className="">
                                <h2 className=" tw-font-semibold">
                                    Date Range
                                </h2>
                            </div>

                            <div className="tw-col-span-2 tw-flex tw-items-center tw-gap-4 p-fluid">
                                <div className="field">
                                    <span className="p-float-label">
                                        <Calendar
                                            name="start_date"
                                            value={data.start_date}
                                            onChange={handleOnChange}
                                        />
                                        <label htmlFor="start_date">
                                            Start Date
                                        </label>
                                    </span>
                                </div>

                                <div className="field">
                                    <span className="p-float-label">
                                        <Calendar
                                            name="end_date"
                                            value={data.end_date}
                                            onChange={handleOnChange}
                                        />
                                        <label htmlFor="end_date">
                                            End Date
                                        </label>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tw-border tw-rounded-md tw-mb-4 tw-bg-white">
                        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-items-center tw-gap-4 tw-p-5">
                            <div className="">
                                <h2 className=" tw-font-semibold">
                                    Report Format
                                </h2>
                            </div>
                            <div className="tw-col-span-2 tw-flex tw-items-center tw-gap-4">
                                <div className="field-radiobutton">
                                    <RadioButton
                                        inputId="format1"
                                        name="format"
                                        value="xlsx"
                                        onChange={handleOnChange}
                                        checked={data.format === "xlsx"}
                                    />
                                    <label htmlFor="format1">Excel</label>
                                </div>
                                <div className="field-radiobutton tw-ml-4">
                                    <RadioButton
                                        inputId="format2"
                                        name="format"
                                        value="pdf"
                                        onChange={handleOnChange}
                                        checked={data.format === "pdf"}
                                    />
                                    <label htmlFor="format2">PDF</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tw-border tw-rounded-md tw-mb-4 tw-bg-white">
                        <div className="tw-p-5">
                            <div className="">
                                <h2 className=" tw-font-semibold">
                                    Select Key Performance Indicators
                                </h2>
                            </div>

                            <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 p-fluid">
                                {KPIS.map((item, index) => (
                                    <div
                                        className="field-checkbox tw-mb-2"
                                        key={item}
                                    >
                                        <Checkbox
                                            inputId={`kpi${index + 1}`}
                                            name="performance_indicators"
                                            value={item}
                                            onChange={onKpiChange}
                                            checked={data.performance_indicators.includes(
                                                item
                                            )}
                                        />
                                        <label htmlFor={`kpi${(index = 1)}`}>
                                            {item}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="tw-border tw-rounded-md tw-mb-4 tw-bg-white">
                        <div className="tw-flex tw-flex-wrap tw-justify-center tw-items-center tw-gap-4 tw-p-5">
                            <Button
                                type="button"
                                label="Generate Report"
                                className=" p-button-text"
                                onClick={handleGenerateReport}
                                icon={<BsClipboardData className="tw-mr-2" />}
                                loading={isLoading}
                            />
                            <Button
                                type="button"
                                label="Save"
                                className=" p-button-text"
                                onClick={handleSaveReport}
                                icon="pi pi-save"
                                disabled={Boolean(!report)}
                            />
                            <Button
                                type="button"
                                label="Share"
                                className=" p-button-text"
                                onClick={() => setOpen(true)}
                                icon={<BsShare className="tw-mr-2" />}
                                disabled={Boolean(!report)}
                            />
                            <Button
                                type="button"
                                label="Export"
                                className=" p-button-text"
                                onClick={() => {
                                    if (report) {
                                        window.open(
                                            `/report/download/${report.name}`,
                                            "_blank"
                                        );
                                    }
                                }}
                                icon={<BsBoxArrowRight className="tw-mr-2" />}
                                disabled={Boolean(!report)}
                            />
                        </div>
                    </div>
                </div>
                <ReportExportDialog
                    open={open}
                    handleOnHide={() => setOpen(false)}
                />
            </div>
        </DrawerContainer>
    );
};

export default ReportPage;

const KPIS = [
    "Customer Satisfaction",
    "Average Handle Time",
    "Average Response Time",
    "Abandonment Rate",
    "Customer Wait Time",
    "Call Wrap-Up Time",
];
