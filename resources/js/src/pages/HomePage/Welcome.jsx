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

const Welcome = ({ handleCallbackOpen }) => {
    const [filteredSearch, setFilteredSearch] = useState([]);
    const [searchShow, setSearchShow] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [currentRatings, setCurrentRatings] = useState(0);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        let _filteredSearch = data.map((data) => ({
            category: data.category,
            items: data.items.filter((item) =>
                item.question.toLowerCase().includes(searchText.toLowerCase())
            ),
        }));
        //console.log(_filteredSearch);
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
        await axios.post("/api/rating", { category, question, rating });
        setCurrentRatings(0);
    };

    return (
        <>
            <TicketsDialog open={open} handleClose={handleClose} />
            <div className="tw-p-5 tw-h-full">
                <div className="tw-grid md:tw-grid-cols-3 tw-gap-4 tw-h-full tw-items-center">
                    <div className="md:tw-col-span-2 tw-p-4">
                        <div className="tw-mb-10">
                            <h1 className="tw-text-6xl tw-font-bold tw-text-indigo-950">
                                Hello!
                            </h1>
                            <div className="tw-text-slate-600">
                                <p className="tw-text-2xl tw-font-semibold tw-mb-1">
                                    Welcome to Tritek Live Support
                                </p>
                                <p className="tw-text-2xl tw-font-semibold tw-mb-1">
                                    We are available Monday - Friday 9am -4pm
                                </p>
                                <p className="tw-text-2xl tw-font-semibold">
                                    You can explore our various communication
                                    channels to assist with your
                                </p>
                            </div>
                        </div>
                        <div className="tw-my-4 tw-block md:tw-hidden">
                            <div className="tw-bg-teal-50 tw-shadow-lg tw-rounded-lg tw-w-full tw-mb-4 ">
                                <div className="tw-mb-2">
                                    <img
                                        src="/images/chatagent.png"
                                        alt="chat with an agent"
                                        width={130}
                                        className="tw-m-auto"
                                    />
                                </div>
                                <div className="tw-pb-5 tw-flex">
                                    <button className="tw-p-4 tw-font-semibold tw-text-sm tw-bg-indigo-500 hover:tw-bg-indigo-700 tw-text-white tw-rounded-md tw-shadow-lg tw-m-auto tw-self-center tw-w-48">
                                        Chat with an agent
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
                                    <button className="tw-p-4 tw-font-semibold tw-text-sm tw-bg-indigo-500 hover:tw-bg-indigo-700 tw-text-white tw-rounded-md tw-shadow-lg tw-m-auto tw-self-center tw-w-48">
                                        Join Live call
                                    </button>
                                </div>
                            </div>
                            <div className="tw-bg-sky-50 tw-shadow-lg tw-rounded-lg tw-w-full tw-mb-4">
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
                                        onClick={handleCallbackOpen}
                                    >
                                        Book a call back
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="tw-my-8 ">
                            <div className="tw-flex tw-justify-between tw-mb-2 tw-px-4">
                                <div className="">
                                    <h2 className="tw-text-xl md:tw-text-2xl tw-font-semibold ">
                                        Frequently Asked Questions
                                    </h2>
                                </div>
                                <div className="">
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
                                                                            <p className="tw-mx-4">
                                                                                How
                                                                                useful
                                                                                was
                                                                                this?
                                                                            </p>
                                                                            <Rating
                                                                                name="rating"
                                                                                value={
                                                                                    currentRatings
                                                                                }
                                                                                onChange={(
                                                                                    event,
                                                                                    newValue
                                                                                ) => {
                                                                                    setCurrentRatings(
                                                                                        newValue
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

                        <div className="tw-p-4">
                            <div className="tw-w-[32rem]">
                                <h5 className="tw-text-xl tw-font-medium">
                                    Still unable to find answers to your
                                    enquiry? You can raise a ticket and one of
                                    our
                                </h5>
                            </div>
                            <div className="tw-pb-5 tw-fle">
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
                                    src="/images/chatagent.png"
                                    alt="chat with an agent"
                                    width={130}
                                    className="tw-m-auto"
                                />
                            </div>
                            <div className="tw-pb-5 tw-flex">
                                <button className="tw-p-4 tw-font-semibold tw-text-sm tw-bg-indigo-500 hover:tw-bg-indigo-700 tw-text-white tw-rounded-md tw-shadow-lg tw-m-auto tw-self-center tw-w-48">
                                    Chat with an agent
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
                                <button className="tw-p-4 tw-font-semibold tw-text-sm tw-bg-indigo-500 hover:tw-bg-indigo-700 tw-text-white tw-rounded-md tw-shadow-lg tw-m-auto tw-self-center tw-w-48">
                                    Join Live call
                                </button>
                            </div>
                        </div>
                        <div className="tw-bg-sky-50 tw-shadow-lg tw-rounded-lg tw-w-full tw-mb-4">
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
                                    onClick={handleCallbackOpen}
                                >
                                    Book a call back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Welcome;
