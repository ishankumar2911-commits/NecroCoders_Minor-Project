
import React from "react";

export default function BinStatusCard() {

  const bins = [
    { area: "Park Avenue", percent: 90, color: "#e74c3c" },
    { area: "Main Street", percent: 75, color: "#f1c40f" },
    { area: "2nd Ave", percent: 60, color: "#2ecc71" },
    { area: "Elm Park", percent: 45, color: "#2ecc71" },
    { area: "Union Square", percent: 30, color: "#2ecc71" }
  ];

  return (
    <div
      style={{
        width: "24rem",
        background: "#f3f4f6",
        padding: "20px",
        borderRadius: "12px",
        fontFamily: "sans-serif"
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>Bin Status</h3>

      {bins.map((bin, index) => (
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
            <span style={{ fontWeight: "600" }}>{bin.area}</span>

            <span
              style={{
                background: bin.color,
                color: "white",
                padding: "2px 10px",
                borderRadius: "20px",
                fontSize: "12px"
              }}
            >
              {bin.percent}%
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
                width: `${bin.percent}%`,
                height: "100%",
                background: bin.color
              }}
            ></div>
          </div>

        </div>
      ))}
    </div>
  );
}