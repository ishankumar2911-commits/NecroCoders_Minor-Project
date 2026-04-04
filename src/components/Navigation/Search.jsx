import React from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from '../../context/SocketContext';

export default function Search() {
    const { bins } = useSocket();
    const query = new URLSearchParams(useLocation().search).get("q") || "";
    const [openBinDeatails, setOpenBinDetails] = React.useState(false);
    const [selectedBin, setSelectedBin] = React.useState(null);

    const filteredBins = bins.filter((bin) =>
        bin.binCode.toLowerCase().includes(query.toLowerCase()) ||
        bin.location.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div style={{ padding: "6rem 2rem", marginLeft: '16rem', width: 'calc(100% - 16rem)' }}>
            <h4 style={{ marginBottom: "1.5rem" }}>
                Results for "<span style={{ color: "#48A111" }}>{query}</span>"
            </h4>

            {filteredBins.length === 0 ? (
                <p>No bins found</p>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>

                    {filteredBins.map((bin) => (
                        <div
                            key={bin._id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "15px",
                                padding: "1rem",
                                backgroundColor: "#fff",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                                transition: "0.2s",
                                cursor: "pointer"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                        >

                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h5 style={{ margin: 0 }}>{bin.binCode}</h5>

                                <span
                                    style={{
                                        padding: "0.2rem 0.6rem",
                                        borderRadius: "10px",
                                        fontSize: "0.75rem",
                                        backgroundColor:
                                            bin.currentFillLevel > 80 ? "#ff4d4f" :
                                                bin.currentFillLevel > 50 ? "#faad14" :
                                                    "#52c41a",
                                        color: "#fff"
                                    }}
                                >
                                    {Math.round(bin.currentFillLevel / bin.capacity * 100) || 0}%
                                </span>
                            </div>

                            {/* Location */}
                            <p style={{ margin: "0.5rem 0", color: "gray" }}>
                                📍 {bin.location}
                            </p>

                            {/* Info Section */}
                            <div style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>

                                <p style={{ margin: "0.3rem 0" }}>
                                    🗑 Capacity: <strong>{bin.capacity || "N/A"} L</strong>
                                </p>

                                <p style={{ margin: "0.3rem 0" }}>
                                    🔄 Status:{" "}
                                    <strong style={{ color: bin.status === "Full" ? "red" : "green" }}>
                                        {bin.status || "Active"}
                                    </strong>
                                </p>

                                <p style={{ margin: "0.3rem 0" }}>
                                    🕒 Last Updated:{" "}
                                    <strong>
                                        {bin.updatedAt
                                            ? new Date(bin.updatedAt).toLocaleString()
                                            : "N/A"}
                                    </strong>
                                </p>

                            </div>

                            {/* Action Button */}
                            <button
                                style={{
                                    marginTop: "0.8rem",
                                    width: "100%",
                                    border: "none",
                                    padding: "0.5rem",
                                    borderRadius: "8px",
                                    backgroundColor: "#48A111",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenBinDetails(true);
                                    setSelectedBin(bin);
                                    // navigate(`/dashboard?bin=${bin.binCode}`);
                                    console.log("View bin", bin.binCode);
                                }}
                            >
                                View Details
                            </button>

                        </div>
                    ))}


                </div>
            )}

            {openBinDeatails && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    {/* Modal Box */}
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "15px",
                            width: "400px",
                            padding: "1.5rem",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                            position: "relative",
                            animation: "fadeIn 0.3s ease-in-out",
                        }}
                    >
                        {/* Close Button */}
                        <span
                            onClick={() => setOpenBinDetails(false)}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "15px",
                                fontSize: "1.2rem",
                                cursor: "pointer",
                                fontWeight: "bold",
                            }}
                        >
                            ✖
                        </span>

                        {/* Title */}
                        <h4 style={{ marginBottom: "1rem", textAlign: "center" }}>
                            🗑 Bin Details
                        </h4>

                        {/* Content */}
                        <div style={{ fontSize: "0.95rem" }}>
                            <p><strong>Code:</strong> {filteredBins[0]?.binCode}</p>
                            <p><strong>Location:</strong> 📍 {filteredBins[0]?.location}</p>
                            <p><strong>Capacity:</strong> {filteredBins[0]?.capacity || "N/A"} L</p>

                            <p>
                                <strong>Status:</strong>{" "}
                                <span
                                    style={{
                                        color:
                                            filteredBins[0]?.status === "Full"
                                                ? "red"
                                                : "green",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {filteredBins[0]?.status || "Active"}
                                </span>
                            </p>

                            <p>
                                <strong>Fill Level:</strong>{" "}
                                {filteredBins[0]?.currentFillLevel || 0} L
                            </p>

                            {/* Progress Bar */}
                            <div
                                style={{
                                    height: "8px",
                                    borderRadius: "5px",
                                    background: "#eee",
                                    margin: "0.5rem 0 1rem",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        width: `${((filteredBins[0]?.currentFillLevel || 0) /
                                            (filteredBins[0]?.capacity || 1)) *
                                            100}%`,
                                        height: "100%",
                                        background:
                                            (filteredBins[0]?.currentFillLevel || 0) /
                                                (filteredBins[0]?.capacity || 1) >
                                                0.8
                                                ? "#ff4d4f"
                                                : "#52c41a",
                                        transition: "0.3s",
                                    }}
                                />
                            </div>

                            <p>
                                <strong>Authority:</strong>{" "}
                                {filteredBins[0]?.authority?.name || "N/A"}
                            </p>

                            <p>
                                <strong>Last Updated:</strong><br />
                                {filteredBins[0]?.updatedAt
                                    ? new Date(filteredBins[0].updatedAt).toLocaleString()
                                    : "N/A"}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                            <button
                                style={{
                                    flex: 1,
                                    padding: "0.5rem",
                                    borderRadius: "8px",
                                    border: "none",
                                    background: "#48A111",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }}
                            >
                                Mark Collected
                            </button>

                            <button
                                style={{
                                    flex: 1,
                                    padding: "0.5rem",
                                    borderRadius: "8px",
                                    border: "1px solid #ddd",
                                    background: "#fff",
                                    cursor: "pointer",
                                }}
                                onClick={() => setOpenBinDetails(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}