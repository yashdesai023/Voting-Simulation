import { Calendar, Clock } from 'lucide-react';
import './ElectionInfoCard.css';
import { translations } from '../utils/translations';

const ElectionInfoCard = ({ ward, candidateName, language, unitLetter }) => {
    // Defensive check
    const t = translations[language] || translations['en'];
    if (!t) return null; // Should not happen

    return (
        <div className="election-card">
            {/* Header moved to sticky Layout Header */}

            <div className="card-body">
                <div className="election-timing">
                    <div className="time-row">
                        <Calendar size={16} className="icon" />
                        <span>{t.electionDate}</span>
                    </div>
                    <div className="time-row">
                        <Clock size={16} className="icon" />
                        <span>{t.votingTime}</span>
                    </div>
                </div>

                <div className="candidate-promo">
                    <h2 className="promo-name">
                        {candidateName || t.candidateNamePlaceholder}
                        {unitLetter && <span className="unit-letter-badge"> {unitLetter} </span>}
                        {ward?.prabhag_number && (
                            <span className="prabhag-badge">
                                ({language === 'mr' ? 'प्रभाग क्र.' : 'Prabhag No.'} {ward.prabhag_number})
                            </span>
                        )}
                    </h2>
                    <div className="promo-slogan-container">
                        <p className="promo-slogan">{t.slogan}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ElectionInfoCard;
