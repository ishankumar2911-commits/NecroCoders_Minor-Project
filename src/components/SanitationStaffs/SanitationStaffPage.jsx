import React from "react";

function SanitationStaffPage() {

  const staff = [
    { id: "SW101", name: "Amit Kumar", area: "Sector 5 Bins", tasks: 24, status: "Present" },
    { id: "SW102", name: "Riya Sharma", area: "Market Area", tasks: 19, status: "Present" },
    { id: "SW103", name: "Sunil Mehta", area: "Bus Stand", tasks: 0, status: "Absent" },
    { id: "SW104", name: "Kavita Rao", area: "Hospital Road", tasks: 15, status: "Present" }
  ];

  return (
    <div className="staff-page" style={{marginTop: '5rem', marginLeft: '16rem', padding: '1rem'}}>

      <h4 style={{color:'#25671E'}}>Sanitation Staff Dashboard</h4>

      {/* Stats Cards */}

      <div className="staff-stats">

        <div className="staff-card">
          <h5>42</h5>
          <p>Total Staff</p>
        </div>

        <div className="staff-card present">
          <h5>36</h5>
          <p>Present Today</p>
        </div>

        <div className="staff-card absent">
          <h5>6</h5>
          <p>Absent</p>
        </div>

        <div className="staff-card tasks">
          <h5>210</h5>
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

          {staff.map((worker) => (
            <tr key={worker.id}>
              <td>{worker.id}</td>
              <td>{worker.name}</td>
              <td>{worker.area}</td>
              <td>{worker.tasks}</td>
              <td>
                <span className={worker.status === "Present" ? "status-present" : "status-absent"}>
                  {worker.status}
                </span>
              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default SanitationStaffPage;