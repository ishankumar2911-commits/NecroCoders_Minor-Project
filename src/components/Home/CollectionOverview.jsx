import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend
);

function CollectionOverview() {

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Collection 1",
        data: [150, 320, 210, 340, 270, 420, 500],
        borderColor: "#2ecc71",
        backgroundColor: "rgba(46, 204, 113, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#2ecc71",
        pointBorderWidth: 3
      },
      {
        label: "Collection 2",
        data: [100, 230, 120, 210, 170, 260, 300],
        borderColor: "#27ae60",
        backgroundColor: "rgba(39, 174, 96, 0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#27ae60",
        pointBorderWidth: 3
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: "#eee"
        }
      }
    }
  };

  return (
    <div style={{ width: "100%", background: "#fff", padding: "20px", borderRadius: "10px" }}>
      <h4>Collection Overview</h4>
      <Line data={data} options={options} />
    </div>
  );
}

export default CollectionOverview;