import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
import { useSocket } from "../../context/SocketContext";

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
    const refs = {
        collections: useRef(),
        status: useRef(),
        weekly: useRef(),
        frequent: useRef(),
        zone: useRef(),
        efficiency: useRef()
    };

    const { bins, user } = useSocket();

    const todayDate = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const today = new Date().toDateString();

    // ----------------------- DATA PROCESSING -----------------------
    const collectionsMap = {};
    bins.forEach(bin => {
        const emptiedDate = new Date(bin.lastEmptied).toDateString();
        if (emptiedDate === today) {
            const zone = bin.zone || "Unknown";
            collectionsMap[zone] = (collectionsMap[zone] || 0) + 1;
        }
    });

    const collectionsToday = {
        labels: Object.keys(collectionsMap),
        datasets: [
            {
                label: "Collections Today",
                data: Object.values(collectionsMap),
                backgroundColor: "#48A111"
            }
        ]
    };

    const statusCount = { full: 0, half: 0, empty: 0 };
    bins.forEach(bin => {
        const fillPercent = (bin.currentFillLevel / bin.capacity) * 100;
        if (fillPercent >= 80) statusCount.full++;
        else if (fillPercent >= 40) statusCount.half++;
        else statusCount.empty++;
    });

    const binStatus = {
        labels: ["Full", "Half", "Empty"],
        datasets: [
            {
                data: [statusCount.full, statusCount.half, statusCount.empty],
                backgroundColor: ["#25671E", "#FFB84C", "#c62f39"]
            }
        ]
    };

    const weekMap = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    bins.forEach(bin => {
        const day = new Date(bin.lastEmptied).toLocaleDateString("en-IN", { weekday: "short" });
        weekMap[day] += bin.currentFillLevel;
    });

    const weeklyWaste = {
        labels: Object.keys(weekMap),
        datasets: [
            { label: "Waste Collected (kg)", data: Object.values(weekMap), borderColor: "#25671E", tension: 0.4 }
        ]
    };

    const freqMap = {};
    bins.forEach(bin => {
        freqMap[bin.binCode] = (freqMap[bin.binCode] || 0) + 1;
    });

    const sortedBins = Object.entries(freqMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const frequentBins = {
        labels: sortedBins.map(b => b[0]),
        datasets: [{ label: "Collections", data: sortedBins.map(b => b[1]), backgroundColor: "#4CAF50" }]
    };

    const zoneMap = {};
    bins.forEach(bin => {
        const zone = bin.zone || "Unknown";
        zoneMap[zone] = (zoneMap[zone] || 0) + bin.currentFillLevel;
    });
    const zoneWaste = {
        labels: Object.keys(zoneMap),
        datasets: [{ data: Object.values(zoneMap), backgroundColor: ["#145A32", "#4CAF50", "#5BC060", "#A5D6A7"] }]
    };

    const efficiencyMap = {};
    const countMap = {};
    bins.forEach(bin => {
        const zone = bin.zone || "Unknown";
        const fillPercent = (bin.currentFillLevel / bin.capacity) * 100;
        efficiencyMap[zone] = (efficiencyMap[zone] || 0) + fillPercent;
        countMap[zone] = (countMap[zone] || 0) + 1;
    });
    const efficiencyData = {
        labels: Object.keys(efficiencyMap),
        datasets: [
            {
                label: "Average Fill %",
                data: Object.keys(efficiencyMap).map(zone => (efficiencyMap[zone] / countMap[zone]).toFixed(1)),
                backgroundColor: "#145A32"
            }
        ]
    };

    const chartOptions = { responsive: true, maintainAspectRatio: false };
    const cardStyle = { background: "#fff", border: "1px solid #e5e5e5", borderRadius: "10px", padding: "20px", height: "320px", width: "100%", boxSizing: "border-box" };

    // ----------------------- PDF GENERATION -----------------------
    const downloadPDF = async () => {
        const pdf = new jsPDF();

        // Cover Page
        pdf.setFontSize(30);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor("#25671E");
        pdf.text("Waste Management System", 105, 40, { align: "center" });
        pdf.setFontSize(20);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor("#48A111");
        pdf.text("CleanTrack Reports", 105, 55, { align: "center" });
        pdf.setFontSize(14);
        pdf.setTextColor("#25671E");
        pdf.text("© Team Necrocoders", 105, 65, { align: "center" });

        pdf.setFontSize(11);
        pdf.setTextColor("#000");
        pdf.text(`Report Date: ${todayDate}`, 20, 90);
        pdf.text(`Generated By: ${user?.name || "N/A"}`, 20, 100);
        pdf.text(`User Email: ${user?.email || "N/A"}`, 20, 110);

        pdf.text("This report provides insights into waste collection efficiency,", 20, 130);
        pdf.text("bin utilization, and operational performance across zones.", 20, 138);
        pdf.text("Use the following pages to explore detailed charts and analysis.", 20, 146);

        // Graph Pages
        await addGraphPage(pdf, refs.collections, "Collections Today", generateCollectionsText(), addCollectionsTable);
        await addGraphPage(pdf, refs.status, "Bin Status Distribution", generateStatusText(), addStatusTable);
        await addGraphPage(pdf, refs.weekly, "Weekly Waste Trend", generateWeeklyText(), addWeeklyTable);
        await addGraphPage(pdf, refs.frequent, "Most Frequently Emptied Bins", generateFrequentText(), addFrequentTable);
        await addGraphPage(pdf, refs.zone, "Zone Wise Waste Collection", generateZoneText(), addZoneTable);
        await addGraphPage(pdf, refs.efficiency, "Bin Fill Efficiency", generateEfficiencyText(), addEfficiencyTable);

        pdf.save("CleanTrack_Report.pdf");
    };

    // const addGraphPage = async (pdf, ref, title, description, tableFunc) => {
    //     const canvas = await html2canvas(ref.current);
    //     const imgData = canvas.toDataURL("image/png");

    //     pdf.addPage();
    //     pdf.setFontSize(16);
    //     pdf.text(title, 10, 15);
    //     pdf.setDrawColor(200);
    //     pdf.line(10, 18, 200, 18);

    //     const imgWidth = (canvas.width * 88) / canvas.height; // scale width to keep ratio
    //     const imgHeight = 88; // 30% of A4 page height (295 mm)
    //     pdf.addImage(imgData, "PNG", 10, 25, imgWidth, imgHeight);

    //     pdf.setFontSize(11);
    //     pdf.text(description, 10, 25 + imgHeight + 10, { maxWidth: 180 });

    //     if (tableFunc) tableFunc(pdf, 25 + imgHeight + 30);
    // };

    // ----------------------- TEXT GENERATION -----------------------

    const addGraphPage = async (pdf, ref, title, description, tableFunc) => {
        const canvas = await html2canvas(ref.current);
        const imgData = canvas.toDataURL("image/png");

        pdf.addPage();

        pdf.setFontSize(16);
        pdf.text(title, 10, 15);
        pdf.setDrawColor(200);
        pdf.line(10, 18, 200, 18);

        // Graph dimensions
        const imgWidth = 80; // smaller width (left side)
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Draw the graph on the left
        pdf.addImage(imgData, "PNG", 10, 25, imgWidth, imgHeight);

        // Draw the description on the right
        pdf.setFontSize(11);
        const textX = 100; // start text on right side
        let textY = 28; // same top as graph

        // Split text into lines if too long
        const splitText = pdf.splitTextToSize(description, 90); // max width 90
        pdf.text(splitText, textX, textY);

        // Add table below the graph+text
        if (tableFunc) {
            const tableY = 25 + Math.max(imgHeight, splitText.length * 5) + 10;
            tableFunc(pdf, tableY);
        }
    };

    const generateCollectionsText = () => {
        let text = "This chart shows today's waste collection across zones.\n\n";
        let total = 0;
        Object.entries(collectionsMap).forEach(([zone, value]) => {
            total += value;
        });
        text += `Total Collections Today: ${total}\n\n`;
        // Object.entries(collectionsMap).forEach(([zone, value]) => {
        //     text += `Zone ${zone} recorded ${value} collections today.\n`;
        // });
        return text;
    };
    const generateStatusText = () => `Full Bins: ${statusCount.full}\nHalf Filled: ${statusCount.half}\nEmpty: ${statusCount.empty}`;
    const generateWeeklyText = () => {
        let totalWaste = 0;
        let highestDay = "";
        let lowestDay = "";
        let highestValue = -Infinity;
        let lowestValue = Infinity;

        Object.entries(weekMap).forEach(([day, value]) => {
            totalWaste += value;
            if (value > highestValue) {
                highestValue = value;
                highestDay = day;
            }
            if (value < lowestValue) {
                lowestValue = value;
                lowestDay = day;
            }
        });

        const averageWaste = (totalWaste / 7).toFixed(2);

        let text = "Weekly Waste Collection Overview:\n\n";
        text += `Total waste collected this week: ${totalWaste} kg\n`;
        text += `Average waste collected per day: ${averageWaste} kg\n`;
        text += `Highest collection day: ${highestDay} (${highestValue} kg)\n`;
        text += `Lowest collection day: ${lowestDay} (${lowestValue} kg)\n\n`;
        text += "Observation: Track collection trends to optimize routes and schedules for better efficiency.";

        return text;
    };
    const generateFrequentText = () => {
        let text = "Most Frequently Serviced Bins Overview:\n\n";

        if (sortedBins.length === 0) {
            text += "No bins have been serviced recently.";
            return text;
        }

        const totalCollections = sortedBins.reduce((sum, [, count]) => sum + count, 0);
        text += `Total collections among the top bins: ${totalCollections}\n\n`;

        text += "Top bins serviced most frequently:\n";
        sortedBins.forEach(([bin, count], index) => {
            text += `${index + 1}. Bin ${bin} was emptied ${count} times\n`;
        });

        text += "\nObservation: Bins with high service frequency indicate high traffic areas or limited capacity. Consider optimizing bin placement or collection schedule to improve efficiency.";
        return text;
    };
    const generateZoneText = () => {
        let text = "Zone-wise Waste Distribution Overview:\n\n";

        const zones = Object.entries(zoneMap);
        if (zones.length === 0) {
            text += "No waste data available for any zone.";
            return text;
        }

        const totalWaste = zones.reduce((sum, [, value]) => sum + value, 0);
        const avgWaste = (totalWaste / zones.length).toFixed(2);

        text += `Total waste collected across all zones: ${totalWaste} kg\n`;
        text += `Average waste per zone: ${avgWaste} kg\n\n`;



        text += `\nLast Updated: ${todayDate}\n`;
        text += "Observation: Zones with higher waste may need more frequent collection or additional bins, while zones with lower collection indicate underutilization.";
        return text;
    };

    const generateEfficiencyText = () => {
        let text = "Bin Fill Efficiency Overview:\n\n";

        const zones = Object.keys(efficiencyMap);
        if (zones.length === 0) {
            text += "No efficiency data available.";
            return text;
        }

        let totalEfficiency = 0;

        const overallAvg = (totalEfficiency / zones.length).toFixed(1);
        text += `\nOverall average fill efficiency: ${overallAvg}%\n`;
        text += "Observation: Higher efficiency indicates bins are being used optimally before collection. Lower efficiency zones may require schedule adjustments or additional bins for better utilization.";
        return text;
    };
    // ----------------------- TABLE FUNCTIONS -----------------------
    const addCollectionsTable = (pdf, yPos) => {
        autoTable(pdf, {
            startY: yPos,
            head: [["Zone", "Collections"]],
            body: Object.entries(collectionsMap),
            theme: "grid",
            headStyles: { fillColor: [72, 161, 17] },
            styles: { fontSize: 10 }
        });
    };
    const addStatusTable = (pdf, yPos) => {
        autoTable(pdf, { startY: yPos, head: [["Status", "Count"]], body: [["Full", statusCount.full], ["Half", statusCount.half], ["Empty", statusCount.empty]], theme: "grid", headStyles: { fillColor: [72, 161, 17] }, styles: { fontSize: 10 } });
    };
    const addWeeklyTable = (pdf, yPos) => autoTable(pdf, { startY: yPos, head: [["Day", "Waste Collected (kg)"]], body: Object.entries(weekMap), theme: "grid", headStyles: { fillColor: [72, 161, 17] }, styles: { fontSize: 10 } });
    const addFrequentTable = (pdf, yPos) => autoTable(pdf, { startY: yPos, head: [["Bin Code", "Collections"]], body: sortedBins, theme: "grid", headStyles: { fillColor: [72, 161, 17] }, styles: { fontSize: 10 } });
    const addZoneTable = (pdf, yPos) => autoTable(pdf, { startY: yPos, head: [["Zone", "Waste Collected (kg)"]], body: Object.entries(zoneMap), theme: "grid", headStyles: { fillColor: [72, 161, 17] }, styles: { fontSize: 10 } });
    const addEfficiencyTable = (pdf, yPos) => autoTable(pdf, {
        startY: yPos,
        head: [["Zone", "Average Fill %"]],
        body: Object.keys(efficiencyMap).map(zone => [(zone), (efficiencyMap[zone] / countMap[zone]).toFixed(1)]),
        theme: "grid",
        headStyles: { fillColor: [72, 161, 17] },
        styles: { fontSize: 10 }
    });

    return (
        <div style={{ marginTop: "5rem", marginLeft: "16rem", width: "calc(100% - 16rem)", padding: "20px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <h4 style={{ color: "#25671E", margin: 0 }}>Waste Management Reports</h4>
                <button onClick={downloadPDF} style={{ padding: "8px 16px", border: "none", background: "#25671E", color: "#fff", borderRadius: "6px", cursor: "pointer" }}>
                    <i className="fas fa-download" style={{ marginRight: "8px" }}></i>
                    Download PDF
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                <div style={cardStyle} ref={refs.collections}><h6>Collections Today</h6><div style={{ height: "250px" }}><Bar data={collectionsToday} options={chartOptions} /></div></div>
                <div style={cardStyle} ref={refs.status}><h6>Bin Status Distribution</h6><div style={{ height: "250px" }}><Pie data={binStatus} options={chartOptions} /></div></div>
                <div style={cardStyle} ref={refs.weekly}><h6>Weekly Waste Trend</h6><div style={{ height: "250px" }}><Line data={weeklyWaste} options={chartOptions} /></div></div>
                <div style={cardStyle} ref={refs.frequent}><h6>Most Frequently Emptied Bins</h6><div style={{ height: "250px" }}><Bar data={frequentBins} options={chartOptions} /></div></div>
                <div style={cardStyle} ref={refs.zone}><h6>Zone Wise Waste Collection</h6><div style={{ height: "250px" }}><Doughnut data={zoneWaste} options={chartOptions} /></div></div>
                <div style={cardStyle} ref={refs.efficiency}><h6>Bin Fill Efficiency (%)</h6><div style={{ height: "250px" }}><Bar data={efficiencyData} options={chartOptions} /></div></div>
            </div>
        </div>
    );
}

export default Reports;