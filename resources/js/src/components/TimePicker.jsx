const TimePicker = ({ choosenTime = [], handleOnClick, time = "" }) => {
    return (
        <div className="tw-grid tw-grid-cols-4 tw-gap-2 tw-border tw-p-2 tw-rounded">
            <button
                className={`tw-border tw-p-1 tw-rounded ${
                    choosenTime.includes("12:00") || time == "12:00"
                        ? "tw-border-indigo-200 tw-text-indigo-200"
                        : "tw-border-indigo-600 tw-text-indigo-600 hover:tw-border-indigo-900 hover:tw-text-indigo-900"
                }`}
                disabled={choosenTime.includes("12:00") || time == "12:00"}
                onClick={() => handleOnClick("12:00")}
            >
                12:00
            </button>
            <button
                className={`tw-border tw-p-1 tw-rounded ${
                    choosenTime.includes("12:15") || time == "12:15"
                        ? "tw-border-indigo-200 tw-text-indigo-200"
                        : "tw-border-indigo-600 tw-text-indigo-600 hover:tw-border-indigo-900 hover:tw-text-indigo-900"
                }`}
                disabled={choosenTime.includes("12:15") || time == "12:15"}
                onClick={() => handleOnClick("12:15")}
            >
                12:15
            </button>
            <button
                className={`tw-border tw-p-1 tw-rounded ${
                    choosenTime.includes("12:30") || time == "12:30"
                        ? "tw-border-indigo-200 tw-text-indigo-200"
                        : "tw-border-indigo-600 tw-text-indigo-600 hover:tw-border-indigo-900 hover:tw-text-indigo-900"
                }`}
                disabled={choosenTime.includes("12:30") || time == "12:30"}
                onClick={() => handleOnClick("12:30")}
            >
                12:30
            </button>
            <button
                className={`tw-border tw-p-1 tw-rounded ${
                    choosenTime.includes("12:45") || time == "12:45"
                        ? "tw-border-indigo-200 tw-text-indigo-200"
                        : "tw-border-indigo-600 tw-text-indigo-600 hover:tw-border-indigo-900 hover:tw-text-indigo-900"
                }`}
                disabled={choosenTime.includes("12:45") || time == "12:45"}
                onClick={() => handleOnClick("12:45")}
            >
                12:45
            </button>

            <button
                className={`tw-border tw-p-1 tw-rounded ${
                    choosenTime.includes("13:00") || time == "13:00"
                        ? "tw-border-indigo-200 tw-text-indigo-200"
                        : "tw-border-indigo-600 tw-text-indigo-600 hover:tw-border-indigo-900 hover:tw-text-indigo-900"
                }`}
                disabled={choosenTime.includes("13:00") || time == "13:00"}
                onClick={() => handleOnClick("13:00")}
            >
                13:00
            </button>
            <button
                className={`tw-border tw-p-1 tw-rounded ${
                    choosenTime.includes("13:15") || time == "13:15"
                        ? "tw-border-indigo-200 tw-text-indigo-200"
                        : "tw-border-indigo-600 tw-text-indigo-600 hover:tw-border-indigo-900 hover:tw-text-indigo-900"
                }`}
                disabled={choosenTime.includes("13:15") || time == "13:15"}
                onClick={() => handleOnClick("13:15")}
            >
                13:15
            </button>
            <button
                className={`tw-border tw-p-1 tw-rounded ${
                    choosenTime.includes("13:30") || time == "13:30"
                        ? "tw-border-indigo-200 tw-text-indigo-200"
                        : "tw-border-indigo-600 tw-text-indigo-600 hover:tw-border-indigo-900 hover:tw-text-indigo-900"
                }`}
                disabled={choosenTime.includes("13:30") || time == "13:30"}
                onClick={() => handleOnClick("13:30")}
            >
                13:30
            </button>
            <button
                className={`tw-border tw-p-1 tw-rounded ${
                    choosenTime.includes("13:45") || time == "13:45"
                        ? "tw-border-indigo-200 tw-text-indigo-200"
                        : "tw-border-indigo-600 tw-text-indigo-600 hover:tw-border-indigo-900 hover:tw-text-indigo-900"
                }`}
                disabled={choosenTime.includes("13:45") || time == "13:45"}
                onClick={() => handleOnClick("13:45")}
            >
                13:45
            </button>

            <button
                className={`tw-border tw-p-1 tw-rounded ${
                    choosenTime.includes("14:00") || time == "14:00"
                        ? "tw-border-indigo-200 tw-text-indigo-200"
                        : "tw-border-indigo-600 tw-text-indigo-600 hover:tw-border-indigo-900 hover:tw-text-indigo-900"
                }`}
                disabled={choosenTime.includes("14:00") || time == "14:00"}
                onClick={() => handleOnClick("14:00")}
            >
                14:00
            </button>
            <button
                className={`tw-border tw-p-1 tw-rounded ${
                    choosenTime.includes("14:15") || time == "14:15"
                        ? "tw-border-indigo-200 tw-text-indigo-200"
                        : "tw-border-indigo-600 tw-text-indigo-600 hover:tw-border-indigo-900 hover:tw-text-indigo-900"
                }`}
                disabled={choosenTime.includes("14:15") || time == "14:15"}
                onClick={() => handleOnClick("14:15")}
            >
                14:15
            </button>
            <button
                className={`tw-border tw-p-1 tw-rounded ${
                    choosenTime.includes("14:30") || time == "14:30"
                        ? "tw-border-indigo-200 tw-text-indigo-200"
                        : "tw-border-indigo-600 tw-text-indigo-600 hover:tw-border-indigo-900 hover:tw-text-indigo-900"
                }`}
                disabled={choosenTime.includes("14:30") || time == "14:30"}
                onClick={() => handleOnClick("14:30")}
            >
                14:30
            </button>
            <button
                className={`tw-border tw-p-1 tw-rounded ${
                    choosenTime.includes("14:45") || time == "14:45"
                        ? "tw-border-indigo-200 tw-text-indigo-200"
                        : "tw-border-indigo-600 tw-text-indigo-600 hover:tw-border-indigo-900 hover:tw-text-indigo-900"
                }`}
                disabled={choosenTime.includes("14:45") || time == "14:45"}
                onClick={() => handleOnClick("14:45")}
            >
                14:45
            </button>

            <button
                className={`tw-border tw-p-1 tw-rounded ${
                    choosenTime.includes("15:00") || time == "15:00"
                        ? "tw-border-indigo-200 tw-text-indigo-200"
                        : "tw-border-indigo-600 tw-text-indigo-600 hover:tw-border-indigo-900 hover:tw-text-indigo-900"
                }`}
                disabled={choosenTime.includes("15:00") || time == "15:00"}
                onClick={() => handleOnClick("15:00")}
            >
                15:00
            </button>
            <button
                className={`tw-border tw-p-1 tw-rounded ${
                    choosenTime.includes("15:15") || time == "15:15"
                        ? "tw-border-indigo-200 tw-text-indigo-200"
                        : "tw-border-indigo-600 tw-text-indigo-600 hover:tw-border-indigo-900 hover:tw-text-indigo-900"
                }`}
                disabled={choosenTime.includes("15:15") || time == "15:15"}
                onClick={() => handleOnClick("15:15")}
            >
                15:15
            </button>
            <button
                className={`tw-border tw-p-1 tw-rounded ${
                    choosenTime.includes("15:30") || time == "15:30"
                        ? "tw-border-indigo-200 tw-text-indigo-200"
                        : "tw-border-indigo-600 tw-text-indigo-600 hover:tw-border-indigo-900 hover:tw-text-indigo-900"
                }`}
                disabled={choosenTime.includes("15:30") || time == "15:30"}
                onClick={() => handleOnClick("15:30")}
            >
                15:30
            </button>
            <button
                className={`tw-border tw-p-1 tw-rounded ${
                    choosenTime.includes("15:45") || time == "15:45"
                        ? "tw-border-indigo-200 tw-text-indigo-200"
                        : "tw-border-indigo-600 tw-text-indigo-600 hover:tw-border-indigo-900 hover:tw-text-indigo-900"
                }`}
                disabled={choosenTime.includes("15:45") || time == "15:45"}
                onClick={() => handleOnClick("15:45")}
            >
                15:45
            </button>
        </div>
    );
};

export default TimePicker;
