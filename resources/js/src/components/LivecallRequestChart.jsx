import { useEffect, useState } from "react";
import { Chart } from "primereact/chart";

const LivecallRequestChart = ({ livecall }) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        if (livecall) {
            const documentStyle = getComputedStyle(document.documentElement);

            let data = [];
            let labels = [];

            livecall.map((item) => {
                labels.push(item.query_type);
                data.push(item.total);
            });

            setChartData({
                labels,
                datasets: [
                    {
                        label: "Livecall",
                        data,
                        backgroundColor: [
                            documentStyle.getPropertyValue("--blue-500"),
                            documentStyle.getPropertyValue("--green-500"),
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue("--blue-400"),
                            documentStyle.getPropertyValue("--green-400"),
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
    }, [livecall]);

    return (
        <Chart
            type="bar"
            data={chartData}
            options={chartOptions}
            className="tw-min-w-full "
        />
    );
};

export default LivecallRequestChart;
