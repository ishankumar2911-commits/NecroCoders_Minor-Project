import React, { useState } from "react";
import { useSocket } from "../../context/SocketContext";

function BinStatusPage() {
 
  const [selectedAuthority, setSelectedAuthority] = useState(null);
  const [message, setMessage] = useState("");
  const { socket, bins, setBins } = useSocket();

  React.useEffect(()=>{console.log(selectedAuthority)},[selectedAuthority])


  const sendMessage = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/sms/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: selectedAuthority.contact,
          message: message
        })
      });

      //alert("SMS sent successfully ");
      console.log(response);
      setMessage("");
      setSelectedAuthority(null);
    } catch (error) {
      console.error(error);
      alert("Failed to send SMS ");
    }
  };

  // const bins = [
  //   { id: "BIN-101", location: "Sector 5", level: 85, authority: "Raj Sharma" },
  //   { id: "BIN-102", location: "Market Area", level: 40, authority: "Priya Singh" },
  //   { id: "BIN-103", location: "Bus Stand", level: 95, authority: "Amit Verma" },
  // ];


  const getStatus = (level) => {
    if (level > 80) return "Full";
    if (level > 40) return "Half";
    return "Empty";
  };

  const sortedBins = [...bins].sort((a, b) => {
    const percentA = (a.currentFillLevel / a.capacity) * 100;
    const percentB = (b.currentFillLevel / b.capacity) * 100;

    return percentB - percentA; // descending (Full → Empty)
  });

  return (
    <div style={{ marginTop: '5rem', marginLeft: '16rem', padding: '1rem' }}>
      <h4 style={{ color: '#25671E' }}>Bin Status Dashboard</h4>

      <table className="bin-table">
        <thead>
          <tr>
            <th>Bin ID</th>
            <th>Location</th>
            <th>Fill Level</th>
            <th>Status</th>
            <th>Authority</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {sortedBins.map((bin) => (
            <tr
              key={bin._id}
              style={{
                backgroundColor:
                  (bin.currentFillLevel / bin.capacity) * 100 > 80
                    ? "#ffcccc"   // red (Full)
                    : (bin.currentFillLevel / bin.capacity) * 100 > 40
                      ? "#fff3cd"   // yellow (Half)
                      : "#d4edda"   // green (Empty)
              }}
            >
              <td>{bin.binCode}</td>
              <td>{bin.location}</td>
              <td>{(bin.currentFillLevel / bin.capacity * 100).toFixed(0)}%</td>
              <td>{getStatus(bin.currentFillLevel)}</td>
              <td>{bin.authority.name || "Pankaj"}</td>
              <td>
                <button
                  className="msg-btn"
                  onClick={() => setSelectedAuthority(bin.authority)}
                >
                  Message
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Message Modal */}

      {selectedAuthority && (
        <div className="modal">
          <div className="modal-content">
            <h3>Send Message to {selectedAuthority.name}</h3>

            <textarea
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="modal-buttons">
              <button onClick={sendMessage}>Send</button>
              <button onClick={() => setSelectedAuthority(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BinStatusPage;