import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import DrawerContainer from "./DrawerContainer";

const LivechatPage = () => {
    return (
        <DrawerContainer>
            <div className="tw-grow tw-w-full tw-m-5 md:tw-my-8 md:tw-mx-6">
                <div className="tw-w-full tw-h-full tw-flex tw-shadow tw-rounded">
                    <div className="tw-w-60 tw-flex tw-flex-col tw-gap-2 tw-bg-gray-200 tw-p-3">
                        <div className="tw-h-3/5">
                            <div className="tw-p-2 tw-mb-3 tw-bg-white">
                                <h4 className="tw-my-0 tw-text-center">
                                    Active chats
                                </h4>
                            </div>
                        </div>
                        <div className="">
                            <div className="tw-p-2 tw-mb-3 tw-bg-white">
                                <h4 className="tw-my-0 tw-text-center">
                                    Active chats
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="tw-grow tw-bg-white tw-flex tw-flex-col">
                        <div className="tw-p-2 tw-m-3 tw-bg-gray-200">
                            <h4 className="tw-my-0 tw-text-center">
                                Conversation
                            </h4>
                        </div>
                        <div className="tw-grow tw-overflow-auto"></div>
                        <div className="tw-shadow tw-p-3 tw-flex tw-gap-3">
                            <div className="tw-grow">
                                <div className="tw-w-full tw-bg-white tw-flex tw-gap-2">
                                    <InputText
                                        className="tw-w-full"
                                        placeholder="Type a message here"
                                    />
                                    <Button text icon="pi pi-send" rounded />
                                </div>
                            </div>
                            <div className="">
                                <Button label="End" severity="danger" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DrawerContainer>
    );
};

export default LivechatPage;
