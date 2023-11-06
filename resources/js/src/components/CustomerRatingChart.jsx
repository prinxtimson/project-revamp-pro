import { useEffect, useState } from "react";
import { Chart } from "primereact/chart";

const CustomerRatingChart = ({ feedbacks }) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

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

    return (
        <Chart
            type="pie"
            data={chartData}
            options={chartOptions}
            className="tw-min-w-full tw-min-h-full"
        />
    );
};

export default CustomerRatingChart;
