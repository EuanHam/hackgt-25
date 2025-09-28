import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <span>
                &copy; {new Date().getFullYear()} Made with love.
            </span>
        </footer>
    );
};

export default Footer;