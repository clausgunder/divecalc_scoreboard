// src/client/components/InfoScreen.jsx
import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';

const InfoScreen = ({ channel = 'screen', competition }) => {
  const [competitions, setCompetitions] = useState({});
  const [index, setIndex] = useState(0);
  const socket = useSocket(channel);

  useEffect(() => {
    if (!socket) return;

    const handleData = (data) => {
      console.log('Received data for InfoScreen:', data);
      setCompetitions(data);
    };

    socket.on(channel, handleData);

    return () => {
      socket.off(channel, handleData);
    };
  }, [socket, channel]);

  // Get the current competition to display
  const competitionsArray = Object.keys(competitions);
  const currentComp = competition
      ? competitions[competition]
      : competitions[competitionsArray[index % Math.max(1, competitionsArray.length)]];

  // Nothing to display yet
  if (!currentComp) {
    return null;
  }

  return (
      <div className="bigscreen">
        <InfoScreenDisplay
            {...currentComp}
            cycle={() => setIndex(prev => prev + 1)}
        />
      </div>
  );
};

const InfoScreenDisplay = (props) => {
  const { action, diver, event, cycle } = props;

  if (!diver || !diver.dive) {
    return null;
  }

  const dive = diver.dive;
  const showHeight = true; // Always show height in info screen

  switch (action) {
    case "dive":
      return (
          <div className="infoScreen">
            <h1>{dive.dive}</h1>
            {showHeight && dive.height && <h1>{dive.height}m</h1>}
            <button onClick={cycle}>{event.name}</button>
          </div>
      );

    default:
      return null;
  }
};

export default InfoScreen;