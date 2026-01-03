import { Share2 } from 'lucide-react';
import { translations } from '../utils/translations';
import './Header.css';

const Header = ({ language, setLanguage, ward, onShare }) => {
    const t = translations[language] || translations['en'];

    // Determine Label (Ward vs Prabhag)
    const isPrabhag = ward?.prabhag_ward?.toLowerCase() === 'prabhag';
    const unitLabel = isPrabhag ? t.prabhagLabel : t.wardLabel;

    // Determine Name
    const isLocalLang = language === 'mr' || language === 'hi';
    const wardDisplayName = (isLocalLang && ward?.name_marathi) ? ward.name_marathi : (ward?.name || "");

    return (
        <div className="header-section">
            {/* Main Navbar (Orange) */}
            <header className="evm-header">
                <div className="header-left">
                    <h1 className="company-name">Dummy Ballot Machine</h1>
                </div>

                <div className="header-right">
                    <div className="lang-dropdown-wrapper">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="lang-select"
                        >
                            <option value="en">English</option>
                            <option value="mr">मराठी</option>
                            <option value="hi">हिंदी</option>
                        </select>
                    </div>
                </div>
            </header>

            {/* Info Bar (White, stick below header) */}
            {wardDisplayName && (
                <div className="info-bar">
                    <div className="ward-badge">
                        {wardDisplayName}
                    </div>

                    <button className="info-share-btn" onClick={onShare}>
                        <Share2 size={16} /> <span className="share-text">{t.share}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Header;
