import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Menu } from "primereact/menu";
import { Chart } from "primereact/chart";
import { BsGear } from "react-icons/bs";

const CustomerRatingChart = ({ handleOnRemoveWidget }) => {
    const menuRef = useRef();
    const settingMenuRef = useRef();
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const { feedbacks } = useSelector((state) => state.feedback);

    useEffect(() => {
        if (feedbacks) {
            const documentStyle = getComputedStyle(document.documentElement);
            let labels = [
                "Positive Review",
                "Negative Review",
                "Neutral Review",
            ];
            let positive = 0;
            let negative = 0;
            let neutral = 0;

            feedbacks.map((item) => {
                let rating =
                    item.data
                        .map((val) => val.rating)
                        ?.reduce((total, val) => total + val, 0) / 3;

                if (rating > 5) positive++;
                if (negative < 5) negative++;
                if (neutral == 5) neutral++;
            });

            setChartData({
                labels,
                datasets: [
                    {
                        label: "Reviews",
                        data: [positive, negative, neutral],
                        backgroundColor: [
                            documentStyle.getPropertyValue("--green-500"),
                            documentStyle.getPropertyValue("--red-500"),
                            documentStyle.getPropertyValue("--blue-500"),
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue("--green-400"),
                            documentStyle.getPropertyValue("--red-400"),
                            documentStyle.getPropertyValue("--blue-400"),
                        ],
                    },
                ],
            });

            const options = {
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
    }, [feedbacks]);

    const MENUMODEL = [
        {
            label: "Remove",
            command: () => {
                handleOnRemoveWidget("feedback");
            },
        },
    ];

    return (
        <div className="tw-border tw-rounded tw-p-4 tw-bg-white  tw-shadow-md tw-overflow-hidden">
            <div className="tw-text-center">
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
                        <Menu model={CSMODEL} ref={menuRef} popup />
                    </>
                </div>

                <h2 className="tw-text-lg tw-font-semibold">
                    Customer Satisfaction
                </h2>
            </div>
            <div className="tw-h-full tw-overflow-auto">
                <Chart
                    type="pie"
                    data={chartData}
                    options={chartOptions}
                    className="tw-min-w-full tw-min-h-full"
                />
            </div>
        </div>
    );
};

export default CustomerRatingChart;

const CSMODEL = [
    {
        label: "Excel",
        value: "xlsx",
        command: () => {
            window.open(`/customer-review/report/download?type=xlsx`, "_blank");
        },
    },
    {
        label: "CSV",
        value: "csv",
        command: () => {
            window.open(`/customer-review/report/download?type=csv`, "_blank");
        },
    },
    {
        label: "PDF",
        value: "pdf",
        command: () => {
            window.open(`/customer-review/report/download?type=pdf`, "_blank");
        },
    },
];
