import React, { useState } from "react";

function BinStatusPage() {

  const [selectedAuthority, setSelectedAuthority] = useState(null);
  const [message, setMessage] = useState("");

  const bins = [
    { id: "BIN-101", location: "Sector 5", level: 85, authority: "Raj Sharma" },
    { id: "BIN-102", location: "Market Area", level: 40, authority: "Priya Singh" },
    { id: "BIN-103", location: "Bus Stand", level: 95, authority: "Amit Verma" },
  ];

  const getStatus = (level) => {
    if (level > 80) return "Full";
    if (level > 40) return "Half";
    return "Empty";
  };

  const sendMessage = () => {
    alert(`Message sent to ${selectedAuthority}: ${message}`);
    setMessage("");
    setSelectedAuthority(null);
  };

  return (
    <div style={{  marginTop: '5rem', marginLeft: '16rem', padding: '1rem'  }}>
      <h4 style={{color:'#25671E'}}>Bin Status Dashboard</h4>

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
          {bins.map((bin) => (
            <tr key={bin.id}>
              <td>{bin.id}</td>
              <td>{bin.location}</td>
              <td>{bin.level}%</td>
              <td>{getStatus(bin.level)}</td>
              <td>{bin.authority}</td>
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
            <h3>Send Message to {selectedAuthority}</h3>

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