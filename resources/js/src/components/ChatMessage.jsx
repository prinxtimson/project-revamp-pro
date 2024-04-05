import { useRef, useEffect, useState } from "react";
import moment from "moment";
import { Image } from "primereact/image";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";

const ChatMessage = ({ isSender, message }) => {
    const menuRef = useRef(null);
    const ref = useRef(null);
    const [menuItems, setMenuItems] = useState([]);
    const fileExt = message.media?.split(".").pop() || "";

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
        let _menuItems = [];
        let msgD = moment(message.created_at);
        let d = moment();

        if (d.diff(msgD, "minutes") < 15) {
            _menuItems.push({
                label: "Edit",
                command: () => handleEditMessage(message),
            });
        }

        if (d.diff(msgD, "days") < 2) {
            _menuItems.push({
                label: "Delete",
                command: () => handleDeleteMessage(message),
            });
        }

        setMenuItems(_menuItems);
    }, [message]);

    return (
        <div
            className={`tw-flex tw-mb-5 tw-gap-1 ${
                isSender ? "tw-flex-row-reverse" : ""
            }`}
            ref={ref}
        >
            <div className={`${isSender ? "tw-items-end" : ""}`}>
                <Avatar
                    image={message.sender_avatar || "/images/no_img.png"}
                    imageAlt={message.sender_name || ""}
                    shape="circle"
                />
            </div>

            <div
                className={`tw-p-1 tw-w-fit tw-max-w-[80%] tw-flex tw-flex-col tw-gap-1  ${
                    isSender
                        ? "tw-items-end tw-rounded-tl-lg tw-bg-indigo-400 tw-text-white tw-mr-2"
                        : "tw-bg-gray-50 tw-rounded-tr-lg"
                }  tw-rounded-bl-lg tw-rounded-br-lg tw-ml-2`}
            >
                <div className="tw-flex tw-gap-2 tw-items-center">
                    <h5 className="tw-my-0 tw-font-bold tw-text-sm">
                        {message.sender_name}
                    </h5>
                    <small
                        className={`tw-text-xs ${
                            isSender ? "" : "tw-text-gray-400"
                        }`}
                    >
                        {`${moment(message.updated_at).format("HH:mm")} ${
                            message.edited_at ? "edited" : ""
                        }`}
                    </small>
                </div>
                {message.media && (
                    <a
                        href={message.media}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={true}
                    >
                        <Image
                            src={
                                IMGTYPES.includes(fileExt)
                                    ? message.media
                                    : PDFTYPES.includes(fileExt)
                                    ? "/images/pdf.png"
                                    : XLSXTYPES.includes(fileExt)
                                    ? "/images/xlsx.png"
                                    : PPTTYPES.includes(fileExt)
                                    ? "/images/ppt.png"
                                    : "/images/docs.png"
                            }
                            imageClassName={`${
                                isSender
                                    ? "tw-rounded-tl-lg tw-text-white"
                                    : " tw-rounded-tr-lg"
                            }  tw-rounded-bl-lg tw-rounded-br-lg ${
                                message.media ? "" : "tw-hidden"
                            }`}
                            width={IMGTYPES.includes(fileExt) ? "200" : "100"}
                        />
                    </a>
                )}
                <div className="tw-w-full">
                    <p className={`tw-w-full tw-my-0 `}>{message.message}</p>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;

const IMGTYPES = ["jpeg", "png", "gif", "svg"];
const PDFTYPES = ["pdf"];
const XLSXTYPES = ["csv", "xlsx", "xls"];
const PPTTYPES = ["ppt"];
