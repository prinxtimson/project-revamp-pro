import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";

import {
    getPerformances,
    clear,
} from "../../features/performance/performanceSlice";
import DrawerContainer from "./DrawerContainer";
import PerformanceDialog from "../../components/PerformanceDialog";

const PerformanceTracking = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        method: "",
        target_value: "",
    });

    const dispatch = useDispatch();

    const { performances, isLoading } = useSelector(
        (state) => state.performance
    );

    const handleOnChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const handleOnHide = () => {
        setData({
            name: "",
            description: "",
            method: "",
            target_value: "",
        });
        setIsEdit(false);
        setOpenDialog(false);
        dispatch(getPerformances());
    };

    useEffect(() => {
        dispatch(getPerformances());

        return () => dispatch(clear());
    }, []);

    return (
        <DrawerContainer>
            <div className="tw-w-full tw-h-full tw-p-4">
                {performances.map((item) => (
                    <div
                        className="tw-shadow-md tw-bg-white tw-border tw-rounded tw-mb-4"
                        key={item.id}
                    >
                        <div className="tw-flex tw-items-center tw-gap-4 tw-p-4">
                            <div className="tw-grow ">
                                <h2 className="tw-text-lg tw-font-semibold tw-my-0">
                                    {`${item.name} (${item.method})`}
                                </h2>
                                <p>{item.description}</p>
                            </div>
                            <div className="tw-flex tw-flex-col tw-items-center">
                                <h3 className="tw-my-0">{item.target_value}</h3>
                                <p className="tw-my-0">Target</p>
                            </div>
                            <div className="tw-h-full tw-flex tw-items-end">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setOpenDialog(true);
                                        setData(item);
                                        setIsEdit(true);
                                    }}
                                    label="Edit"
                                    className="p-button-text"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="tw-flex tw-items-center tw-justify-center tw-mt-4">
                    <Button
                        type="button"
                        onClick={() => setOpenDialog(true)}
                        label="Create New KPI"
                        className="p-button-outlined"
                    />
                </div>
                <PerformanceDialog
                    open={openDialog}
                    handleOnChange={handleOnChange}
                    handleOnHide={handleOnHide}
                    isEdit={isEdit}
                    data={data}
                />
            </div>
        </DrawerContainer>
    );
};

export default PerformanceTracking;
