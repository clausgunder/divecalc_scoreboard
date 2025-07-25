import { useEffect, useState } from 'react';

/**
 * Custom hook to access the global socket instance
 * @param {string} namespace - Optional namespace to use
 * @returns {Object|null} Socket.IO client instance
 */
export const useSocket = (namespace) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Use the global socketIO instance created in the main index.jsx
        if (window.socketIO) {
            setSocket(window.socketIO);
        } else {
            console.error('Socket.IO instance not found in global scope');
        }

        return () => {
            // We don't disconnect the socket here since it's shared globally
            // Just clean up our state reference
        };
    }, [namespace]);

    return socket;
};