
import React from 'react';
import './CandidateRow.css';
import { translations } from '../utils/translations';

const CandidateRow = ({ serialNo, name, marathiName, symbol, photo, hasPhoto, onVote, isVoted, language, rowColor }) => {
    const t = translations[language];

    // Parse Name for Multi-language (Format: English | Marathi)
    // Parse Name: Priority -> Explicit Field -> Pipe Split -> Default
    let displayName = name;

    if (language === 'mr' || language === 'hi') {
        if (marathiName) {
            displayName = marathiName;
        } else if (name && name.includes('|')) {
            const parts = name.split('|');
            if (parts[1]) displayName = parts[1].trim();
        }
    } else {
        // English
        if (name && name.includes('|')) {
            displayName = name.split('|')[0].trim();
        }
    }

    return (
        <div className="candidate-row">
            {/* Paper Ballot Area */}
            <div className="paper-section" style={{ backgroundColor: rowColor || '#f3f4f6' }}>
                <div className="serial-no">{serialNo}</div>
                <div className="candidate-name">{displayName}</div>
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
                    className="vote-btn"
                    onClick={() => onVote(serialNo)}
                    disabled={isVoted || !name} // Disable if voted OR if no candidate name
                >
                    {name && <span className="btn-inner">{t.pressButton}</span>}
                </button>
            </div>
        </div>
    );
};

export default CandidateRow;

