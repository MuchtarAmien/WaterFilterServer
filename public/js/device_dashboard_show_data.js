const currentDate = new Date().toISOString();
const lastWeek = new Date(
    new Date().setDate(new Date().getDate() - 7)
).toISOString();
const lastMonth = new Date(
    new Date().setDate(new Date().getDate() - 30)
).toISOString();
const monitor_ph = [];
const monitor_tds = [];
const monior_kekeruhan = [];
const datetime = [];

function renderGraph({ id, seriesName, seriesData, labels }) {
    let chart;
    const chartOption = {
        // enable and customize data labels using the following example, learn more from here: https://apexcharts.com/docs/datalabels/
        dataLabels: {
            enabled: true,
            // offsetX: 10,
            style: {
                cssClass: "text-xs text-white font-medium",
            },
        },
        grid: {
            show: false,
            strokeDashArray: 4,
            padding: {
                left: 16,
                right: 16,
                top: -26,
            },
        },
        series: [
            {
                name: seriesName,
                data: seriesData,
                color: "#7E3BF2",
            },
        ],
        chart: {
            height: "100%",
            maxWidth: "100%",
            type: "area",
            fontFamily: "Inter, sans-serif",
            dropShadow: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        tooltip: {
            enabled: true,
            x: {
                show: false,
            },
        },
        legend: {
            show: true,
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
                shade: "#1C64F2",
                gradientToColors: ["#1C64F2"],
            },
        },
        stroke: {
            width: 6,
        },
        xaxis: {
            categories: labels,
            labels: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
    };

    document.getElementById(id).textContent = "";
    if (document.getElementById(id) && typeof ApexCharts !== "undefined") {
        chart = new ApexCharts(document.getElementById(id), chartOption);
        chart.render();
    }
}

function showData(data) {
    monitor_ph.length = 0;
    monitor_tds.length = 0;
    monior_kekeruhan.length = 0;
    datetime.length = 0;
    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        monitor_ph.push(d?.monitor_ph);
        monitor_tds.push(d?.monitor_tds);
        monior_kekeruhan.push(d?.monior_kekeruhan);
        datetime.push(days(d?.createdAt));
    }

    renderGraph({
        id: "chart-tds",
        seriesName: "PPM",
        seriesData: monitor_tds,
        labels: datetime,
    });

    renderGraph({
        id: "chart-ph",
        seriesName: "PH",
        seriesData: monitor_ph,
        labels: datetime,
    });

    renderGraph({
        id: "chart-turbidity",
        seriesName: "BTU",
        seriesData: monior_kekeruhan,
        labels: datetime,
    });
}

document.addEventListener("userChangeDevice", (e) => {
    const finalUrl = `/api/v1/device/history?kode_unik=${e.detail?.data?.kode_unik}&tanggal_akhir=${currentDate}&tanggal_awal=${lastWeek}`;
    generalDataLoader({
        url: finalUrl,
        func: showData,
    });
});
