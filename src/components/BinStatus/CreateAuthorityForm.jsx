import React, { useState } from "react";
const CreateAuthorityForm = ({ BACKEND_URL, selectedBin, setSelectedBin, setBins, setAuthorities, }) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const createAuthority = async () => {
        const res = await fetch(`${BACKEND_URL}/api/staffs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, phone })
        });

        const newAuth = await res.json();

        // assign to bin
        await fetch(`${BACKEND_URL}/api/bins/assign-authority/${selectedBin._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ authorityId: newAuth._id })
        });

        // update UI
        setBins(prev =>
            prev.map(b =>
                b._id === selectedBin._id
                    ? { ...b, authority: newAuth }
                    : b
            )
        );
        setAuthorities(prev => [...prev, newAuth]);
        setSelectedBin(null);

    };

    return (
        <div style={{ marginTop: "1rem" }}>
            <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            <button onClick={createAuthority}>Create & Assign</button>
        </div>
    );
}

export default CreateAuthorityForm;