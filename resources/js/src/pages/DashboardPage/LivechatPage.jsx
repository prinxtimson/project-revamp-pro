import { useEffect, useState } from "react";
import DrawerContainer from "./DrawerContainer";

const LivechatPage = () => {
    return (
        <DrawerContainer>
            <div className="tw-grow tw-w-full tw-m-5 md:tw-my-8 md:tw-mx-6">
                <div className="tw-w-full tw-h-full tw-flex">
                    <div className="tw-w-60 tw-flex tw-flex-col tw-gap-2 tw-bg-gray-200 tw-p-4">
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
                    <div className="tw-grow tw-bg-white tw-p-4">
                        <div className="tw-p-2 tw-mb-3 tw-bg-gray-200">
                            <h4 className="tw-my-0 tw-text-center">
                                Conversation
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </DrawerContainer>
    );
};

export default LivechatPage;
