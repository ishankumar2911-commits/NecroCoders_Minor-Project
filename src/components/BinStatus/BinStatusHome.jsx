import React, { useState } from "react";
import { useSocket } from "../../context/SocketContext";


function BinStatusPage() {

  const [selectedAuthority, setSelectedAuthority] = useState(null);
  const [message, setMessage] = useState("");
  const { socket, bins, setBins } = useSocket();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const [selectedBin, setSelectedBin] = useState(null);
  const [authorities, setAuthorities] = useState([]);
  const [selectedAuth, setSelectedAuth] = useState("");

  React.useEffect(() => { console.log(selectedAuthority) }, [selectedAuthority])


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

  const assignExistingBins = async (binID, authority) => {
    const response = await fetch(`${BACKEND_URL}/api/bins/assign-authority/${binID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        authorityId: authority._id
      })
    });
  }

  //new authority and new bin
  const assignNewBinToAuthority = async (location, authority) => {
    const response = await fetch(`${BACKEND_URL}/api/bins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        location: location,
        capacity: 100,
        assignedAuthority: authority
      })
    });
  }

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
              <td>
                {<div style={{ display: 'flex', alignItems: 'center', }} >
                  {bin.authority.name || "Pankaj"}
                  <button
                    style={{ marginLeft: '0.5rem', padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                    onClick={() => setSelectedBin(bin)}

                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem' }}>
                      <i class="fa-solid fa-user-tie"></i>
                      <p style={{ fontSize: '0.55rem' }}>Change</p>
                    </div>
                  </button>
                </div>}
              </td>
              <td style={{ display: 'flex', gap: '0.5rem' }}>
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