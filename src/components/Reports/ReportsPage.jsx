import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar, Line, Doughnut, Pie } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function Reports() {

    const reportRef = useRef();

    const downloadPDF = () => {
        const input = reportRef.current;

        const header = document.getElementById("pdfHeader");
        header.style.display = "block"; // show temporarily

        html2canvas(input).then((canvas) => {

            header.style.display = "none"; // hide again

            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");

            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save("Waste_Management_Report.pdf");
        });
    };

    const todayDate = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const collectionsToday = {
        labels: ["Zone A", "Zone B", "Zone C", "Zone D"],
        datasets: [
            {
                label: "Collections Today",
                data: [30, 45, 28, 50],
                backgroundColor: "#48A111"
            }
        ]
    };

    const binStatus = {
        labels: ["Full", "Half", "Empty"],
        datasets: [
            {
                data: [25, 40, 35],
                backgroundColor: ["#25671E", "#FFB84C", "#c62f39"]
            }
        ]
    };

    const weeklyWaste = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
            {
                label: "Waste Collected (kg)",
                data: [120, 150, 180, 140, 200, 170, 210],
                borderColor: "#25671E",
                tension: 0.4
            }
        ]
    };

    const frequentBins = {
        labels: ["Bin 12", "Bin 45", "Bin 33", "Bin 27", "Bin 18"],
        datasets: [
            {
                label: "Collections",
                data: [15, 20, 12, 18, 14],
                backgroundColor: "#4CAF50"
            }
        ]
    };

    const zoneWaste = {
        labels: ["North", "South", "East", "West"],
        datasets: [
            {
                data: [320, 280, 400, 350],
                backgroundColor: ["#145A32", "#4CAF50", "#5BC060", "#A5D6A7"]
            }
        ]
    };

    const cardStyle = {
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: "10px",
        padding: "20px",
        height: "320px"
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false
    };

    return (
        <div style={{ marginTop: "5rem", marginLeft: "16rem", padding: "20px" }}>

            {/* Download Button */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem"
                }}
            >
                <h4 style={{ color: "#25671E", margin: 0 }}>
                    Waste Management Reports
                </h4>

                <button
                    onClick={downloadPDF}
                    style={{
                        padding: "8px 16px",
                        border: "none",
                        background: "#25671E",
                        color: "#fff",
                        borderRadius: "6px",
                        cursor: "pointer"
                    }}
                >
                    <icon className="fas fa-download" style={{ marginRight: "8px" }}></icon>
                    Download PDF
                </button>
            </div>

            {/* REPORT CONTENT */}
            <div ref={reportRef}>
                <div style={{ marginBottom: "15px", display: "none" }} id="pdfHeader">
                    <h2>Waste Management Reports</h2>
                    <p>Date: {todayDate}</p>
                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
                        gap: "20px"
                    }}
                >

                    <div style={cardStyle}>
                        <h6>Collections Today</h6>
                        <div style={{ height: "250px" }}>
                            <Bar data={collectionsToday} options={chartOptions} />
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h6>Bin Status Distribution</h6>
                        <div style={{ height: "250px" }}>
                            <Pie data={binStatus} options={chartOptions} />
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h6>Weekly Waste Trend</h6>
                        <div style={{ height: "250px" }}>
                            <Line data={weeklyWaste} options={chartOptions} />
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h6>Most Frequently Emptied Bins</h6>
                        <div style={{ height: "250px" }}>
                            <Bar data={frequentBins} options={chartOptions} />
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h6>Zone Wise Waste Collection</h6>
                        <div style={{ height: "250px" }}>
                            <Doughnut data={zoneWaste} options={chartOptions} />
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Reports;