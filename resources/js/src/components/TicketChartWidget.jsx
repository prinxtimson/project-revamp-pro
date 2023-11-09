import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Menu } from "primereact/menu";
import { Chart } from "primereact/chart";
import { BsGear } from "react-icons/bs";

const TicketChartWidget = ({ handleOnRemoveWidget }) => {
    const menuRef = useRef();
    const settingMenuRef = useRef();
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const { summary } = useSelector((state) => state.ticket);

    useEffect(() => {
        if (summary) {
            const documentStyle = getComputedStyle(document.documentElement);

            let data = [];
            let labels = [];

            summary.map((item) => {
                labels.push(item.query_type);
                data.push(item.total);
            });

            setChartData({
                labels,
                datasets: [
                    {
                        label: "Ticket Raised",
                        data,
                        backgroundColor: [
                            documentStyle.getPropertyValue("--orange-500"),
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue("--orange-400"),
                        ],
                    },
                ],
            });

            const options = {
                maintainAspectRatio: false,
                aspectRatio: 1.2,
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                        },
                    },
                },
            };
            setChartOptions(options);
        }
    }, [summary]);

    const MENUMODEL = [
        {
            label: "Remove",
            command: () => {
                handleOnRemoveWidget("ticket_raised");
            },
        },
    ];

    return (
        <div className="tw-border tw-rounded tw-p-4 tw-bg-white tw-shadow-md tw-overflow-hidden">
            <div className="">
                <div className="tw-float-right tw-flex tw-items-center tw-gap-2">
                    <>
                        <a
                            href="#"
                            className="tw-float-right"
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
                        <Menu model={TICKETS} ref={menuRef} popup />
                    </>
                </div>

                <h2 className="tw-text-center tw-text-lg tw-font-semibold">
                    Ticket Raised Category
                </h2>
            </div>
            <div className="tw-h-full tw-overflow-auto">
                <Chart
                    type="bar"
                    data={chartData}
                    options={chartOptions}
                    className="tw-min-w-full "
                />
            </div>
        </div>
    );
};

export default TicketChartWidget;

const TICKETS = [
    {
        label: "Excel",
        value: "xlsx",
        command: () => {
            window.open(`/tickets/report/download?type=xlsx`, "_blank");
        },
    },
    {
        label: "CSV",
        value: "csv",
        command: () => {
            window.open(`/tickets/report/download?type=csv`, "_blank");
        },
    },
    {
        label: "PDF",
        value: "pdf",
        command: () => {
            window.open(`/tickets/report/download?type=pdf`, "_blank");
        },
    },
];
