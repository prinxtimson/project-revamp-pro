import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

const OfflineDialog = ({ open, handleClose }) => {
    return (
        <Dialog open={open} maxWidth="xs" style={{ padding: 5 }}>
            <DialogContent className="tw-bg-gray-200">
                <div className="">
                    <p className="tw-text-xl tw-font-medium">
                        Thank you for contacting us today, Our agents are
                        available 9am - 4pm Monday - Friday. In the meantime you
                        can visit the FAQ's, leave a callback request, or raise
                        a ticket
                    </p>
                </div>
            </DialogContent>
            <DialogActions className="tw-bg-gray-200">
                <button
                    className={`tw-p-2 tw-font-semibold tw-text-sm  tw-text-indigo-500 tw-rounded-md tw-shadow-md tw-border-2 tw-m-auto tw-self-center tw-w-40 
                                        tw-border-indigo-500 hover:tw-border-indigo-700
                                `}
                    onClick={handleClose}
                >
                    Close
                </button>
            </DialogActions>
        </Dialog>
    );
};

export default OfflineDialog;
