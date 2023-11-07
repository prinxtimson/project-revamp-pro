import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { InputSwitch } from "primereact/inputswitch";

import {
    getSettings,
    clear,
    reset,
    updateSettings,
} from "../../features/setting/settingSlice";

import DrawerContainer from "./DrawerContainer";

const NotificationPreference = () => {
    const [options, setOptions] = useState({});

    const dispatch = useDispatch();

    const { settings, isLoading } = useSelector((state) => state.setting);

    useEffect(() => {
        dispatch(getSettings());

        return () => dispatch(clear());
    }, []);

    useEffect(() => {
        let _options = {};
        settings.map((item) => {
            _options[item.key] = parseInt(item.value || 0);
        });

        setOptions({
            ...options,
            ..._options,
        });
    }, [settings]);

    const handleOnChange = (e) => {
        setOptions({ ...options, [e.target.name]: e.value });
        let data = [{ key: e.target.name, value: e.value }];

        dispatch(updateSettings(data));
    };

    return (
        <DrawerContainer>
            <div className="tw-w-full tw-h-full">
                <div className="tw-p-4">
                    <div className="tw-flex tw-flex-col tw-gap-8 tw-items-center">
                        <div className="tw-shadow-md tw-rounded-md tw-bg-white tw-border tw-p-4 tw-w-full sm:tw-w-[50rem]">
                            <div className="tw-flex tw-items-center tw-justify-between tw-p-2 tw-mb-2">
                                <div className="tw-flex-grow">
                                    <p className="tw-my-0 tw-text-lg">
                                        Notify me of all completed tasks
                                    </p>
                                </div>
                                <div className="sm:tw-w-32">
                                    <InputSwitch
                                        name="completed_task"
                                        checked={options.completed_task || 0}
                                        onChange={handleOnChange}
                                        trueValue={1}
                                        falseValue={0}
                                    />
                                </div>
                            </div>
                            <div className="tw-flex tw-items-center tw-justify-between tw-p-2 tw-mb-2">
                                <div className="tw-flex-grow">
                                    <p className="tw-my-0 tw-text-lg">
                                        Notify me of SLA violations
                                    </p>
                                </div>
                                <div className="sm:tw-w-32">
                                    <InputSwitch
                                        name="sla_violations"
                                        checked={options.sla_violations || 0}
                                        onChange={handleOnChange}
                                        trueValue={1}
                                        falseValue={0}
                                    />
                                </div>
                            </div>
                            <div className="tw-flex tw-items-center tw-justify-between tw-p-2 tw-mb-2">
                                <div className="tw-flex-grow">
                                    <p className="tw-my-0 tw-text-lg">
                                        Notify me of customer feedback
                                    </p>
                                </div>
                                <div className="sm:tw-w-32">
                                    <InputSwitch
                                        name="feedback"
                                        checked={options.feedback || 0}
                                        onChange={handleOnChange}
                                        trueValue={1}
                                        falseValue={0}
                                    />
                                </div>
                            </div>
                            <div className="tw-flex tw-items-center tw-justify-between tw-p-2 tw-mb-2">
                                <div className="tw-flex-grow">
                                    <p className="tw-my-0 tw-text-lg">
                                        Notify me of closed issues
                                    </p>
                                </div>
                                <div className="sm:tw-w-32">
                                    <InputSwitch
                                        name="closed_issues"
                                        checked={options.closed_issues || 0}
                                        onChange={handleOnChange}
                                        trueValue={1}
                                        falseValue={0}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="tw-shadow-md tw-bg-white tw-rounded-md tw-border tw-p-4 tw-w-full sm:tw-w-[50rem]">
                            <h2 className="tw-text-lg">Get notification via</h2>
                            <div className="tw-flex tw-items-center tw-justify-between tw-p-2 tw-mb-2">
                                <div className="tw-flex-grow">
                                    <p className="tw-my-0 tw-text-lg">Email</p>
                                </div>
                                <div className="sm:tw-w-32">
                                    <InputSwitch
                                        name="email"
                                        checked={options.email || 0}
                                        onChange={handleOnChange}
                                        trueValue={1}
                                        falseValue={0}
                                    />
                                </div>
                            </div>
                            <div className="tw-flex tw-items-center tw-justify-between tw-p-2 tw-mb-2">
                                <div className="tw-flex-grow">
                                    <p className="tw-my-0 tw-text-lg">
                                        Browser push notification
                                    </p>
                                </div>
                                <div className="sm:tw-w-32">
                                    <InputSwitch
                                        name="push_notification"
                                        checked={options.push_notification || 0}
                                        onChange={handleOnChange}
                                        trueValue={1}
                                        falseValue={0}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DrawerContainer>
    );
};

export default NotificationPreference;
