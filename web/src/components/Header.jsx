import React from 'react';
import './Header.css';

const Header = ({ language, setLanguage }) => {
    return (
        <header className="evm-header">
            <div className="logo-section">
                <h1 className="company-name">Dummy Ballot Machine</h1>
            </div>

            <div className="controls-section">
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
    );
};

export default Header;
