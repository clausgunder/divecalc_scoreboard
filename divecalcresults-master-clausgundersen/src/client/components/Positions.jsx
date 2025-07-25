// src/client/components/Positions.jsx
import React from 'react';
import { logos } from '../data/logos';

export const StreamPosition = ({ diver, hidePosition = false, showRank = false, override = null }) => {
    return (
        <span
            className="position"
            style={{
                backgroundImage: (logos[diver.nationality || diver.team] || override) &&
                    `url(${override || logos[diver.nationality || diver.team]})`,
                backgroundSize: '100%'
            }}
        >
      {hidePosition ? '' : showRank ? diver.rank : diver.position}
    </span>
    );
};

export const Flag = ({ team, override = null }) => {
    return (
        <img className="flag" src={override || logos[team]} alt={team || ''} />
    );
};