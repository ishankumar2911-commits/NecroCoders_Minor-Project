import React, { useState } from "react";
import { useSocket } from "../../context/SocketContext";
import CreateAuthorityForm from "./CreateAuthorityForm";

function BinStatusPage({ showAlert }) {

  const [selectedAuthority, setSelectedAuthority] = useState(null);
  const [message, setMessage] = useState("");
  const { socket, bins, setBins } = useSocket();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const [selectedBin, setSelectedBin] = useState(null);
  const [authorities, setAuthorities] = useState([]);
  const [selectedAuth, setSelectedAuth] = useState("");
  const [mode, setMode] = useState("");
  const [showAddBinModal, setShowAddBinModal] = useState(false);
  const [createBinCode, setCreateBinCode] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState(100);
  const [assignedAuthority, setAssignedAuthority] = useState("");
  const [addMode, setAddMode] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [activeBinId, setActiveBinId] = useState(null);

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);


  const handleAddBin = async (location, capacity, authority) => {


    const response = await fetch(`${BACKEND_URL}/api/bins/add-bin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        location,
        capacity,
        authority,
        locationCoordinates: {
          type: "Point",
          coordinates: [lng, lat]
        }
      })
    });

    console.log(response);

    if (response.ok) {
      const newBin = await response.json();
      setBins(prev => [...prev, newBin]);


    }
    setShowAddBinModal(false);
    setLocation("");
    setCapacity("");
    setAssignedAuthority("");
    showAlert("Bin added successfully", "success");
  };

  React.useEffect(() => { console.log(selectedAuthority) }, [selectedAuthority])
  React.useEffect(() => {

    fetch(`${BACKEND_URL}/api/staffs`)
      .then(res => res.json())
      .then(data => setAuthorities(data));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBin]);


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
    if (response.ok) {
      showAlert("Authority assigned successfully", "success");
    }
  }

  const handleDeleteBin = async (binId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/bins/${binId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setBins(prev => prev.filter(b => b._id !== binId));
        showAlert("Bin deleted successfully", "success");
      }
    } catch (err) {
      console.error(err);
      showAlert("Failed to delete bin", "error");
    }
  };

  // //new authority and new bin
  // const assignNewBinToAuthority = async (location, authority) => {
  //   const response = await fetch(`${BACKEND_URL}/api/bins`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       location: location,
  //       capacity: 100,
  //       assignedAuthority: authority
  //     })
  //   });
  // }

  return (
    <div style={{ marginTop: '5rem', marginLeft: '16rem', padding: '1rem' }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1rem"
      }}>
        <h4 style={{ color: '#25671E' }}>Bin Status Dashboard</h4>
        <button
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#25671E",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",

          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#48A111" }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#25671E" }}
          onClick={() => setShowAddBinModal(true)}
        >
          + Add Bin
        </button>
      </div>
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
              className='bin-row'
              onClick={() => setActiveBinId(bin._id)}
              style={{
                backgroundColor:
                  (bin.currentFillLevel / bin.capacity) * 100 > 80
                    ? "#ffcccc"   // red (Full)
                    : (bin.currentFillLevel / bin.capacity) * 100 > 40
                      ? "#fff3cd"   // yellow (Half)
                      : "#d4edda"   // green (Empty)
              }}
              onMouseEnter={(e) => {
                if (activeBinId !== bin._id) {
                  e.currentTarget.style.opacity = "0.85";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <td>{bin.binCode}</td>
              <td>{bin.location}</td>
              <td>{(bin.currentFillLevel / bin.capacity * 100).toFixed(0)}%</td>
              <td>{getStatus(bin.currentFillLevel)}</td>
              <td>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    width: '70%'
                  }}
                >
                  {/* Authority Name */}
                  <span
                    style={{
                      fontWeight: "500",
                      color: "#333"
                    }}
                  >
                    {bin.authority?.name || "Not Assigned"}
                  </span>

                  {/* Change Button */}
                  <button
                    onClick={() => {
                      setSelectedBin(bin);
                      setMode(""); // reset mode
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0.3rem 0.5rem",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                      backgroundColor: "#f8f9fa",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#e6f4ea";
                      e.currentTarget.style.borderColor = "#25671E";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8f9fa";
                      e.currentTarget.style.borderColor = "#ddd";
                    }}
                  >
                    <i
                      className="fa-solid fa-user-tie"
                      style={{ fontSize: "0.9rem", color: "#25671E" }}
                    ></i>

                    <span
                      style={{
                        fontSize: "0.55rem",
                        marginTop: "2px",
                        color: "#555"
                      }}
                    >
                      Change
                    </span>
                  </button>
                </div>
              </td>
              <td style={{ display: 'flex', gap: '0.5rem', width: "100%" }}>
                <>
                <button
                  className="msg-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // VERY IMPORTANT
                    setSelectedAuthority(bin.authority);
                  }}
                >
                  Message
                </button>

                
                    <button
                      style={{
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        padding: "0.3rem 0.6rem",
                        borderRadius: "5px",
                        cursor: "pointer",
                        visibility: activeBinId === bin._id ? "visible" : "hidden"

                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBin(bin._id);
                      }}
                    >
                      <i className="fa-solid fa-trash" style={{ fontSize: "0.9rem" }}></i>
                    </button>
                    
                  </>
                
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
      {selectedBin && (
        <div className="modal">
          <div className="modal-content">

            <h3>Manage Authority for {selectedBin.binCode}</h3>

            {/* STEP 1: Choose mode */}
            {!mode && (
              <div style={{ display: "flex", gap: "1rem" }}>
                <button onClick={() => setMode("existing")}>
                  Choose Existing
                </button>

                <button onClick={() => setMode("new")}>
                  Create New
                </button>
              </div>
            )}

            {/* STEP 2: Existing Authority */}
            {mode === "existing" && (
              <>
                <select
                  onChange={(e) => setSelectedAuth(e.target.value)}
                  style={{ marginTop: "1rem" }}
                >
                  <option value="">Select Authority</option>
                  {authorities.map((auth) => (
                    <option key={auth._id} value={auth._id}>
                      {auth.name}
                    </option>
                  ))}
                </select>

                <button
                  style={{ marginTop: "1rem" }}
                  onClick={
                    async () => {
                      assignExistingBins(selectedBin._id, authorities.find(a => a._id.toString() === selectedAuth));
                      // await fetch(
                      //   `${BACKEND_URL}/api/bins/assign-authority/${selectedBin._id}`,
                      //   {
                      //     method: "PUT",
                      //     headers: { "Content-Type": "application/json" },
                      //     body: JSON.stringify({ authorityId: selectedAuth })
                      //   }
                      // );

                      // update UI
                      setBins(prev =>
                        prev.map(b =>
                          b._id === selectedBin._id
                            ? { ...b, authority: authorities.find(a => a._id === selectedAuth) }
                            : b
                        )
                      );

                      setSelectedBin(null);
                      setMode("");
                    }}
                >
                  Assign
                </button>
              </>
            )}

            {/* STEP 3: Create New Authority */}
            {mode === "new" && (
              <CreateAuthorityForm
                BACKEND_URL={BACKEND_URL}
                selectedBin={selectedBin}
                setSelectedBin={setSelectedBin}
                setBins={setBins}
                authorities={authorities}
                setAuthorities={setAuthorities}
              />
            )}

            <button
              style={{ marginTop: "1rem" }}
              onClick={() => {
                setSelectedBin(null);
                setMode("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showAddBinModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Bin</h3>
            <form >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ fontSize: "0.8rem", color: "#555" }}>
                  {createBinCode} Bin Code will be auto-generated. You can edit it later if needed.
                </div>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  type="text"
                  name="location"
                  placeholder="Location"
                  required
                />
                <input
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  type="number"
                  name="capacity"
                  placeholder="Capacity"
                  max={1500}
                  required
                />
                {/* <select name="authority"
                  value={assignedAuthority}
                  onChange={(e) => setAssignedAuthority(e.target.value)}
                >
                  <option value="">Select Authority (optional)</option>
                  {authorities.map((auth) => (
                    <option key={auth._id} value={auth._id}>
                      {auth.name}
                    </option>
                  ))}
                </select> */}
                <label style={{ marginTop: "0.5rem", display: "block" }}>Assign Authority (optional)</label>
                {/* STEP 1: Choose mode */}
                {(addMode === "" || !addMode) && (
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button onClick={() => setAddMode("existing")}>
                      Choose Existing
                    </button>

                    <button onClick={() => setAddMode("new")}>
                      Create New
                    </button>
                  </div>
                )}

                {/* STEP 2: Existing Authority */}
                {addMode === "existing" && (
                  <select
                    value={assignedAuthority}
                    onChange={(e) => setAssignedAuthority(e.target.value)}
                  >
                    <option value="">Select Authority</option>
                    {authorities.map((auth) => (
                      <option key={auth._id} value={auth._id}>
                        {auth.name}
                      </option>
                    ))}
                  </select>
                )}

                {/* STEP 3: Create New Authority */}
                {addMode === "new" && (
                  <CreateAuthorityForm
                    BACKEND_URL={BACKEND_URL}
                    setAuthorities={setAuthorities}
                    authorities={authorities}
                    onSuccess={(newAuth) => {
                      setAssignedAuthority(newAuth._id); // auto select
                      setAddMode("existing"); // switch back
                    }}
                    addinBin={true}
                  />
                )}

              </div>
            </form>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button style={{ marginTop: "1rem" }} onClick={(e) => {
                e.preventDefault();
                handleAddBin(location, capacity, assignedAuthority);
              }}>
                Add Bin
              </button>
              <button
                style={{ marginTop: "1rem" }}
                onClick={() => { setShowAddBinModal(false); setAddMode("") }}
              >
                Cancel
              </button>
            </div>


          </div>
        </div>
      )}
    </div>
  );
}

export default BinStatusPage;