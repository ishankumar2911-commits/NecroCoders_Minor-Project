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

    useEffect(() => {
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, []);



    const fetchBins = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/bins", {
                headers: {
                    "Content-Type": "application/json",
                    //"auth-token": token
                }
            });

            const data = await res.json();
            setBins(data);
        } catch (err) {
            console.error("Error fetching bins:", err);
        }
    };

    useEffect(() => {
        fetchBins()
    }, [])

    return (
        <SocketContext.Provider value={{
            socket,
            bins,
            setBins,
            fetchBins
        }}>
            {children}
        </SocketContext.Provider>
    );
};