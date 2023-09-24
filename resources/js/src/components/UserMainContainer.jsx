import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleIcon from "@mui/icons-material/AddCircleOutline";

import data from "../../faq.json";

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

const UserMainContainer = ({ children }) => {
    const [currentRatings, setCurrentRatings] = useState(0);
    return (
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
                                <button className="tw-p-4 tw-font-semibold tw-text-sm tw-bg-indigo-500 hover:tw-bg-indigo-700 tw-text-white tw-rounded-md tw-shadow-lg tw-m-auto tw-self-center tw-w-48">
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
                                        inputProps={{ "aria-label": "search" }}
                                    />
                                </Search>
                            </div>
                        </div>

                        <div className="">
                            <div className="">
                                {data.map((value, key) => (
                                    <Accordion key={key}>
                                        <AccordionSummary
                                            expandIcon={<AddCircleIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <h3 className="tw-text-lg tw-font-semibold">
                                                {value.category}
                                            </h3>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {value.item.map((val, id) => (
                                                <Accordion key={id}>
                                                    <AccordionSummary
                                                        expandIcon={
                                                            <ExpandMoreIcon />
                                                        }
                                                        aria-controls="panel1a-content"
                                                        id="panel1a-header"
                                                    >
                                                        <h4 className="tw-text-base tw-font-medium">
                                                            {val.question}
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
                                                                    How useful
                                                                    was this?
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
                                                                        let faqData =
                                                                            data;
                                                                        let currentCat =
                                                                            value;
                                                                        let currentFaq =
                                                                            val;
                                                                        currentFaq.ratings.push(
                                                                            newValue
                                                                        );
                                                                        currentCat.item.splice(
                                                                            id,
                                                                            1,
                                                                            currentFaq
                                                                        );
                                                                        faqData.splice(
                                                                            key,
                                                                            1,
                                                                            currentCat
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
                        </div>
                    </div>

                    <div className="tw-p-4">
                        <div className="tw-w-[32rem]">
                            <h5 className="tw-text-xl tw-font-medium">
                                Still unable to find answers to your enquiry?
                                You can raise a ticket and one of our
                            </h5>
                        </div>
                        <div className="tw-pb-5 tw-fle">
                            <button className="tw-p-4 tw-font-semibold tw-text-sm tw-bg-indigo-500 hover:tw-bg-indigo-700 tw-text-white tw-rounded-md tw-shadow-lg tw-m-auto tw-self-cente tw-w-48">
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
                            <button className="tw-p-4 tw-font-semibold tw-text-sm tw-bg-indigo-500 hover:tw-bg-indigo-700 tw-text-white tw-rounded-md tw-shadow-lg tw-m-auto tw-self-center tw-w-48">
                                Book a call back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserMainContainer;
