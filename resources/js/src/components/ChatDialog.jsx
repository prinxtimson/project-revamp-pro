import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import moment from "moment";
import ChatMessage from "./ChatMessage";
import { toast } from "react-toastify";
import {
    sendMessage,
    startChat,
    reset,
    clear,
} from "../features/chat/chatSlice";

const ChatDialog = ({ visible, handleOnHide }) => {
    const [messages, setMessages] = useState({});
    const [name, setName] = useState("");
    const [msg, setMsg] = useState("");

    const dispatch = useDispatch();

    const { chat, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.chat
    );

    useEffect(() => {
        if (chat) {
            let _m = _.groupBy(
                chat.messages,
                (m) => m.created_at.split("T")[0]
            );
            setMessages(_m);
        } else {
            setMessages({});
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

    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(startChat({ name }));
    };

    const handleSendMessage = () => {
        let formData = new FormData();

        formData.append("_method", "post");
        formData.append("message", msg);
        formData.append("chat_id", chat.id);
        formData.append("sender_name", name);
        dispatch(sendMessage({ formData, chat_id: chat.id }));
    };

    const onHide = () => {
        setName("");
        handleOnHide();
        dispatch(clear());
    };

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            style={{ width: "55vw", minHeight: "40vh" }}
            breakpoints={{ "960px": "75vw", "641px": "100vw" }}
            header="Chat with Agent"
        >
            {chat ? (
                <div className="tw-flex tw-flex-col tw-h-full">
                    <div className="tw-bg-gray-100 tw-h-full tw-overflow-auto">
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
                                                value.sender_name == chat.name
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="tw-shadow tw-p-3 tw-flex tw-gap-2">
                        <div className="tw-grow">
                            <InputText
                                value={msg}
                                className="tw-w-full"
                                placeholder="Type a message here"
                                onChange={(e) => setMsg(e.target.value)}
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
            ) : (
                <div className="form-demo">
                    <div className="card">
                        <form className="p-fluid" onSubmit={handleOnSubmit}>
                            <div className="field">
                                <span className="p-float-label">
                                    <InputText
                                        name="name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        required
                                    />
                                    <label htmlFor="name">
                                        Enter your name
                                    </label>
                                </span>
                            </div>
                            <div className="field tw-mx-auto">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    label="Start Chat"
                                    className="tw-w-fit"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Dialog>
    );
};

export default ChatDialog;
