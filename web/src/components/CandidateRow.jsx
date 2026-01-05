
import React from 'react';
import './CandidateRow.css';
import { translations } from '../utils/translations';

const CandidateRow = ({ serialNo, name, marathiName, symbol, photo, hasPhoto, onVote, isVoted, language, rowColor, isDisabled }) => {
    const t = translations[language];

    // Parse Name for Multi-language (Format: English | Marathi)
    let englishName = name;
    let regionalName = marathiName;

    if (name && name.includes('|')) {
        const parts = name.split('|');
        englishName = parts[0].trim();
        if (!regionalName && parts[1]) {
            regionalName = parts[1].trim();
        }
    }

    return (
        <div className="candidate-row">
            {/* Paper Ballot Area */}
            <div className="paper-section" style={{ backgroundColor: rowColor || '#f3f4f6' }}>
                <div className="serial-no">{serialNo}</div>
                <div className="candidate-name">
                    <div className="name-en">{englishName}</div>
                    {regionalName && <div className="name-regional">{regionalName}</div>}
                </div>
                <div className="candidate-photo">
                    {hasPhoto ? (
                        photo ? <img src={photo} alt="Candidate" className="row-img-photo" /> : <div className="photo-placeholder">👤</div>
                    ) : null}
                </div>
                <div className="symbol">
                    {symbol ? <img src={symbol} alt="Symbol" className="row-img-symbol" /> : null}
                </div>
            </div>

            {/* Machine Button Area */}
            <div className="machine-section">
                <div className={`led ${isVoted ? 'led-on' : ''}`}></div>
                <button
                    className={`vote-btn ${isDisabled ? 'vote-btn-disabled' : ''}`}
                    onClick={() => !isDisabled && onVote(serialNo)}
                    disabled={isVoted || !name || isDisabled}
                >
                    {name && <span className="btn-inner">{t.pressButton}</span>}
                </button>
            </div>
        </div>
    );
};

export default CandidateRow;
