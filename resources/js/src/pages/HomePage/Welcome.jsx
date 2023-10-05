import { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleIcon from "@mui/icons-material/AddCircleOutline";

import data from "../../../faq.json";
import TicketsDialog from "../../components/TicketsDialog";
import axios from "axios";
import RequestLivecallDialog from "../../components/RequestLivecallDialog";
import ResponseDialog from "../../components/ResponseDialog";
import OfflineDialog from "../../components/OfflineDialog";
import { setAlert } from "../../actions/alert";
import { leaveLivecall } from "../../actions/livecall";
import { connect } from "react-redux";

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.black, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));

const Welcome = ({
    handleCallbackOpen,
    setAlert,
    livecall,
    leaveLivecall,
    alert,
}) => {
    const [filteredSearch, setFilteredSearch] = useState([]);
    const [searchShow, setSearchShow] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [currentRatings, setCurrentRatings] = useState({});
    const [open, setOpen] = useState(false);
    const [openLivecall, setOpenLivecall] = useState(false);
    const [openRes, setOpenRes] = useState(false);
    const [openOffline, setOpenOffline] = useState(false);
    const [resMessage, setResMessage] = useState("");
    const [ratingSuccessful, setRatingSuccessful] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOfflineOpen = () => {
        setOpenOffline(true);
    };

    const handleOfflineClose = () => {
        setOpenOffline(false);
    };

    const handleOpenRes = (msg) => {
        setOpenRes(true);
        setResMessage(msg);
    };

    const handleCloseRes = () => {
        setOpenRes(false);
        setResMessage("");
        handleCloseLivecall();
        leaveLivecall(livecall?.id);
    };

    const handleOpenLivecall = () => {
        let isOnline = checkAvailability();
        if (isOnline) {
            setOpenLivecall(true);
        } else {
            handleOfflineOpen();
        }
    };

    const handleCloseLivecall = () => {
        setOpenRes(false);
        setOpenLivecall(false);
    };

    const handleChatWithLiveAgent = () => {
        let isOnline = checkAvailability();
        if (isOnline) {
            let tawkDiv = document.getElementsByClassName("widget-visible")[0];
            let tawkFrame = tawkDiv.getElementsByTagName("iframe")[0];
            let tawkBtn =
                tawkFrame.contentWindow.document.getElementsByClassName(
                    "tawk-button"
                )[0];

            tawkBtn.click();
            let tawkBtnContainer =
                tawkFrame.contentWindow.document.getElementsByClassName(
                    "tawk-min-container"
                )[0];
            if (tawkBtnContainer.style.display == "none") {
                tawkBtnContainer.style.display = "block";
            }
            tawkBtnContainer.addEventListener("click", () => {
                let tawkDiv =
                    document.getElementsByClassName("widget-visible")[0];
                let tawkFrame = tawkDiv.getElementsByTagName("iframe")[0];
                let tawkBtnContainer =
                    tawkFrame.contentWindow.document.getElementsByClassName(
                        "tawk-min-container"
                    )[0];
                if (tawkBtnContainer.style.display == "block") {
                    tawkBtnContainer.style.display = "none";
                }
            });
        } else {
            handleOfflineOpen();
        }
    };

    useEffect(() => {
        let _filteredSearch = data.map((data) => ({
            category: data.category,
            items: data.items.filter((item) =>
                item.question.toLowerCase().includes(searchText.toLowerCase())
            ),
        }));

        _filteredSearch = _filteredSearch.filter(
            (value) => value.items.length > 0
        );
        setFilteredSearch(_filteredSearch);

        if (searchText === "") {
            setSearchShow(false);
        } else {
            setSearchShow(true);
        }

        return () => setFilteredSearch([]);
    }, [searchText]);

    const handleOnRatingClick = async (category, question, rating) => {
        const res = await axios.post("/api/rating", {
            category,
            question,
            rating,
        });
        if (res.status == 200) {
            setRatingSuccessful(true);
            setTimeout(() => {
                setCurrentRatings({});
                setRatingSuccessful(false);
            }, 3000);
        }
    };

    const checkAvailability = () => {
        let _date = new Date();
        if (
            OPENINGDAYS.includes(DAYS[_date.getDay()]) &&
            _date.getHours() >= 9 &&
            _date.getHours() <= 21
        ) {
            return true;
        }
        return false;
    };

    return (
        <>
            <TicketsDialog open={open} handleClose={handleClose} />
            <RequestLivecallDialog
                open={openLivecall}
                handleClose={handleCloseLivecall}
                handleOpenRes={handleOpenRes}
            />
            <ResponseDialog
                open={openRes}
                handleClose={handleCloseRes}
                handleOpenCallback={handleCallbackOpen}
                message={resMessage}
            />
            <OfflineDialog
                open={openOffline}
                handleClose={handleOfflineClose}
            />
            <div className="tw-p-2 md:tw-p-4 tw-h-full">
                <div className="md:tw-grid md:tw-grid-cols-3 tw-gap-4 tw-h-full tw-items-center">
                    <div className="md:tw-col-span-2 tw-p-2">
                        <div className="tw-mb-8 tw-p-4 tw-shadow-md tw-bg-amber-100 tw-rounded-md">
                            <h1 className="tw-text-3xl md:tw-text-6xl tw-font-bold tw-text-indigo-950">
                                Hello!
                            </h1>
                            <div className="tw-text-slate-600">
                                <p className="tw-text-xl md:tw-text-2xl tw-font-semibold tw-mb-1">
                                    Welcome to Tritek Live Support
                                </p>
                                <p className="tw-text-xl md:tw-text-2xl tw-font-semibold tw-mb-1">
                                    We are available Monday - Friday 9am - 4pm
                                </p>
                                <p className="tw-text-xl md:tw-text-2xl tw-font-semibold">
                                    You can explore our various communication
                                    channels to assist with your query
                                </p>
                            </div>
                        </div>
                        <div className="tw-my-4 tw-block md:tw-hidden">
                            <div className="tw-bg-teal-50 tw-shadow-lg tw-rounded-lg tw-w-full tw-mb-4 ">
                                <div className="tw-mb-2">
                                    <img
                                        src="/images/callback.png"
                                        alt="Book a call back"
                                        width={130}
                                        className="tw-m-auto"
                                    />
                                </div>
                                <div className="tw-pb-5 tw-flex">
                                    <button
                                        className="tw-p-4 tw-font-semibold tw-text-sm tw-bg-indigo-500 hover:tw-bg-indigo-700 tw-text-white tw-rounded-md tw-shadow-lg tw-m-auto tw-self-center tw-w-48"
                                        onClick={handleChatWithLiveAgent}
                                    >
                                        Chat with Agent
                                    </button>
                                </div>
                            </div>
                            <div className="tw-bg-cyan-50 tw-shadow-lg tw-rounded-lg tw-w-full tw-mb-4">
                                <div className="tw-mb-2">
                                    <img
                                        src="/images/livecall.png"
                                        alt="Live Call"
                                        width={200}
                                        className="tw-m-auto"
                                    />
                                </div>
                                <div className="tw-pb-5 tw-flex">
                                    <button
                                        className="tw-p-4 tw-font-semibold tw-text-sm tw-bg-indigo-500 hover:tw-bg-indigo-700 tw-text-white tw-rounded-md tw-shadow-lg tw-m-auto tw-self-center tw-w-48"
                                        onClick={handleOpenLivecall}
                                    >
                                        Join Live Call
                                    </button>
                                </div>
                            </div>
                            <div className="tw-bg-sky-50 tw-shadow-lg tw-rounded-lg tw-w-full tw-mb-4">
                                <div className="tw-mb-2">
                                    <img
                                        src="/images/chatagent.png"
                                        alt="chat with an agent"
                                        width={130}
                                        className="tw-m-auto"
                                    />
                                </div>
                                <div className="tw-pb-5 tw-flex">
                                    <button
                                        className="tw-p-4 tw-font-semibold tw-text-sm tw-bg-indigo-500 hover:tw-bg-indigo-700 tw-text-white tw-rounded-md tw-shadow-lg tw-m-auto tw-self-center tw-w-48"
                                        onClick={handleCallbackOpen}
                                    >
                                        Book a Call Back
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="tw-p-2 md:tw-p-4 tw-block md:tw-hidden">
                            <div className="">
                                <h5 className="tw-text-xl tw-font-medium">
                                    Still unable to find answers to your
                                    enquiry? You can raise a ticket and one of
                                    our support agents will get back to you as
                                    soon as possible.
                                </h5>
                            </div>
                            <div className="tw-pb-5 ">
                                <button
                                    className="tw-p-4 tw-font-semibold tw-text-sm tw-bg-indigo-500 hover:tw-bg-indigo-700 tw-text-white tw-rounded-md tw-shadow-lg tw-m-auto tw-self-cente tw-w-48"
                                    onClick={handleClickOpen}
                                >
                                    Raise a Ticket
                                </button>
                            </div>
                        </div>
                        <div className="tw-my-8 ">
                            <div className="md:tw-flex tw-justify-between tw-mb-2 md:tw-px-4">
                                <div className="tw-mb-4 md:tw-mb-2">
                                    <h2 className="tw-text-xl md:tw-text-2xl tw-font-semibold ">
                                        Frequently Asked Questions
                                    </h2>
                                </div>
                                <div className="tw-mb-4 md:tw-mb-2">
                                    <Search>
                                        <SearchIconWrapper>
                                            <SearchIcon />
                                        </SearchIconWrapper>
                                        <StyledInputBase
                                            placeholder="Search…"
                                            inputProps={{
                                                "aria-label": "search",
                                            }}
                                            value={searchText}
                                            onChange={(e) =>
                                                setSearchText(e.target.value)
                                            }
                                            //onFocus={() => setSearchShow(true)}
                                        />
                                    </Search>
                                </div>
                            </div>

                            <div className="">
                                {searchShow ? (
                                    <div>
                                        <div className="tw-px-4">
                                            <h2 className="tw-text-lg md:tw-text-xl tw-font-semibold tw-text-gray-400">
                                                Search Results
                                            </h2>
                                        </div>
                                        <div className="tw-w-full tw-h-72 tw-bg-white tw-overflow-auto tw-p-5">
                                            {filteredSearch.length == 0 && (
                                                <div className="tw-mb-2 tw-py-2 tw-divide-y tw-divide-slate-700">
                                                    <div className="">
                                                        <p className="tw-text-xl">
                                                            No FAQ found
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {filteredSearch.map(
                                                (value, key) => (
                                                    <div
                                                        className="tw-mb-2 tw-py-2 tw-divide-y tw-divide-slate-700"
                                                        key={key}
                                                    >
                                                        <div className="tw-text-gray-500 tw-border-b">
                                                            <h3 className="tw-text-lg tw-font-semibold">
                                                                Category:{" "}
                                                                {value.category}
                                                            </h3>
                                                        </div>
                                                        <div className="">
                                                            <List
                                                                sx={{
                                                                    width: "100%",
                                                                    bgcolor:
                                                                        "background.paper",
                                                                }}
                                                            >
                                                                {value.items.map(
                                                                    (
                                                                        item,
                                                                        id
                                                                    ) => (
                                                                        <ListItem
                                                                            alignItems="flex-start"
                                                                            key={
                                                                                id
                                                                            }
                                                                        >
                                                                            <ListItemText
                                                                                primary={
                                                                                    item.question
                                                                                }
                                                                                secondary={
                                                                                    <span
                                                                                        dangerouslySetInnerHTML={{
                                                                                            __html: item.answer,
                                                                                        }}
                                                                                    ></span>
                                                                                }
                                                                            />
                                                                        </ListItem>
                                                                    )
                                                                )}
                                                            </List>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="tw-min-h-[208px]">
                                        {data.map((value, key) => (
                                            <Accordion key={key}>
                                                <AccordionSummary
                                                    expandIcon={
                                                        <AddCircleIcon />
                                                    }
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header"
                                                >
                                                    <h3 className="tw-text-lg tw-font-semibold">
                                                        {value.category}
                                                    </h3>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    {value.items
                                                        .sort((a, b) => {
                                                            let total_a =
                                                                a.ratings.reduce(
                                                                    (_a, _b) =>
                                                                        _a + _b,
                                                                    0
                                                                );
                                                            let total_b =
                                                                b.ratings.reduce(
                                                                    (_a, _b) =>
                                                                        _a + _b,
                                                                    0
                                                                );
                                                            return (
                                                                total_b -
                                                                total_a
                                                            );
                                                        })
                                                        .map((val, id) => (
                                                            <Accordion key={id}>
                                                                <AccordionSummary
                                                                    expandIcon={
                                                                        <ExpandMoreIcon />
                                                                    }
                                                                    aria-controls="panel1a-content"
                                                                    id="panel1a-header"
                                                                >
                                                                    <h4 className="tw-text-base tw-font-medium">
                                                                        {
                                                                            val.question
                                                                        }
                                                                    </h4>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <div className="">
                                                                        <div
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: val.answer,
                                                                            }}
                                                                        ></div>
                                                                    </div>
                                                                    <div className="tw-float-right">
                                                                        <div className="tw-flex">
                                                                            {ratingSuccessful &&
                                                                                currentRatings.key ==
                                                                                    key &&
                                                                                currentRatings.id ==
                                                                                    id && (
                                                                                    <div className="tw-mx-2 tw-text-green-500">
                                                                                        <span>
                                                                                            <i className="pi pi-check-circle"></i>
                                                                                        </span>{" "}
                                                                                        <span>
                                                                                            rating
                                                                                            received
                                                                                        </span>
                                                                                    </div>
                                                                                )}

                                                                            <p className="tw-mx-4">
                                                                                How
                                                                                useful
                                                                                was
                                                                                this?
                                                                            </p>
                                                                            <Rating
                                                                                name="rating"
                                                                                value={
                                                                                    currentRatings.key ==
                                                                                        key &&
                                                                                    currentRatings.id ==
                                                                                        id
                                                                                        ? currentRatings.newValue
                                                                                        : 0
                                                                                }
                                                                                onChange={(
                                                                                    event,
                                                                                    newValue
                                                                                ) => {
                                                                                    setCurrentRatings(
                                                                                        {
                                                                                            key,
                                                                                            id,
                                                                                            newValue,
                                                                                        }
                                                                                    );
                                                                                    handleOnRatingClick(
                                                                                        key,
                                                                                        id,
                                                                                        newValue
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </AccordionDetails>
                                                            </Accordion>
                                                        ))}
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="tw-p-4 tw-hidden md:tw-block">
                            <div className="tw-w-[32rem]">
                                <h5 className="tw-text-xl tw-font-medium">
                                    Still unable to find answers to your
                                    enquiry? You can raise a ticket and one of
                                    our support agents will get back to you as
                                    soon as possible.
                                </h5>
                            </div>
                            <div className="tw-pb-2 ">
                                <button
                                    className="tw-p-4 tw-font-semibold tw-text-sm tw-bg-indigo-500 hover:tw-bg-indigo-700 tw-text-white tw-rounded-md tw-shadow-lg tw-m-auto tw-self-cente tw-w-48"
                                    onClick={handleClickOpen}
                                >
                                    Raise a Ticket
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="tw-p-2 tw-hidden md:tw-block">
                        <div className="tw-bg-teal-50 tw-shadow-lg tw-rounded-lg tw-w-full tw-mb-4 ">
                            <div className="tw-mb-2">
                                <img
                                    src="/images/callback.png"
                                    alt="Book a call back"
                                    width={130}
                                    className="tw-m-auto"
                                />
                            </div>
                            <div className="tw-pb-5 tw-flex">
                                <button
                                    className="tw-p-4 tw-font-semibold tw-text-sm tw-bg-indigo-500 hover:tw-bg-indigo-700 tw-text-white tw-rounded-md tw-shadow-lg tw-m-auto tw-self-center tw-w-48"
                                    onClick={handleChatWithLiveAgent}
                                >
                                    Chat with an Agent
                                </button>
                            </div>
                        </div>
                        <div className="tw-bg-cyan-50 tw-shadow-lg tw-rounded-lg tw-w-full tw-mb-4">
                            <div className="tw-mb-2">
                                <img
                                    src="/images/livecall.png"
                                    alt="Live Call"
                                    width={200}
                                    className="tw-m-auto"
                                />
                            </div>
                            <div className="tw-pb-5 tw-flex">
                                <button
                                    className="tw-p-4 tw-font-semibold tw-text-sm tw-bg-indigo-500 hover:tw-bg-indigo-700 tw-text-white tw-rounded-md tw-shadow-lg tw-m-auto tw-self-center tw-w-48"
                                    onClick={handleOpenLivecall}
                                >
                                    Join Live Call
                                </button>
                            </div>
                        </div>
                        <div className="tw-bg-sky-50 tw-shadow-lg tw-rounded-lg tw-w-full tw-mb-4">
                            <div className="tw-mb-2">
                                <img
                                    src="/images/chatagent.png"
                                    alt="chat with an agent"
                                    width={130}
                                    className="tw-m-auto"
                                />
                            </div>
                            <div className="tw-pb-5 tw-flex">
                                <button
                                    className="tw-p-4 tw-font-semibold tw-text-sm tw-bg-indigo-500 hover:tw-bg-indigo-700 tw-text-white tw-rounded-md tw-shadow-lg tw-m-auto tw-self-center tw-w-48"
                                    onClick={handleCallbackOpen}
                                >
                                    Book a Call Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    livecall: state.livecall.livecall,
    alert: state.alert,
});

export default connect(mapStateToProps, { setAlert, leaveLivecall })(Welcome);

const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const OPENINGDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
