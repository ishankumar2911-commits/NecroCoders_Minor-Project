import React, { useState } from "react";
const CreateAuthorityForm = ({ BACKEND_URL, selectedBin, setSelectedBin, setBins, setAuthorities, onSuccess, addinBin }) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const createAuthority = async () => {
        const res = await fetch(`${BACKEND_URL}/api/staffs`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, phone })
        });

        const newAuth = await res.json();

        // If used inside "Manage Bin"
        if (!addinBin && selectedBin) {
            await fetch(`${BACKEND_URL}/api/bins/assign-authority/${selectedBin._id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ authorityId: newAuth._id })
            });

            setBins(prev =>
                prev.map(b =>
                    b._id === selectedBin._id
                        ? { ...b, authority: newAuth }
                        : b
                )
            );

            setSelectedBin(null);
        }

        // Always update authorities list
        setAuthorities(prev => [...prev, newAuth]);

        // For Add Bin flow
        if (onSuccess) {
            onSuccess(newAuth);
        }

        // reset fields (optional but clean)
        setName("");
        setPhone("");
    };

    return (
        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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

            <button type="button" onClick={createAuthority}>
                {addinBin ? "Create Authority" : "Create & Assign"}
            </button>
        </div>
    );
}

export default CreateAuthorityForm;