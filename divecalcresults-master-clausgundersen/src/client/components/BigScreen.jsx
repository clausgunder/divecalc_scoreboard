// src/client/components/BigScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { dives } from '../data/dives';
import { logos } from '../data/logos';
import DebugPanel from './DebugPanel';
import DiveCalcStatus from './DiveCalcStatus';

const BigScreen = ({ channel = 'screen', hideScore = false }) => {
  const [competitions, setCompetitions] = useState({});

  useEffect(() => {
    const socket = window.socketIO;

    if (!socket) {
      console.error('Socket.IO not initialized');
      return;
    }

    const handleData = (data) => {
      console.log('Received data in BigScreen component:', data);
      
      // Validate data structure before processing
      if (!data || typeof data !== 'object') {
        console.error('Invalid data format received:', data);
        return;
      }
      
      // Check for required fields in each competition
      const validatedData = {};
      Object.keys(data).forEach(key => {
        const competition = data[key];
        if (competition && competition.event && competition.event.name) {
          console.log(`Valid competition data for ${competition.event.name}`);
          validatedData[key] = competition;
        } else {
          console.warn(`Invalid competition data structure for key ${key}:`, competition);
        }
      });
      
      if (Object.keys(validatedData).length > 0) {
        setCompetitions(validatedData);
        console.log('Updated competitions state with validated data:', validatedData);
      } else {
        console.warn('No valid competition data received');
      }
    };

    console.log(`Subscribing to channel: ${channel}`);
    socket.on(channel, handleData);
    
    // Also listen on a generic 'screen' channel as fallback
    socket.on('screen', handleData);
    
    // Function to handle data updates from global event
    const handleDataUpdate = (event) => {
      const data = event.detail;
      console.log('BigScreen received data update from global event:', data);
      
      if (data && Object.keys(data).length > 0) {
        setCompetitions(data);
      }
    };
    
    // Listen for the custom event
    window.addEventListener('competitionDataUpdate', handleDataUpdate);
    
    return () => {
      socket.off(channel, handleData);
      socket.off('screen', handleData);
      window.removeEventListener('competitionDataUpdate', handleDataUpdate);
    };
  }, [channel]);

  // Debug output to see what's in the competitions state
  console.log('Current competitions state:', competitions);

  // Convert competitions object to array if it's not already
  const competitionsArray = Object.keys(competitions).map(key => {
    return {
      ...competitions[key],
      key: key // Keep the key for reference
    };
  });

  console.log('Competitions array:', competitionsArray);

  // Sort competitions by latest update and limit to 2
  const sortedCompetitions = _.chain(competitionsArray)
      .filter(x => x && x.event) // Make sure we have valid competition data
      .sortBy(x => -(x.latestUpdate || 0))
      .take(2)
      .sortBy(x => x?.event?.name)
      .value();

  console.log('Sorted competitions:', sortedCompetitions);

  // Add background image to BigScreen component
  // Find the return statement in BigScreen component and update it:
  
  return (
    <div className="bigscreen" style={{ 
      backgroundImage: 'url(/img/ado.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      {/* DiveCalc connection status indicator */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
        <DiveCalcStatus showDetails={true} />
      </div>
      {sortedCompetitions.length > 0 ? (
        sortedCompetitions.map(competition => (
          competition && competition.event && (
            <ScoreboardDisplay
              key={competition.event?.name || competition.key}
              {...competition}
              hideScore={hideScore}
            />
          )
        ))
      ) : (
        <>
          <div className="fallback-ui">
            <h2>No Competition Data Available</h2>
            <p>Waiting for competition data to be received...</p>
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
            </div>
          </div>
          <div className="no-data">Waiting for competition data...</div>
        </>
      )}
      <DebugPanel data={competitions} />
    </div>
  );
};

const ScoreboardDisplay = (props) => {
  const [slice, setSlice] = useState(1);
  const timeoutRef = useRef(null);
  const { hideScore } = props;

  useEffect(() => {
    // Set document title
    if (props.competition) {
      document.title = props.competition;
    }

    // Reset slice when props change
    setSlice(1);
  }, [props.competition]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!props || !props.event) {
    return null;
  }

  const { diver, event, action } = props;

  // Clear existing timeout
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }

  switch (action) {
    case "judges":
      return <JudgesPanel event={event} competition={props.competition} />;

    case "startlist":
    case "results":
      return <ResultsPanel
          event={event}
          competition={props.competition}
          action={action}
          slice={slice}
          setSlice={setSlice}
          timeoutRef={timeoutRef}
      />;

    default:
      return <DiverPanel
          diver={diver}
          event={event}
          action={action}
          competition={props.competition}
          hideScore={hideScore}
      />;
  }
};

const JudgesPanel = ({ event, competition }) => {
  const panels = event.judges.panels.map(p => p.judges);
  const judges = [].concat(...panels);
  const showFooter = judges.length + (event.judges.referee ? 1 : 0) +
      (event.judges.assistantReferee ? 1 : 0) < 11;

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
          const showPanel = event.judges.panels.length > 1;
          let count = 0;
          let curr = null;

          return panel.judges.map(judge => {
            const postfix = judge.type
                ? (judge.type === "SYNCRO" ? "S" : "E")
                : "";

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
                    {showPanel ? `(${panel.panel})` : ""}
                  </div>
                </div>
            );
          });
        })}

        {showFooter && (
            <div className="standingsFooter">
              {competition}
            </div>
        )}
      </div>
  );
};

const ResultsPanel = ({ event, competition, action, slice, setSlice, timeoutRef }) => {
  const isStartlist = action === "startlist";

  // Sort results based on action type
  let results = isStartlist
      ? [...event.results].sort((a, b) => a.position - b.position)
      : event.results;

  // Handle pagination for large result sets
  const size = results.length;
  if (size > 9) {
    const start = (slice - 1) * 9;
    results = results.slice(start, start + 9);

    // Reset to first page if we've gone past the end
    if (start >= size) {
      setTimeout(() => setSlice(1), 10);
      return null;
    }

    // Set timeout to show next page
    timeoutRef.current = setTimeout(
        () => setSlice(prev => prev + 1),
        15000
    );
  }

  return (
      <div className="standings">
        <div className="standingsHeader">
          <div className="competition">{event.name}</div>
          <div className="description">
            {isStartlist ? "Startlist" : `Result round ${event.round}`}
          </div>
        </div>

        {results.map((result, i) => (
            <div className="resultline" key={i}>
              <div
                  className="position"
                  style={{
                    backgroundImage: `url(${logos[result.nationality] || logos[result.team]})`,
                    backgroundSize: "contain"
                  }}
              />
              <div className="name">
                {isStartlist ? result.position : result.rank}.&nbsp;
                {result.name.toLowerCase()}
                {result.nationality && ` (${result.nationality})`}
              </div>
              {!isStartlist && <div className="points">{result.result}</div>}
            </div>
        ))}

        <div className="standingsFooter">
          {competition}
        </div>
      </div>
  );
};

const DiverPanel = ({ diver, event, competition, action, hideScore = false }) => {
  if (!diver || !diver.dive) {
    return null;
  }

  // Parse dive code to get dive name
  const diveMatch = /(\d+)(\w)/.exec(diver.dive.dive);
  const diveName = diveMatch && dives[diveMatch[1]];
  const logo = logos[diver.nationality || diver.team];

  // Check if height should be shown
  const showHeight = ["5", "7.5", "10", "7,5"].includes(diver.dive.height);

  return (
      <div className="standings">
        <div className="standingsHeader">
          <div className="competition">
            {event.name}
          </div>
          {!hideScore && (
              <div className="description">
                {`Top ${
                    event.results.filter(r => r.rank > 0).slice(0, 5).length
                } round ${event.round}`}
              </div>
          )}
        </div>

        {/* Top rankings section */}
        {!hideScore && event.results
            .filter(r => r.rank > 0)
            .slice(0, 5)
            .map((result, i) => (
                <div className="resultline" key={i}>
                  <div
                      className="position"
                      style={{
                        backgroundImage: `url(${logos[result.nationality] || logos[result.team]})`,
                        backgroundSize: "contain"
                      }}
                  />
                  <div className="name">
                    {result.rank}.&nbsp;{result.name.toLowerCase()}
                    {result.nationality && ` (${result.nationality})`}
                  </div>
                  <div className="points">{result.result}</div>
                </div>
            ))}

        <div className="spacer" />

        {/* Current diver section */}
        <div className="diver">
          <div
              className="position"
              style={{ backgroundImage: `url(${logo})` }}
          />

          {showHeight ? (
              <div className="name">
                {diver.position + ". " + diver.name.toLowerCase()}
                {diver.nationality && ` (${diver.nationality})`}
                {` (${event.round}/${event.rounds})`}
              </div>
          ) : (
              <div className="name">
                {diver.position + ". " + diver.name.toLowerCase()}
                {diver.nationality && ` (${diver.nationality})`}
              </div>
          )}

          {showHeight ? (
              <div className="round">{diver.dive.height} m</div>
          ) : (
              <div className="round">
                {event.round + "/" + event.rounds}
              </div>
          )}

          <div className="bsdive">
            <div className="code">{diver.dive.dive}</div>
            <div className="dd">{diver.dive.dd}</div>
          </div>
        </div>

        {/* Information line for dive */}
        {action === "dive" && (
            <div className="whiteline awardline">
              <div>Current rank: {hideScore ? "N/A" : diver.rank}</div>
              <div>Total: {diver.result}</div>
              <div className="divename">{diveName}</div>
            </div>
        )}

        {/* Judge scores for awards */}
        {action === "awards" && diver.dive.effectiveAwards && (
            <div className="whiteline awardline">
              {diver.dive.effectiveAwards.map((award, i) => (
                  <div className="result" key={i}>{award}</div>
              ))}
            </div>
        )}

        {/* Summary line for awards */}
        {action === "awards" && (
            <div className="whiteline awardline">
              <div>Dive: {diver.dive.result}</div>
              <div>Total: {diver.result}</div>
              <div>Rank: {hideScore ? "N/A" : diver.rank}</div>
            </div>
        )}

        {/* Penalty info if applicable */}
        {action === "awards" &&
            (!/0[,.]0/.test(diver.dive.penalty) || diver.dive.maxAward !== "10") && (
                <div className="whiteline awardline">
                  {!/0[,.]0/.test(diver.dive.penalty) && (
                      <div>Penalty: {diver.dive.penalty}</div>
                  )}
                  {diver.dive.maxAward !== "10" && (
                      <div>Max award: {diver.dive.maxAward}</div>
                  )}
                </div>
            )}
      </div>
  );
};

export default BigScreen;

