import React, { useState, useEffect } from 'react';

const Controls = ({ channel }) => {
  const [competitions, setCompetitions] = useState({});

  useEffect(() => {
    const socket = window.socketIO;

    socket.on(channel, (data) => {
      setCompetitions(data);
    });

    return () => {
      socket.off(channel);
    };
  }, [channel]);

  const sendCommand = (command, argument) => {
    const socket = window.socketIO;

    socket.emit("command", {
      type: "command",
      channel: channel,
      command: command,
      argument: argument
    });
  };

  const clearAll = () => {
    sendCommand("clearAll");
  };

  const clearCompetition = (competitionName) => {
    sendCommand("clear", competitionName);
  };

  const showCommercial = (logoFile) => {
    sendCommand("commercial", logoFile);
  };

  return (
      <div className="controls">
        <div className="commercial-control">
          <h2>Advertisements</h2>
          <button onClick={() => showCommercial("rubb.jpg")}>Rubb</button>
          <button onClick={() => showCommercial("gtravel.png")}>GTravel</button>
          <button onClick={() => showCommercial("zanderk.svg")}>Zander K</button>
          <button onClick={() => showCommercial("takktil.png")}>Thanks to Bergen & ADO</button>
        </div>

        <div className="controls-header">
          <h2>
            {Object.keys(competitions).length
                ? "Active Competitions:"
                : "No active competitions"}
          </h2>
          <button onClick={clearAll}>Clear all</button>
        </div>

        {Object.keys(competitions).map(competitionName => (
            <CompetitionControl
                key={competitionName}
                competitionData={competitions[competitionName]}
                onDelete={() => clearCompetition(competitionName)}
            />
        ))}
      </div>
  );
};

const CompetitionControl = ({ competitionData, onDelete }) => {
  if (!competitionData || !competitionData.event) {
    return null;
  }

  return (
      <div className="control">
        <h3>{competitionData.event.name}</h3>
        <button onClick={onDelete}>Clear this competition</button>
      </div>
  );
};

export default Controls;