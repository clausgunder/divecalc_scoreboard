import React, { useState, useEffect } from 'react';

const Commercial = ({ channel }) => {
    const [state, setState] = useState({
        logo: null,
        show: false
    });

    useEffect(() => {
        const socket = window.socketIO;

        // Listen for commercial commands
        socket.on(`${channel}_commercial`, (data) => {
            setState({
                logo: data.argument,
                show: true
            });

            // Auto-hide after 5 seconds
            setTimeout(() => {
                setState(prevState => ({
                    ...prevState,
                    show: false
                }));
            }, 5000);
        });

        return () => {
            socket.off(`${channel}_commercial`);
        };
    }, [channel]);

    return (
        <div className={`commercial animated ${state.show ? 'fadeIn' : 'fadeOut'}`}>
            {state.logo && (
                <img src={`/img/${state.logo}`} alt="Commercial" />
            )}
        </div>
    );
};

export default Commercial;