import React from 'react'
import wastebin from '../../images/wastebin.png'
//import logo from '../../images/cleantrack.png'

function Navbar() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg " style={{ border: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: '1000',height:'5rem',backgroundColor: "#f8f9fa",borderBottom: "1px solid #ddd"}}>
                <div style={{ display: 'flex', alignItems: 'center' ,padding:'0.5rem 1rem ',borderRight: "1px solid #ddd",borderBottom: "1px solid #ddd",width:'15rem',height:'5rem'}}>
                    <a className="navbar-brand" href="/" style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                        <img src={wastebin} alt="Logo" style={{ width: '40px', height: '40px', marginRight: '0.5rem' }} />
                        <h4 style={{ margin: 0 ,color:'#000',borderWidth:'1px',}}>CleanTrack</h4>
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
                            <button className="btn btn-outline-success mx-3" type="submit" >Search</button>
                        </form>

                        <div className="nav-user-options" style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
                            <i className="fa-regular fa-bell me-5" style={{fontSize: '1.25rem'}}></i>
                            <i className="fa-solid fa-gear me-5" style={{fontSize: '1.25rem'}}></i>
                            <div style={{ display: 'flex', alignItems: 'center', borderRadius: '50px', backgroundColor: '#48A111', padding: '0.5rem 1rem', color: 'white', width: '2.5rem', height: '2.5rem', justifyContent: 'center' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>X</span>
                            </div>
                        </div>
                    </div>

                </div>
            </nav>
        </div>
    )
}

export default Navbar
