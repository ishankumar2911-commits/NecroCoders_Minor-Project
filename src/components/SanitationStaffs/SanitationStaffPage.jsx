import React from "react";


function SanitationStaffPage({ showAlert }) {

  const staff = [
    { id: "SW101", name: "Amit Kumar", area: "Sector 5 Bins", tasks: 24, status: "Present" },
    { id: "SW102", name: "Riya Sharma", area: "Market Area", tasks: 19, status: "Present" },
    { id: "SW103", name: "Sunil Mehta", area: "Bus Stand", tasks: 0, status: "Absent" },
    { id: "SW104", name: "Kavita Rao", area: "Hospital Road", tasks: 15, status: "Present" }
  ];

  const [activeBinId, setActiveBinId] = React.useState(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const [staffs, setStaffs] = React.useState([]);
  const [activeDropdown, setActiveDropdown] = React.useState(null);
  const [activeStaffId, setActiveStaffId] = React.useState(null);
  const [showAddStaffModal, setShowAddStaffModal] = React.useState(false);
  const [newStaffName, setNewStaffName] = React.useState("");
  const [availableBins, setAvailableBins] = React.useState([]);
  const [selectedBins, setSelectedBins] = React.useState([]);
  const [newStaffPhone, setNewStaffPhone] = React.useState("");

  const handleAddStaff = async (e) => {
    e.preventDefault();

    const response = await fetch(`${BACKEND_URL}/api/staffs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: newStaffName,
        phone: newStaffPhone,
        assignedBins: selectedBins
      })
    });

    const data = await response.json();
    if (response.ok) {
      setStaffs(prev => [...prev, data]);
      setShowAddStaffModal(false);
      showAlert("Staff member added successfully", "success");
      setNewStaffName("");
      setNewStaffPhone("");
      setSelectedBins([]);
    } else {
      showAlert("Failed to add staff member", "error");
    }
  };

  React.useEffect(() => {
    if (showAddStaffModal) {
      fetch(`${BACKEND_URL}/api/bins/unassigned`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => { console.log("Fetched unassigned bins:", res); return res.json(); })
        .then(data => {
          console.log("Available bins:", data);


          if (Array.isArray(data)) {
            setAvailableBins(data);
          } else {
            setAvailableBins([]); // fallback
          }
        })
        .catch(err => console.error(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAddStaffModal]);

  React.useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const taskCounts = staffs.reduce((acc, staff) => {
    return acc + (staff.completedTasks || 0);
  }, 0);

  const handleCheckboxChange = (binId) => {
    setSelectedBins(prev =>
      prev.includes(binId)
        ? prev.filter(id => id !== binId)
        : [...prev, binId]
    );
  };

  //get all staffs
  React.useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/staffs`);
        const data = await response.json();
        setStaffs(data);
        console.log("Fetched staff data:", data);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    fetchStaffs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) {
      return;
    } else {
      const res = await fetch(`${BACKEND_URL}/api/staffs/${staffId}`, {
        method: "DELETE"
      });
      console.log("Delete response:", res);
      if (res.ok) {
        setStaffs(prev => prev.filter(s => s._id !== staffId));
        showAlert("Staff member deleted successfully", "success");
      } else {
        showAlert("Failed to delete staff member", "error");

      }
    }
  };

  return (
    <div className="staff-page" style={{ marginTop: '5rem', marginLeft: '16rem', padding: '1rem' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h4 style={{ color: '#25671E' }}>Sanitation Staff Dashboard</h4>
        <button style={{
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "5px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#48A111" }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#25671E" }}
          onClick={() => setShowAddStaffModal(true)}
        >
          <i className="fa-solid fa-plus" style={{ marginRight: "5px" }}></i>
          Add Staff
        </button>
      </div>


      {/* Stats Cards */}

      <div className="staff-stats">

        <div className="staff-card">
          <h5>{staffs.length}</h5>
          <p>Total Staff</p>
        </div>

        <div className="staff-card present">
          <h5>5</h5>
          <p>Present Today</p>
        </div>

        <div className="staff-card absent">
          <h5>3</h5>
          <p>Absent</p>
        </div>

        <div className="staff-card tasks">
          <h5>{taskCounts}</h5>
          <p>Tasks Completed</p>
        </div>

      </div>


      {/* Staff Table */}

      <table className="staff-table">

        <thead>
          <tr>
            <th>Staff ID</th>
            <th>Name</th>
            <th>Allocation</th>
            <th>Tasks Done</th>
            <th>Status</th>

          </tr>
        </thead>

        <tbody>

          {staffs.map((worker) => (
            <tr key={worker._id}
              className='staff-row'

              onClick={() => setActiveStaffId(worker._id === activeStaffId ? null : worker._id)}
              style={{
                backgroundColor: worker._id === activeStaffId ? "#f0f0f0" : "transparent", cursor: "pointer", position: "relative", // ✅ IMPORTANT
                zIndex: activeDropdown === worker._id ? 10 : 1,
              }}
            >
              <td>{worker.staffId}</td>
              <td>{worker.name}</td>
              <td style={{ position: "relative" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === worker._id ? null : worker._id)
                  }

                  }
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    background: "#f5f5f5",
                    zIndex: 1
                  }}
                >
                  {worker.assignedBins.length} bins ⬇
                </button>

                {activeDropdown === worker._id && (
                  <div
                    style={{
                      position: "absolute",
                      top: "110%",
                      left: 0,
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "8px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      zIndex: 100,
                      minWidth: "200px"
                    }}
                  >
                    {worker.assignedBins.length === 0 ? (
                      <p style={{ margin: 0 }}>No bins assigned</p>
                    ) : (
                      worker.assignedBins.map((bin) => (
                        <div
                          key={bin._id}
                          style={{
                            padding: "4px 0",
                            borderBottom: "1px solid #eee"
                          }}
                        >
                          <p style={{ margin: 0, fontWeight: "bold" }}>{bin.location}</p>
                          <p style={{ margin: 0, fontSize: "0.9rem", color: "#555" }}>
                            Status:{" "}
                            <span style={{ color: bin.status === "full" ? "#dc3545" : "#28a745" }}>
                              {bin.status.charAt(0).toUpperCase() + bin.status.slice(1)}
                            </span>
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </td>
              <td>{worker.completedTasks}</td>
              <td>
                <>
                  <span className={worker.status === "Present" ? "status-present" : "status-absent"}>
                    {worker.status}
                    <div
                      style={{ visibility: activeStaffId === worker._id ? "visible" : "hidden", display: "inline-block", marginLeft: "10px", cursor: "pointer" }}
                      onClick={handleDeleteStaff.bind(null, worker._id)}>
                      <i className="fa-solid fa-trash" style={{ fontSize: "1rem", marginLeft: "5px", color: "#dc3545" }}></i>
                    </div>
                  </span>
                </>
              </td>
            </tr>
          ))}

        </tbody>

      </table>
      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Staff</h3>

            <form onSubmit={handleAddStaff}>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <input
                  type="text"
                  placeholder="Name"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Phone Number"
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                />

              </div>
              {/* Bins Checkboxes */}
              <div style={{ marginTop: "10px" }}>
                <p>Select Bins:</p>
                {console.log("Available bins for assignment:", availableBins)} {/* Debug log */}

                {availableBins.length === 0 ? (
                  <p>No bins available</p>
                ) : (
                  <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                    {availableBins.map((bin) => (
                      <label key={bin._id} style={{ display: "block" }}>
                        <input
                          type="checkbox"
                          value={bin._id}
                          onChange={() => handleCheckboxChange(bin._id)}
                        />
                        {bin.binCode} - {bin.location}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                <button type="submit">Add Staff</button>
                <button type="button" onClick={() => setShowAddStaffModal(false)} style={{ marginLeft: "10px" }}>
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default SanitationStaffPage;