import { Share2, Calendar, Clock, Landmark } from 'lucide-react';
import './ElectionInfoCard.css';
import { translations } from '../utils/translations';

const ElectionInfoCard = ({ ward, candidateName, language }) => {
    // Defensive check
    const t = translations[language] || translations['en'];
    if (!t) return null; // Should not happen

    // Determine Label (Ward vs Prabhag)
    const isPrabhag = ward?.prabhag_ward?.toLowerCase() === 'prabhag';
    const unitLabel = isPrabhag ? t.prabhagLabel : t.wardLabel;

    // Determine Name (English vs Marathi)
    const isLocalLang = language === 'mr' || language === 'hi';
    const wardDisplayName = (isLocalLang && ward?.name_marathi) ? ward.name_marathi : (ward?.name || "N/A");

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Election - ${wardDisplayName}`,
                    text: t.slogan,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <div className="election-card">
            <div className="card-header">
                <div className="ward-info">
                    <Landmark size={20} className="ward-icon" />
                    <span className="ward-badge">{unitLabel}: {wardDisplayName}</span>
                </div>
                <button className="share-btn" onClick={handleShare}>
                    <Share2 size={18} /> {t.share}
                </button>
            </div>

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
                    <h2 className="promo-name">{candidateName || t.candidateNamePlaceholder}</h2>
                    <div className="promo-slogan-container">
                        <p className="promo-slogan">{t.slogan}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ElectionInfoCard;
