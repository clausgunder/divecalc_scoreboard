import React, { useState, useEffect, useRef, useReducer } from 'react';
import { StreamPosition, Flag } from './Positions';

const initialState = {
  competition: null,
  event: {
    name: '',
    round: 0,
    rounds: 0,
    results: [],
    judges: {}
  },
  diver: {
    name: '',
    nationality: '',
    position: 0,
    rank: 0,
    dive: {},
    result: 0
  },
  action: ''
};

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_DATA':
      return { ...state, ...action.payload };
    case 'RESET_DATA':
      return initialState;
    default:
      return state;
  }
}

const Scoreboard = ({ competition, channel, auto = false }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [slice, setSlice] = useState(1);
  const [lockData, setLockData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const lockTimeout = useRef(null);
  const sliceTimeout = useRef(null);
  const filter = window.getParameterByName("filter");
  const isDods = window.getParameterByName("dods") !== null;

  // Set document title
  useEffect(() => {
    if (competition) {
      document.title = competition;
    }
  }, [competition]);

  // Handle incoming data
  const handleData = (incomingData) => {
    const competitionData = competition
        ? incomingData[competition]
        : Object.values(incomingData)[0];

    if (!competitionData) return;

    // Apply filter if needed
    if (filter === "results" && competitionData) {
      competitionData.action = "results";
    }

    // Check if data passes filter
    if (!filter || new RegExp(filter).test(competitionData.action)) {
      if (auto) {
        handleAutoMode(competitionData);
      } else {
        dispatch({ type: 'UPDATE_DATA', payload: competitionData });
        setSlice(1);
      }
    }
  };

  // Auto mode handles transitions between states
  const handleAutoMode = (competitionData) => {
    if (lockTimeout.current) {
      setLockData(competitionData);
      return;
    }

    switch (competitionData.action) {
      case "awards":
        // Set timeout to show awards for 9 seconds
        lockTimeout.current = setTimeout(() => {
          lockTimeout.current = null;
          if (lockData) {
            dispatch({ type: 'UPDATE_DATA', payload: lockData });
            setSlice(1);
            setLockData(null);
          }
        }, 9000);

        // Show the awards after a short delay
        setTimeout(() => {
          setData(competitionData);
          setSlice(1);
        }, 2000);

        // Transition to results if this is the last diver
        if (competitionData.diver.position === competitionData.event.results.length) {
          setTimeout(() => {
            const resultsData = { ...competitionData, action: "results" };
            dispatch({ type: 'UPDATE_DATA', payload: resultsData });
            setSlice(1);
          }, 5000);
        }
        break;

      default:
        dispatch({ type: 'UPDATE_DATA', payload: competitionData });
        setSlice(1);
        break;
    }
  };

  // Socket connection
  useEffect(() => {
    const socket = window.socketIO;

    socket.on(channel, handleData);

    return () => {
      socket.off(channel);
      if (lockTimeout.current) clearTimeout(lockTimeout.current);
      if (sliceTimeout.current) clearTimeout(sliceTimeout.current);
    };
  }, [channel, competition, lockData]);

  // Handle pagination for results/startlist
  useEffect(() => {
    if (sliceTimeout.current) {
      clearTimeout(sliceTimeout.current);
      sliceTimeout.current = null;
    }

    // Don't set timeouts if no data
    if (!data || !data.event) return;

    // Clear display after some time
    if (auto && (data.action === "dive" || data.action === "awards")) {
      sliceTimeout.current = setTimeout(() => {
        dispatch({ type: 'RESET_DATA' });
        setSlice(1);
      }, 3000);
    }

    // For pagination in results or startlist with many entries
    if ((data.action === "results" || data.action === "startlist") &&
        data.event.results.length > 10) {
      const totalSlices = Math.ceil(data.event.results.length / 10);

      if (slice <= totalSlices) {
        sliceTimeout.current = setTimeout(() => {
          setSlice(prevSlice => prevSlice + 1);
        }, auto ? 5000 : 10000);
      } else if (filter === "results") {
        // Reset to first slice if we've gone past the end
        setTimeout(() => {
          setSlice(1);
        }, 10);
      }
    }
  }, [data, slice, auto]);

  // Render component based on action type
  if (!data || !data.event) {
    return (
      <div className="loading">
        <div>Waiting for competition data...</div>
      </div>
    );
  }

  const { action, diver, event } = data;

  switch (action) {
    case "judges":
      return <JudgesView data={data} event={event} />;

    case "startlist":
    case "results":
      return <ResultsView
          data={data}
          event={event}
          slice={slice}
          isDods={isDods}
          isStartlist={action === "startlist"}
      />;

    case "dive":
      return <DiveView data={data} diver={diver} event={event} isDods={isDods} />;

    case "awards":
      return <AwardsView data={data} diver={diver} event={event} isDods={isDods} />;

    default:
      return <div />;
  }
};

// Judges view component
const JudgesView = ({ data, event }) => {
  const panels = event.judges.panels.map(p => p.judges);
  const judges = [].concat(...panels);

  return (
      <div className="standings">
        <div className="standingsHeader">
          <div className="competition">{event.name}</div>
          <div className="description">Judges</div>
        </div>

        {event.judges.referee && (
            <div className="resultline">
              <div className="position" />
              <div className="name">
                {event.judges.referee.name.toLowerCase()}
                {event.judges.referee.nationality &&
                    ` (${event.judges.referee.nationality})`}
              </div>
              <div className="role">Referee</div>
            </div>
        )}

        {event.judges.assistantReferee && (
            <div className="resultline">
              <div className="position" />
              <div className="name">
                {event.judges.assistantReferee.name.toLowerCase()}
                {event.judges.assistantReferee.nationality &&
                    ` (${event.judges.assistantReferee.nationality})`}
              </div>
              <div className="role">Ass. Referee</div>
            </div>
        )}

        {event.judges.panels.map(panel => {
          let count = 0;
          let curr = null;

          return panel.judges.map(judge => {
            const postfix = judge.type ? (judge.type === "SYNCRO" ? "S" : "E") : "";

            if (curr !== postfix) {
              curr = postfix;
              count = 0;
            }

            count += 1;

            return (
                <div className="resultline" key={judge.position}>
                  <div className="position" />
                  <div className="name">
                    {judge.name.toLowerCase()}
                    {judge.nationality && ` (${judge.nationality})`}
                  </div>
                  <div className="role">
                    {postfix}&nbsp;{count}
                  </div>
                </div>
            );
          });
        })}

        <div className="standingsFooter">{data.competition}</div>
      </div>
  );
};

// Results/Startlist view component
const ResultsView = ({ data, event, slice, isDods, isStartlist }) => {
  let results = isStartlist
      ? [...event.results].sort((a, b) => a.position - b.position)
      : event.results;

  // Handle pagination
  if (results.length > 10) {
    const start = (slice - 1) * 10;
    results = results.slice(start, Math.min(start + 10, results.length));
  }

  return (
      <div className="standings">
        <div className="standingsHeader">
          <div className="competition">{event.name}</div>
          <div className="description">
            {isStartlist ? "Start list" : `Results round ${event.round}`}
          </div>
        </div>

        {results.map((result, index) => (
            <div className="resultline" key={index}>
              <div className="position">
                {isStartlist ? result.position : result.rank}
              </div>
              <div className="name">
                <Flag
                    team={result.nationality || result.team}
                    override={isDods ? "/img/dods.svg" : undefined}
                />
                {result.name.toLowerCase()}
                {result.nationality && ` (${result.nationality})`}
              </div>
              {!isStartlist && (
                  <div className="points">{result.result}</div>
              )}
            </div>
        ))}

        <div className="standingsFooter">{data.competition}</div>
      </div>
  );
};

// Dive view component
const DiveView = ({ data, diver, event, isDods }) => {
  return (
      <div className="dive">
        <div className="header">
          <StreamPosition
              diver={diver}
              override={isDods ? "/img/dods.svg" : undefined}
          />
          <span className="name">
          {` ${diver.name.toLowerCase()}`}
            {diver.nationality && ` (${diver.nationality})`}
        </span>
        </div>

        {!isDods && (
            <div className="data">
              <div className="item">
                <div>
                  Round {event.round}/{event.rounds}
                </div>
              </div>
              <div className="item">
                <div>Dive {diver.dive.dive}</div>
                <div>DD {diver.dive.dd}</div>
              </div>
            </div>
        )}

        {!isDods && (
            <div className="data">
              <div className="item">
                <div>Current rank</div>
                <div>{diver.rank}</div>
              </div>
              <div className="item" />
            </div>
        )}
      </div>
  );
};

// Awards view component
const AwardsView = ({ data, diver, event, isDods }) => {
  return (
      <div className="awards">
        <div className="header">
          <StreamPosition
              diver={diver}
              override={isDods ? "/img/dods.svg" : undefined}
          />
          <span className="name">
          {` ${diver.name.toLowerCase()}`}
            {diver.nationality && ` (${diver.nationality})`}
        </span>
        </div>

        <div className="data">
          <div className="item">
            <div>
              Round {event.round}/{event.rounds}
            </div>
            <div>Current rank: {diver.rank}</div>
          </div>
          <div className="item">
            <div>
              Dive <strong>{diver.dive.result}</strong>
            </div>
            <div>
              Total <strong>{diver.result}</strong>
            </div>
          </div>
        </div>

        <div className="data judgeAwards">
          {diver.dive.effectiveAwards.map((award, index) => (
              <div className="judgeAward" key={index}>
                {award}
              </div>
          ))}
        </div>

        {(!/0[,.]0/.test(diver.dive.penalty) || diver.dive.maxAward !== "10") && (
            <div className="data judgeAwards">
              {!/0[,.]0/.test(diver.dive.penalty) && (
                  <div className="judgeAward">
                    <div>Penalty: {diver.dive.penalty}</div>
                  </div>
              )}

              {diver.dive.maxAward !== "10" && (
                  <div className="judgeAward">
                    <div>Max Award: {diver.dive.maxAward}</div>
                  </div>
              )}
            </div>
        )}
      </div>
  );
};

export default Scoreboard;