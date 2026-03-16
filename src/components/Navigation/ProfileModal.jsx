import React, { useState } from "react";
import ProfileModal from "./ProfileModal";

function Navbar() {
    const [showProfileModal, setShowProfileModal] = useState(false);

    const handleLogout = () => {
        console.log("Logout clicked");
    };

    const goToSettings = () => {
        console.log("Go to settings");
    };

    return (
        <div style={{ padding: "20px", display: "flex", justifyContent: "flex-end" }}>
            <ProfileModal
                showProfileModal={showProfileModal}
                setShowProfileModal={setShowProfileModal}
                onLogout={handleLogout}
                onGoToSettings={goToSettings}
            />
        </div>
    );
}

export default Navbar;