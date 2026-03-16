import React, { useState } from "react";

const SettingsPage = () => {
    const userProfile = {
        name: "John Doe",
        email: "john.doe@university.edu",
        password: "********",
    };

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [theme, setTheme] = useState("light");
    const [binAlertLevel, setBinAlertLevel] = useState(80);

    return (
        <div style={{ marginTop: '5rem', marginLeft: '16rem', padding: '1rem' }}>
            <h4 style={{ color: '#25671E', marginBottom: '1rem' }}>Settings</h4>

            {/* Profile Info */}
            <section style={sectionStyle}>
                <h5 style={headingStyle}>Profile</h5>
                <p><strong>Name:</strong> {userProfile.name}</p>
                <p><strong>Email:</strong> {userProfile.email}</p>
                <p><strong>Password:</strong> {userProfile.password}</p>
            </section>

            {/* Notifications */}
            <section style={sectionStyle}>
                <h5 style={headingStyle}>Notifications</h5>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                        type="checkbox"
                        checked={notificationsEnabled}
                        onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                    />
                    Enable Notifications
                </label>
            </section>

            {/* Theme */}
            <section style={sectionStyle}>
                <h5 style={headingStyle}>Theme</h5>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <label>
                        <input
                            type="radio"
                            name="theme"
                            value="light"
                            checked={theme === "light"}
                            onChange={() => setTheme("light")}
                        />
                        Light
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="theme"
                            value="dark"
                            checked={theme === "dark"}
                            onChange={() => setTheme("dark")}
                        />
                        Dark
                    </label>
                </div>
            </section>

            {/* IoT Bin Alert Level */}
            <section style={sectionStyle}>
                <h5 style={headingStyle}>Bin Alert Level</h5>
                <input
                    type="range"
                    min="10"
                    max="100"
                    value={binAlertLevel}
                    onChange={(e) => setBinAlertLevel(e.target.value)}
                    style={{ width: '100%' }}
                />
                <p>Alert when bin is <strong>{binAlertLevel}%</strong> full</p>
            </section>
        </div>
    );
};

// Common section styling
const sectionStyle = {
    background: '#f8f8f8',
    padding: '1rem 1.5rem',
    marginBottom: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
};

const headingStyle = {
    color: '#25671E',
    marginBottom: '0.75rem',
};

export default SettingsPage;