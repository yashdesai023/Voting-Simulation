import React from 'react';
import './BallotUnit.css';
import CandidateRow from './CandidateRow';
import { translations } from '../utils/translations';

const BallotUnit = ({ unitIndex, startSerialNo, language, onVote, votedSerialNo, candidates, unitLabel, headerColor }) => {
    const t = translations[language];

    return (
        <div className="ballot-unit">
            {/* Unit Branding Row */}
            <div className="unit-branding-row" style={{ backgroundColor: headerColor || '#e5e7eb' }}>
                <span className="unit-label-text">{unitLabel}</span>
            </div>

            <div className="bu-header" style={{ backgroundColor: '#d1d5db' }}>
                <div className="header-paper">
                    <div className="header-col h-sr">{t.headerSrNo}</div>
                    <div className="header-col h-name">{t.headerName}</div>
                    <div className="header-col h-photo"></div>
                    <div className="header-col h-symbol">{t.headerSymbol}</div>
                </div>
                <div className="header-machine">
                    <div className="header-col h-btn">{t.headerButton}</div>
                </div>
            </div>

            <div className="candidates-list" style={{ backgroundColor: headerColor || '#e5e7eb' }}>
                {candidates.map((candidate, index) => {
                    const currentSerial = startSerialNo + index;
                    return (
                        <CandidateRow
                            key={currentSerial}
                            serialNo={currentSerial}
                            name={candidate.name}
                            symbol={candidate.symbol}
                            photo={candidate.photo}
                            hasPhoto={candidate.hasPhoto}
                            marathiName={candidate.marathiName}
                            language={language}
                            onVote={onVote}
                            isVoted={votedSerialNo === currentSerial}
                            rowColor={headerColor}
                        />
                    );
                })}
            </div>

            <div className="bu-footer">
                <div className="ready-lamp">
                    <span className="lamp-label">{t.ready}</span>
                    <div className="lamp-led green"></div>
                </div>
            </div>
        </div>
    );
};

export default BallotUnit;
