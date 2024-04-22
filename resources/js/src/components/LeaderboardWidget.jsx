import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { BsGear } from "react-icons/bs";
import { ProgressBar } from "primereact/progressbar";

const LeaderboardWidget = ({ handleOnRemoveWidget }) => {
    const [agents, setAgents] = useState([]);
    const settingMenuRef = useRef();
    const menuRef = useRef();

    const { users } = useSelector((state) => state.profile);
    const { feedbacks } = useSelector((state) => state.feedback);

    useEffect(() => {
        if (users) {
            setAgents(
                users.data.filter((item) => item.roles[0].name == "agent")
            );
        }
    }, [users]);

    const MENUMODEL = [
        {
            label: "Remove",
            command: () => {
                handleOnRemoveWidget("leaderboard");
            },
        },
    ];

    return (
        <div className="tw-border tw-rounded tw-p-4 tw-bg-white  tw-shadow-md tw-overflow-hidden">
            <div className="">
                <div className="tw-float-right tw-flex tw-items-center tw-gap-2">
                    <>
                        <a
                            href="#"
                            className=""
                            onClick={(e) => settingMenuRef.current?.toggle(e)}
                        >
                            <BsGear />
                        </a>
                        <Menu model={MENUMODEL} ref={settingMenuRef} popup />
                    </>

                    <>
                        <a
                            href="#"
                            className="tw-float-right"
                            onClick={(e) => menuRef.current?.toggle(e)}
                        >
                            <i className="pi pi-fw pi-download" />
                        </a>
                        <Menu model={LEADERBOARD} ref={menuRef} popup />
                    </>
                </div>

                <div className="tw-text-center">
                    <h2 className="tw-text-lg tw-font-semibold">Leaderboard</h2>
                </div>
            </div>

            <div className="tw-h-full tw-overflow-auto">
                {agents.map((agent) => (
                    <div
                        className="tw-p-2 tw-flex tw-items-center tw-gap-2 tw-border-b"
                        key={agent.id}
                    >
                        <div className="tw-flex tw-items-center">
                            <Avatar
                                image={agent.avatar}
                                className="tw-mr-2"
                                shape="circle"
                            />
                            <span>{agent.name}</span>
                        </div>
                        <div className="tw-grow">
                            <ProgressBar
                                value={
                                    feedbacks &&
                                    Math.round(
                                        feedbacks
                                            .filter(
                                                (item) =>
                                                    item.user_id == agent.id
                                            )
                                            .map(
                                                (item) =>
                                                    item.data
                                                        .map(
                                                            (val) => val.rating
                                                        )
                                                        ?.reduce(
                                                            (total, val) =>
                                                                total + val,
                                                            0
                                                        ) / 3
                                            )
                                            .reduce(
                                                (total, val) => total + val,
                                                0
                                            )
                                    )
                                }
                                style={{ height: "18px" }}
                            ></ProgressBar>
                        </div>
                        <div className="">
                            {feedbacks &&
                                Math.round(
                                    feedbacks
                                        .filter(
                                            (item) => item.user_id == agent.id
                                        )
                                        .map(
                                            (item) =>
                                                item.data
                                                    .map((val) => val.rating)
                                                    ?.reduce(
                                                        (total, val) =>
                                                            total + val,
                                                        0
                                                    ) / 3
                                        )
                                        ?.reduce((total, val) => total + val, 0)
                                )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeaderboardWidget;

const LEADERBOARD = [
    {
        label: "Excel",
        value: "xlsx",
        command: () => {
            window.open(`/leaderboard/report/download?type=xlsx`, "_blank");
        },
    },
    {
        label: "CSV",
        value: "csv",
        command: () => {
            window.open(`/leaderboard/report/download?type=csv`, "_blank");
        },
    },
    {
        label: "PDF",
        value: "pdf",
        command: () => {
            window.open(`/leaderboard/report/download?type=pdf`, "_blank");
        },
    },
];
