import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const DownloadChatDialog = ({ visible, handleOnHide, chat }) => {
    const handleDownload = () => {
        window.location.href = `/chats/transcript/${chat}/download`;
    };
    return (
        <Dialog
            visible={visible}
            onHide={handleOnHide}
            header="Download Transcript"
        >
            <h2 className="tw-text-center">Chat transcript generated</h2>
            <Button label="Download" onClick={handleDownload} />
        </Dialog>
    );
};

export default DownloadChatDialog;
