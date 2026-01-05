import React from 'react';
import { Share2, CheckCircle } from 'lucide-react';
import './CompletionCard.css';
import { translations } from '../utils/translations';
import { getImageUrl } from '../lib/pocketbase';

const CompletionCard = ({ ward, language, votedCandidate, allCandidates, onShare }) => {
    const t = translations[language] || translations['en'];
    if (!t) return null;

    // Branding Image URL
    const brandingImageUrl = ward.last_photo ? getImageUrl(ward.collectionId, ward.id, ward.last_photo) : null;

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
                {/* All Candidates List */}
                {allCandidates && Object.values(allCandidates).length > 0 && (
                    <div className="all-candidates-list">
                        <h3>{t.participatingCandidates}</h3>
                        <div className="candidates-grid">
                            {Object.entries(allCandidates).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).map(([idx, candidate]) => {
                                return (
                                    <div key={idx} className="voted-card" style={{ marginTop: '10px' }}>
                                        {/* Left: Photo */}
                                        <div className="voted-photo-wrapper">
                                            {candidate.photo ? (
                                                <img
                                                    src={getImageUrl(candidate.collectionId, candidate.id, candidate.photo)}
                                                    alt="Candidate"
                                                    className="voted-photo"
                                                />
                                            ) : (
                                                <div className="voted-photo-placeholder">
                                                    {candidate.name?.charAt(0)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Middle: Info */}
                                        <div className="voted-info">
                                            <h3 className="voted-name">
                                                {language === 'mr' || language === 'hi' ? (candidate.marathiName || candidate.name) : candidate.name}
                                            </h3>
                                            <div className="voted-position">
                                                <span className="pos-label">{t.headerSrNo}</span> {candidate.index || (parseInt(idx) + 1)}
                                            </div>
                                        </div>

                                        {/* Right: Symbol */}
                                        <div className="voted-symbol-area">
                                            {candidate.symbol && (
                                                <img
                                                    src={getImageUrl(candidate.collectionId, candidate.id, candidate.symbol)}
                                                    alt="Symbol"
                                                    className="voted-symbol"
                                                />
                                            )}
                                            {/* Show check for everyone as requested */}
                                            <div className="voted-check">
                                                <CheckCircle size={24} color="white" fill="#22c55e" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="action-area">
                    <button className="share-btn-large" onClick={onShare}>
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
