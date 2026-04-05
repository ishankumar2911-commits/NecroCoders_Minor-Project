import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function CollectionOverview({ bins }) {

  // ✅ Group bins by zone
  const zoneCounts = React.useMemo(() => {
    const result = {};

    bins.forEach((bin) => {
      const zone = bin.zone || "Unknown";

      if (!result[zone]) {
        result[zone] = 0;
      }

      result[zone] += 1;
    });

    return result;
  }, [bins]);

  // ✅ Chart data
  const data = {
    labels: Object.keys(zoneCounts),
    datasets: [
      {
        label: "Number of Bins",
        data: Object.values(zoneCounts),
        backgroundColor: "#2ecc71",
        borderRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        grid: { color: "#eee" }
      }
    }
  };

  return (
    <div style={{ width: "100%", background: "#fff", padding: "20px", borderRadius: "10px" }}>
      <h4>Zone-wise Bin Count</h4>
      <Bar data={data} options={options} />
      <a style={{ fontSize: "12px", color: "#555", marginTop: "10px" }} href="/reports">
        View More
      </a>
    </div>
  );
}

export default CollectionOverview;