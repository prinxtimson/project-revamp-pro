import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { Image } from "primereact/image";

import DrawerContainer from "./DrawerContainer";
import {
    getChat,
    sendMessage,
    reset,
    clear,
    getChats,
    endChat,
} from "../../features/chat/chatSlice";
import _ from "lodash";
import { toast } from "react-toastify";
import moment from "moment";
import ChatMessage from "../../components/ChatMessage";
import DownloadChatDialog from "../../components/DownloadChatDialog";

const LivechatPage = () => {
    const imgRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [chatID, setChatID] = useState(null);
    const [file, setFile] = useState(null);
    const [messages, setMessages] = useState({});
    const [msg, setMsg] = useState("");

    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { chats, chat, isLoading, isError, type, isSuccess, message } =
        useSelector((state) => state.chat);

    useEffect(() => {
        dispatch(getChats());

        return () => dispatch(clear());
    }, []);

    useEffect(() => {
        if (chat) {
            let _m = _.groupBy(
                chat.messages,
                (m) => m.created_at.split("T")[0]
            );
            setMessages(_m);
        }
    }, [chat]);

    useEffect(() => {
        if (isError && message) {
            toast.error(message);
        }

        if (isSuccess) {
            setMsg("");
        }

        dispatch(reset());
    }, [isError, isSuccess, message, dispatch]);

    const accept = () => {
        setChatID(chat.id);
        dispatch(endChat(chat.id));
        setVisible(true);
    };

    const reject = () => {
        dispatch(endChat(chat.id));
    };

    const confirm = () => {
        confirmDialog({
            message: "Do you wish to generate chat transcript?",
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            defaultFocus: "accept",
            accept,
            reject,
        });
    };

    const handleFileSelect = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSendMessage = () => {
        let formData = new FormData();

        formData.append("_method", "post");
        formData.append("message", msg);
        formData.append("chat_id", chat.id);
        formData.append("sender_name", user.name);
        formData.append("sender_avatar", user.avatar);
        if (file) {
            formData.append("media", file);
        }

        dispatch(sendMessage({ formData, chat_id: chat.id }));
    };

    return (
        <DrawerContainer>
            <ConfirmDialog />
            <DownloadChatDialog
                visible={visible}
                handleOnHide={() => setVisible(false)}
                chat={chatID}
            />
            <div className="tw-grow tw-w-full tw-m-5 md:tw-my-8 md:tw-mx-6">
                <div className="tw-w-full tw-h-full tw-flex tw-shadow tw-rounded">
                    <div className="tw-w-60 tw-flex tw-flex-col tw-gap-2 tw-bg-gray-200 tw-p-3">
                        <div className="tw-h-3/5">
                            <div className="tw-p-2 tw-mb-3 tw-bg-white">
                                <h4 className="tw-my-0 tw-text-center">
                                    Active chats
                                </h4>
                            </div>
                            {chats
                                .filter((val) => val.status == "active")
                                .map((item) => (
                                    <div
                                        className="tw-flex tw-gap-2 tw-cursor-pointer"
                                        key={item.id}
                                        onClick={() =>
                                            dispatch(getChat(item.id))
                                        }
                                    >
                                        <div className="">
                                            <Avatar
                                                shape="circle"
                                                imageAlt={item.name}
                                                image="/images/no_img.png"
                                            />
                                        </div>
                                        <div className="tw-grow">
                                            <h5 className="tw-my-0">
                                                {item.name}
                                            </h5>
                                            <p className="tw-my-1 tw-text-gray-500">
                                                {item.last_message}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="">
                            <div className="tw-p-2 tw-mb-3 tw-bg-white">
                                <h4 className="tw-my-0 tw-text-center">
                                    Pending chats
                                </h4>
                            </div>

                            {chats
                                .filter((val) => val.status == "pending")
                                .map((item) => (
                                    <div
                                        className="tw-flex tw-gap-2 tw-cursor-pointer"
                                        key={item.id}
                                        onClick={() =>
                                            dispatch(getChat(item.id))
                                        }
                                    >
                                        <div className="">
                                            <Avatar
                                                shape="circle"
                                                imageAlt={item.name}
                                                image="/images/no_img.png"
                                            />
                                        </div>
                                        <div className="tw-grow">
                                            <h5 className="tw-my-0">
                                                {item.name}
                                            </h5>
                                            <p className="tw-my-0 tw-text-gray-500">
                                                {item.last_message}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    {chat ? (
                        <div className="tw-grow tw-bg-white tw-flex tw-flex-col">
                            <div className="tw-p-2 tw-m-3 tw-bg-gray-200">
                                <h4 className="tw-my-0 tw-text-center">
                                    Conversation
                                </h4>
                            </div>
                            <div className="tw-grow tw-overflow-auto tw-p-4">
                                {Object.keys(messages).map((key, index) => (
                                    <div className="tw-my-5" key={index}>
                                        <p className="tw-text-center tw-text-gray-400">
                                            {moment(key).calendar({
                                                sameDay: "[Today]",
                                                lastWeek: "DD/MM/YYYY",
                                                lastDay: "[Yesterday]",
                                                sameElse: "DD/MM/YYYY",
                                            })}
                                        </p>
                                        <div className="">
                                            {messages[key].map((value) => (
                                                <ChatMessage
                                                    key={value.id}
                                                    message={value}
                                                    isSender={
                                                        value.user_id == user.id
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {file && (
                                <div className="tw-relative tw-w-fit">
                                    <Image
                                        src={
                                            IMGTYPES.includes(file.type)
                                                ? URL.createObjectURL(file)
                                                : PDFTYPES.includes(file.type)
                                                ? "/images/pdf.png"
                                                : XLSXTYPES.includes(file.type)
                                                ? "/images/xlsx.png"
                                                : PPTTYPES.includes(file.type)
                                                ? "/images/ppt.png"
                                                : "/images/docs.png"
                                        }
                                        width="80"
                                        indicatorIcon={
                                            <i className="pi pi-times"></i>
                                        }
                                    />
                                    <i
                                        className="pi pi-trash tw-p-1 tw-cursor-pointer tw-absolute tw-top-0 tw-right-0 tw-text-sm tw-text-red-500"
                                        onClick={() => setFile(null)}
                                    ></i>
                                </div>
                            )}
                            <div className="tw-shadow tw-p-3 tw-flex tw-gap-3">
                                <div className="tw-grow">
                                    <div className="tw-w-full tw-bg-white tw-flex tw-gap-2">
                                        <InputText
                                            value={msg}
                                            className="tw-w-full"
                                            placeholder="Type a message here"
                                            onChange={(e) =>
                                                setMsg(e.target.value)
                                            }
                                        />
                                        <div className="">
                                            <input
                                                type="file"
                                                hidden
                                                ref={imgRef}
                                                onChange={handleFileSelect}
                                                accept=".gif,.jpg,.jpeg,.png,.docx,.csv,.pdf,.xlsx,.xls,.pages,.svg,.pptx,.ppt"
                                            />
                                            <Button
                                                size="small"
                                                icon="pi pi-paperclip"
                                                rounded
                                                text
                                                onClick={() =>
                                                    imgRef.current.click()
                                                }
                                            />
                                        </div>
                                        <Button
                                            text
                                            icon="pi pi-send"
                                            rounded
                                            onClick={handleSendMessage}
                                        />
                                    </div>
                                </div>
                                <div className="">
                                    <Button
                                        label="End"
                                        severity="danger"
                                        onClick={confirm}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="tw-grow tw-flex tw-justify-center tw-items-center tw-bg-white">
                            <h1 className="tw-text-4xl tw-text-gray-400">
                                Select chat . . . .{" "}
                            </h1>
                        </div>
                    )}
                </div>
            </div>
        </DrawerContainer>
    );
};

export default LivechatPage;
