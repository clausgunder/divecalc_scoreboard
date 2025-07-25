import React from "react";
import { StreamPosition, Flag } from "./components/Positions.jsx";
export default class Scoreboard extends React.Component {
  constructor(props) {
    super(props);
    document.title = props.competition;
    this.filter = window.getParameterByName("filter");
    window.dead = !!window.getParameterByName("dods");
    console.log(window.getParameterByName('dods'));
    this.state = { data: {}, slice: 1 };
    this.socket = io("/divecalc");
    this.socket.on(this.props.channel, data => {
      this.handleData(data);
    });
  }
  handleData(data) {
    var self = this;
    const competitionData =
      data[this.props.competition] || Object.values(data)[0];
    competitionData && console.log(competitionData.action, competitionData);
    if (this.filter == "results" && competitionData) {
      competitionData.action = "results";
    }
    if (
      competitionData &&
      (!this.filter || new RegExp(this.filter).test(competitionData.action))
    ) {
      if (this.lock) {
        this.lockData = competitionData;
        return;
      }
      switch (competitionData.action) {
        case "awards":
          this.lock = setTimeout(() => {
            delete self.lock;
            if (self.lockData) {
              self.setState({
                data: self.lockData,
                slice: 1
              });
            }
            delete self.lockData;
          }, 9000);
          setTimeout(function() {
            self.setState({
              data: competitionData,
              slice: 1
            });
          }, 2000);
          if (
            competitionData.diver.position ==
            competitionData.event.results.length
          ) {
            setTimeout(() => {
              competitionData.action = "results";
              self.setState({
                data: competitionData,
                slice: 1
              });
            }, 5000);
          }
          break;
        default:
          self.setState({ data: competitionData, slice: 1 });
          break;
      }
    }
  }
  componentWillUnmount() {
    this.socket.off(this.props.channel);
  }
  render() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      delete this.timeout;
    }
    //this.timeout = setTimeout((() => this.setState({ data: {} })).bind(this), 6000);
    const data = this.state.data;
    if (!data) {
      return false;
    }
    const diver = data.diver;
    const event = data.event;
    switch (data.action) {
      case "judges":
        const panels = event.judges.panels.map(p => p.judges);
        const judges = [].concat.apply([], panels);
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
                    " (" + event.judges.referee.nationality + ")"}
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
                    " (" + event.judges.assistantReferee.nationality + ")"}
                </div>
                <div className="role">Ass. Referee</div>
              </div>
            )}
            {event.judges.panels.map(p => {
              const prefix = p.panel;
              let count = 0;
              let curr = null;
              return p.judges.map(j => {
                const postfix = j.type ? (j.type == "SYNCRO" ? "S" : "E") : "";
                if (curr != postfix) {
                  curr = postfix;
                  count = 0;
                }
                count += 1;
                return (
                  <div className="resultline" key={j.position}>
                    <div className="position" />
                    <div className="name">
                      {j.name.toLowerCase()}
                      {j.nationality && " (" + j.nationality + ")"}
                    </div>
                    <div className="role">
                      {postfix}
                      &nbsp;
                      {count}
                    </div>
                  </div>
                );
              });
            })}
            <div className="standingsFooter">{data.competition}</div>
          </div>
        );
      case "startlist":
      case "results":
        const startlist = data.action == "startlist";
        let results = startlist
          ? event.results.sort((a, b) => a.position - b.position)
          : event.results;
        const size = results.length;
        if (size > 10) {
          const start = (this.state.slice - 1) * 10;
          results = results.slice(start, start + 10);
          if (start > size) {
            if ((this.filter = "results")) {
              setTimeout(() => {
                this.setState({ slice: 1 });
              }, 10);
            }
            return false;
          }
          this.timeout = setTimeout(
            (() => this.setState({ slice: this.state.slice + 1 })).bind(this),
            5000
          );
        }
        return (
          <div className="standings">
            <div className="standingsHeader">
              <div className="competition">{event.name}</div>
              <div className="description">
                {startlist ? "Start list" : "Results round " + event.round}
              </div>
            </div>
            {results.map((r, i) => (
              <div className="resultline" key={i}>
                <div className="position">
                  {startlist ? r.position : r.rank}
                </div>
                <div className="name">
                  <Flag
                    team={r.nationality || r.team}
                    override={window.dead ? "/img/dods.svg" : false}
                  />
                  {r.name.toLowerCase()}
                  {r.nationality && " (" + r.nationality + ")"}
                </div>
                {!startlist && <div className="points">{r.result}</div>}
              </div>
            ))}
            <div className="standingsFooter">{data.competition}</div>
          </div>
        );
      case "dive":
        var self = this;
        self.timeout = setTimeout(() => {
          self.setState({ data: null, slice: 1 });
        }, 3000);
        console.log(window.dead)
        return (
          <div className="dive">
            <div className="header">
              <StreamPosition
                diver={diver}
                override={window.dead ? "/img/dods.svg" : false}
              />
              <span className="name">
                {" " + diver.name.toLowerCase()}
                {diver.nationality && " (" + diver.nationality + ")"}
              </span>
            </div>
            {!window.dead && (
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
            {!window.dead && (
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
      case "awards":
        var self = this;
        self.timeout = setTimeout(() => {
          self.setState({ data: null, slice: 1 });
        }, 3000);
        return (
          <div className="awards">
            <div className="header">
              <StreamPosition
                diver={diver}
                override={window.dead ? "/img/dods.svg" : false}
              />
              <span className="name">
                {" " + diver.name.toLowerCase()}
                {diver.nationality && " (" + diver.nationality + ")"}
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
              {diver.dive.effectiveAwards.map((a, i) => (
                <div className="judgeAward" key={i}>
                  {a}
                </div>
              ))}
            </div>
            {!/0[,.]0/.test(diver.dive.penalty) ||
            diver.dive.maxAward != "10" ? (
              <div className="data judgeAwards">
                <div className="judgeAward">
                  {!/0[,.]0/.test(diver.dive.penalty) && (
                    <div>Penalty: {diver.dive.penalty}</div>
                  )}
                </div>
                <div className="judgeAward">
                  {diver.dive.maxAward != "10" && (
                    <div>Max Award: {diver.dive.maxAward}</div>
                  )}
                </div>
              </div>
            ) : (
              false
            )}
          </div>
        );
      default:
        return <div />;
    }
  }
}
