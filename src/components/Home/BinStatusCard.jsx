
import React from "react";

export default function BinStatusCard({ bins }) {

  const getColor = (binFill) => {
    if (binFill <= 30 && binFill >=0) return "#2ecc71"; // green
    if (binFill > 30 && binFill < 70) return "#f1c40f"; // yellow
    if (binFill >= 70) return "#e74c3c"; // red
    return "#bdc3c7"; // default gray
  };
  // const bins = [
  //   { area: "Park Avenue", percent: 90, color: "#e74c3c" },
  //   { area: "Main Street", percent: 75, color: "#f1c40f" },
  //   { area: "2nd Ave", percent: 60, color: "#2ecc71" },
  //   { area: "Elm Park", percent: 45, color: "#2ecc71" },
  //   { area: "Union Square", percent: 30, color: "#2ecc71" }
  // ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "24rem",
        background: "#f3f4f6",
        padding: "20px",
        borderRadius: "12px",
        fontFamily: "sans-serif"
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>Bin Status</h3>

      {bins.slice(0,5).map((bin, index) => (
        <div key={index} style={{ marginBottom: "18px" }}>

          {/* Area + Percentage */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px"
            }}
          >
            <span style={{ fontWeight: "600" }}>{bin.location}</span>

            <span
              style={{
                background: getColor(Math.max(0, (bin.currentFillLevel/bin.capacity ) * 100)),
                color: "white",
                padding: "2px 10px",
                borderRadius: "20px",
                fontSize: "12px"
              }}
            >
              {Math.round((bin.currentFillLevel/bin.capacity )* 100)}%
            </span>
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: "6px",
              background: "#ddd",
              borderRadius: "10px",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                width: `${Math.min(100, Math.max(0, (bin.currentFillLevel/bin.capacity ) * 100))}%`,
                height: "100%",
                background: getColor(Math.max(0, (bin.currentFillLevel/bin.capacity ) * 100))
              }}
            ></div>
          </div>

        </div>
      ))}
      <a style={{ fontSize: "12px", color: "#555", marginTop: "10px" }} href="/bin-status">
        View More
      </a>
    </div>
  );
}