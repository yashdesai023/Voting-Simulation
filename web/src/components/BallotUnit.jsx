import React, { useRef, useEffect } from 'react';
import './BallotUnit.css';
import CandidateRow from './CandidateRow';
import { translations } from '../utils/translations';

const BallotUnit = ({ machineId, sections, language, onVote, votedSerialNo, currentUnitIndex, onSectionVisible }) => {
    const t = translations[language];
    const scrollContainerRef = useRef(null);

    // Intersection Observer for Header Update
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            // Find the entry with the highest intersection ratio
            let maxRatio = 0;
            let maxIndex = -1;

            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                    maxRatio = entry.intersectionRatio;
                    maxIndex = parseInt(entry.target.getAttribute('data-admin-index'));
                }
            });

            if (maxIndex !== -1 && onSectionVisible) {
                onSectionVisible(maxIndex);
            }
        }, {
            threshold: [0.1, 0.3, 0.5, 0.7, 0.9], // Multiple thresholds for better granularity
            rootMargin: "-10% 0px -50% 0px" // Focus on top half of viewport
        });

        sections.forEach((_, idx) => {
            const el = document.getElementById(`section-${machineId}-${idx}`);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [sections, machineId, onSectionVisible]);

    // Auto-Scroll Logic using refined animation
    useEffect(() => {
        if (votedSerialNo !== null) {
            const votedSectionIndexLocal = sections.findIndex(s => s.adminUnitIndex === currentUnitIndex);

            if (votedSectionIndexLocal !== -1) {
                // Find next valid section locally
                let nextValidLocalIndex = -1;
                for (let i = votedSectionIndexLocal + 1; i < sections.length; i++) {
                    if (sections[i].isValid) {
                        nextValidLocalIndex = i;
                        break;
                    }
                }

                if (nextValidLocalIndex !== -1) {
                    const elementId = `section-${machineId}-${nextValidLocalIndex}`;
                    import('../utils/scroll').then(module => {
                        module.smoothScrollToElement(elementId, 160, 2000);
                    });
                }
            }
        } else {
            // On Load / Navigation (without vote): Ensure we scroll to the active section if valid
            // e.g. If A is blocked, App switches to B. We must scroll to B.
            const targetLocalIndex = sections.findIndex(s => s.adminUnitIndex === currentUnitIndex);

            // If it's the very first section (local index 0), just scroll to top of PAGE to ensure clean start
            if (targetLocalIndex === 0 && sections[targetLocalIndex].isValid) {
                import('../utils/scroll').then(module => {
                    module.smoothScrollTo(0, 1000);
                });
            }
            else if (targetLocalIndex !== -1 && sections[targetLocalIndex].isValid) {
                const elementId = `section-${machineId}-${targetLocalIndex}`;
                // Short delay to ensure render
                setTimeout(() => {
                    import('../utils/scroll').then(module => {
                        module.smoothScrollToElement(elementId, 160, 1000);
                    });
                }, 100);
            }
        }
    }, [votedSerialNo, currentUnitIndex, sections, machineId]);

    return (
        <div className="ballot-unit-container" ref={scrollContainerRef}>
            <div className="ballot-unit-casing">
                {sections.map((section, localIndex) => (
                    <div
                        key={section.id}
                        id={`section-${machineId}-${localIndex}`}
                        className={`section-block ${!section.isValid ? 'section-blocked' : ''}`}
                        data-admin-index={section.adminUnitIndex}
                    >
                        {/* Blocked Overlay */}
                        {!section.isValid && (
                            <div className="blocked-overlay">
                                <span className="blocked-text">NOT IN USE</span>
                            </div>
                        )}

                        {/* Unit Branding Row */}
                        <div className="unit-branding-row" style={{ backgroundColor: section.color }}>
                            <span className="unit-label-text">
                                {(language === 'mr' || language === 'hi') ? section.labelMr : section.labelEn}.
                            </span>
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

                        <div className="candidates-list" style={{ backgroundColor: section.color }}>
                            {section.candidates.map((candidate, index) => {
                                // Serial No logic: Reset to 1 for each section?
                                // User said: "keep the sr. no with properly like A section start with 1 and B also start with 1"
                                // So we simply use index + 1
                                const currentSerial = index + 1;

                                const isThisSectionActive = currentUnitIndex === section.adminUnitIndex;
                                const isVoted = isThisSectionActive && votedSerialNo === currentSerial;

                                return (
                                    <CandidateRow
                                        key={`${section.id}-${currentSerial}`}
                                        serialNo={currentSerial}
                                        name={candidate.name}
                                        symbol={candidate.symbol}
                                        photo={candidate.photo}
                                        hasPhoto={candidate.hasPhoto}
                                        marathiName={candidate.marathiName}
                                        language={language}
                                        onVote={(serial) => onVote(serial, section.adminUnitIndex)}
                                        isVoted={isVoted}
                                        rowColor={section.color}
                                        isDisabled={candidate.isDisabled}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
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
