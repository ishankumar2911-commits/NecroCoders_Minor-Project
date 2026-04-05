import React from 'react'
import wastebin from '../../images/wastebin.png'
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
//import logo from '../../images/cleantrack.png'

function Navbar() {
    const [showProfileModal, setShowProfileModal] = React.useState(false);
    const navigate = useNavigate();
    const [search, setSearch] = React.useState("");
    const { user, setUser } = useSocket();
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

    const handleLogout = async () => {
        await fetch(`${BACKEND_URL}/api/auth/logout`, {
            method: "GET",
            credentials: "include"
        });

        // clear user state
        setUser(null);

        // redirect to login page
        window.location.href = "/login";
    }

    const getName = (userName) => {
        if (!userName) return "";
        const parts = userName.split(" ");
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }

    React.useEffect(() => {
        console.log("Current user in Navbar:", user);
    }, [user]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim() === "") return;
        navigate(`/search?q=${encodeURIComponent(search)}`);
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg " style={{ border: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: '1000', height: '5rem', backgroundColor: "#f8f9fa", borderBottom: "1px solid #ddd" }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem ', borderRight: "1px solid #ddd", borderBottom: "1px solid #ddd", width: '15rem', height: '5rem' }}>
                    <a className="navbar-brand" href="/" style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                        <img src={wastebin} alt="Logo" style={{ width: '40px', height: '40px', marginRight: '0.5rem' }} />
                        <h4 style={{ margin: 0, color: '#000', borderWidth: '1px', }}>CleanTrack</h4>
                    </a>
                </div>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {/*<ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/" style={{ color: 'white' }}>Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/" style={{ color: 'white' }}>Link</a>
                            </li>
                            {/* <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'white' }}>
                                    Dropdown
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="/">Action</a></li>
                                    <li><a className="dropdown-item" href="/">Another action</a></li>
                                    <li><hr className="dropdown-divider"></hr></li>
                                    <li><a className="dropdown-item" href="/">Something else here</a></li>
                                </ul>
                            </li> 

                        </ul> */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginLeft: '1rem' }}>
                        <form className="d-flex" role="search">

                            <div style={{ position: "relative", width: "20rem" }}>
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value) }}
                                    style={{ borderRadius: "50px", paddingLeft: "35px" }}
                                />

                                <i
                                    className="fa-solid fa-magnifying-glass"
                                    style={{
                                        position: "absolute",
                                        left: "10px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "gray"
                                    }}
                                ></i>
                            </div>
                            <button className="btn btn-outline-success mx-3" type="submit" onClick={handleSearch}>Search</button>
                        </form>

                        <div className="nav-user-options" style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', marginRight: '1rem', cursor: 'pointer' }} >
                            <i className="fa-regular fa-bell me-5" style={{ fontSize: '1.25rem' }} onClick={() => { navigate('/alerts') }}></i>
                            <i className="fa-solid fa-gear me-5" style={{ fontSize: '1.25rem' }} onClick={() => { navigate('/settings') }}></i>
                            <div
                                onClick={showProfileModal ? () => setShowProfileModal(false) : () => setShowProfileModal(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRadius: '50%',
                                    backgroundColor: '#48A111',
                                    color: 'white',
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    justifyContent: 'center',
                                    cursor: "pointer"
                                }}
                            >
                                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{getName(user?.name)}</span>

                                {/* Modal */}
                                {showProfileModal &&
                                    <ProfileModal
                                        onGoToSettings={() => {
                                            setShowProfileModal(false)
                                            navigate('/settings')
                                        }}
                                        onLogout={handleLogout}
                                        name={user?.name}
                                    />
                                }

                            </div>
                        </div>

                    </div>

                </div>
            </nav>
        </div>
    )
}

export default Navbar
