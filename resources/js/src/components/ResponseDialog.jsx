import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

const ResponseDialog = ({ open, message, handleClose, handleOpenCallback }) => {
    return (
        <Dialog open={open} maxWidth="xs" style={{ padding: 5 }}>
            <DialogContent className="tw-bg-gray-200">
                <div className="">
                    <p className="tw-text-xl tw-font-medium">{message}</p>
                </div>
            </DialogContent>
            <DialogActions className="tw-bg-gray-200">
                <button
                    className={`tw-p-2 tw-font-semibold tw-text-sm  tw-text-red-500 tw-rounded-md tw-shadow-md tw-border-2 tw-m-auto tw-self-center tw-w-40 
                                        tw-border-red-500 hover:tw-border-red-700
                                `}
                    onClick={handleClose}
                >
                    Cancel
                </button>
                <button
                    className={`tw-p-2 tw-font-semibold tw-text-sm  tw-text-white tw-rounded-md tw-shadow-md tw-m-auto tw-self-center tw-w-40 tw-bg-indigo-500 hover:tw-bg-indigo-700 tw-border-2 tw-border-indigo-500 hover:tw-border-indigo-700`}
                    onClick={() => {
                        handleOpenCallback();
                        handleClose();
                    }}
                >
                    Book a Callback
                </button>
            </DialogActions>
        </Dialog>
    );
};

export default ResponseDialog;
