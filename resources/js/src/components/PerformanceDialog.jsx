import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { toast } from "react-toastify";
import {
    submitPerformance,
    updatePerformance,
    reset,
} from "../features/performance/performanceSlice";

const PerformanceDialog = ({
    open,
    data,
    isEdit,
    handleOnChange,
    handleOnHide,
}) => {
    const dispatch = useDispatch();

    const { isLoading, isSuccess, isError, type, message } = useSelector(
        (state) => state.performance
    );

    useEffect(() => {
        if (isError && message) {
            toast.error(message);
        }

        if (isSuccess && message) {
            toast.success(message);
            handleOnHide();
        }

        dispatch(reset());
    }, [isError, isSuccess, message, dispatch]);

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            dispatch(updatePerformance(data));
        } else {
            dispatch(submitPerformance(data));
        }
    };

    return (
        <Dialog visible={open} onHide={handleOnHide}>
            <div className="tw-bg-white tw-rounded-md tw-w-full md:tw-w-[34.5rem] tw-w-auto">
                <div className="card">
                    <div className="tw-text-center tw-mb-4">
                        <h2 className="tw-text-2xl tw-font-semimedium tw-mb-4">
                            Add/Edit Performance Tracking
                        </h2>
                    </div>
                    <form className="p-fluid" onSubmit={submit}>
                        <div className="field tw-mb-8">
                            <span className="p-float-label ">
                                <InputText
                                    name="name"
                                    type="text"
                                    value={data.name}
                                    onChange={handleOnChange}
                                    required
                                />
                                <label htmlFor="name">Name *</label>
                            </span>
                        </div>
                        <div className="field tw-mb-8">
                            <span className="p-float-label ">
                                <InputTextarea
                                    name="description"
                                    type="text"
                                    value={data.description}
                                    onChange={handleOnChange}
                                    rows={4}
                                />
                                <label htmlFor="description">
                                    Description *
                                </label>
                            </span>
                        </div>
                        <div className="field tw-mb-8">
                            <span className="p-float-label custom-label">
                                <Dropdown
                                    name="method"
                                    value={data.method}
                                    options={KPIS}
                                    onChange={handleOnChange}
                                    className="tw-w-full"
                                />
                                <label htmlFor="role">Select KPI</label>
                            </span>
                        </div>

                        <div className="field tw-mb-8">
                            <span className="p-float-label">
                                <InputText
                                    name="target_value"
                                    type="text"
                                    value={data.target_value}
                                    onChange={handleOnChange}
                                    required
                                />
                                <label htmlFor="target_value">
                                    Target Value *
                                </label>
                            </span>
                        </div>

                        <div className="tw-mb-5"></div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            label="Submit"
                            className="tw-w-full"
                        />
                    </form>
                </div>
            </div>
        </Dialog>
    );
};

export default PerformanceDialog;

const KPIS = [
    "Customer Satisfaction",
    "Average Handle Time",
    "Average Response Time",
    "Abandonment Rate",
    "Customer Wait Time",
    "Call Wrap-Up Time",
];
