import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

import { getProfiles } from "../features/profile/profileSlice";
import { shareReport } from "../features/report/reportSlice";

const ReportExportDialog = ({ open, handleOnHide }) => {
    const [data, setData] = useState({
        email: "",
        filename: "",
    });

    const dispatch = useDispatch();

    const { report, isLoading } = useSelector((state) => state.report);
    const { users } = useSelector((state) => state.profile);

    useEffect(() => {
        dispatch(getProfiles());
    }, []);

    useEffect(() => {
        if (report) {
            setData({ ...data, filename: report.name });
        }
    }, [report]);

    const submit = (e) => {
        e.preventDefault();
        dispatch(shareReport(data));
    };

    return (
        <Dialog visible={open} onHide={handleOnHide}>
            <div className="tw-bg-white tw-rounded-md tw-w-full md:tw-w-[34.5rem] tw-w-auto">
                <div className="">
                    <div className="tw-text-center tw-mb-8">
                        <h2 className="tw-text-xl tw-font-semimedium tw-my-0">
                            Share Report
                        </h2>
                    </div>
                    <form className="p-fluid" onSubmit={submit}>
                        <div className="field tw-mb-8">
                            <span className="p-float-label custom-label">
                                <Dropdown
                                    name="method"
                                    value={data.email}
                                    options={users?.data}
                                    optionLabel="name"
                                    optionValue="email"
                                    onChange={(e) =>
                                        setData({ ...data, email: e.value })
                                    }
                                    editable
                                    filter
                                    showClear
                                    filterBy="name, email"
                                    className="tw-w-full"
                                />
                                <label htmlFor="role">Select/Enter Email</label>
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

export default ReportExportDialog;
