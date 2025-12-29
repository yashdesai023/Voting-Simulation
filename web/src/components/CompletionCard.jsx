import React from 'react';
import { Share2, CheckCircle } from 'lucide-react';
import './CompletionCard.css';
import { translations } from '../utils/translations';
import { getImageUrl } from '../lib/pocketbase';

const CompletionCard = ({ ward, language, votedCandidate, allCandidates }) => {
    const t = translations[language] || translations['en'];
    if (!t) return null;

    // Branding Image URL
    const brandingImageUrl = ward.last_photo ? getImageUrl(ward.collectionId, ward.id, ward.last_photo) : null;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `I Voted! - ${ward.name}`,
                    text: t.slogan,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <div className="completion-card">
            {/* 16:9 Branding Image Area */}
            <div className="branding-section">
                {brandingImageUrl ? (
                    <img src={brandingImageUrl} alt="Election Branding" className="branding-image" />
                ) : (
                    <div className="branding-placeholder">
                        <span>{ward.name}</span>
                    </div>
                )}
            </div>

            <div className="completion-content">
                <div className="success-icon">
                    <CheckCircle size={60} color="#16a34a" fill="#dcfce7" />
                </div>

                <h1 className="thank-you-msg">
                    {language === 'mr' ? 'आपले मत नोंदवले गेले आहे!' :
                        language === 'hi' ? 'आपका वोट दर्ज कर लिया गया है!' :
                            'Your vote has been recorded!'}
                </h1>

                <p className="sub-msg">
                    {language === 'mr' ? 'लोकशाहीच्या बळकटीकरणासाठी योगदान दिल्याबद्दल धन्यवाद.' :
                        language === 'hi' ? 'लोकतंत्र को मजबूत बनाने में योगदान देने के लिए धन्यवाद।' :
                            'Thank you for contributing to strengthening democracy.'}
                </p>

                {/* Vote Summary */}
                <div className="vote-summary">
                    <div className="summary-row">
                        <span className="label">{t.ward}</span>
                        <span className="value">{ward.name}</span>
                    </div>
                    <div className="summary-row">
                        <span className="label">{t.electionDate}</span>
                        <span className="value">15 Jan 2026</span>
                    </div>

                </div>

                {/* All Candidates List */}
                {allCandidates && Object.values(allCandidates).length > 0 && (
                    <div className="all-candidates-list">
                        <h3>Participating Candidates</h3>
                        <div className="candidates-grid">
                            {Object.entries(allCandidates).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).map(([idx, candidate]) => (
                                <div key={idx} className="candidate-mini-card">
                                    <span className="machine-label">Machine {parseInt(idx) + 1}</span>
                                    <span className="cand-name">
                                        {language === 'mr' || language === 'hi' ? (candidate.marathiName || candidate.name) : candidate.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="action-area">
                    <button className="share-btn-large" onClick={handleShare}>
                        <Share2 size={20} /> {t.share}
                    </button>
                    <a href={`/${ward.id}`} className="home-link">
                        {language === 'mr' ? 'नवीन मत नोंदवा' : 'Cast Another Vote'}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CompletionCard;
