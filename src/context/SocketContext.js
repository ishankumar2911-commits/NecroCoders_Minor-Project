import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

// named export
export const useSocket = () => {
    return useContext(SocketContext);
};

//named export
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [bins, setBins] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, []);



    const fetchBins = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/bins", {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    //"auth-token": token
                }
            });

            const data = await res.json();
            setBins(data||[]);
            console.log("Fetched bins:", data);
        } catch (err) {
            console.error("Error fetching bins:", err);
        }
    };

    const getUser = async () => {
        const res = await fetch("http://localhost:5000/api/auth/user", {
            credentials: "include" // 🔥 VERY IMPORTANT
        });

        const data = await res.json();
        setUser(data.user);
        return data;
    };

        useEffect(() => {
            fetchBins();
            getUser().then(data => {
                if (data.success) {
                    console.log("Logged in user:", data.user);
                } else {
                    console.log("Not logged in");
                }
            });
        }, []);
    
        return (
            <SocketContext.Provider value={{
                socket,
                bins,
                setBins,
                fetchBins,
                getUser,
                user,
                setUser
            }}>
                {children}
            </SocketContext.Provider>
        );
    };