import React from 'react';
import { Globe } from 'lucide-react';
import './Header.css';

const Header = ({ language, setLanguage }) => {
    return (
        <header className="evm-header">
            <div className="logo-section">
                <div className="logo-placeholder">LOGO</div>
                <h1 className="company-name">Company Name</h1>
            </div>

            <div className="controls-section">
                <div className="lang-dropdown-wrapper">
                    <Globe size={18} className="lang-icon" />
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="lang-select"
                    >
                        <option value="en">English</option>
                        <option value="mr">मराठी (Marathi)</option>
                        <option value="hi">हिंदी (Hindi)</option>
                    </select>
                </div>
            </div>
        </header>
    );
};

export default Header;
