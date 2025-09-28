import React from 'react';
import './Header.css';

interface HeaderProps {
  onHamburgerClick: () => void;
  // New prop: called when the search input changes
  onSearch?: (query: string) => void;
  // Optional initial value for the search bar
  initialSearch?: string;
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ onHamburgerClick, onSearch, initialSearch = '' }, ref) => {
    const [search, setSearch] = React.useState(initialSearch);

    // Call onSearch whenever the input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      if (onSearch) onSearch(value);
    };

    return (
      <header className = "header" ref={ref}>
        <div className="header-content">
          {/* App Name on the left */}
          <div className="app-name">
            <img 
              src="/Logo.png" 
              alt="OneBoard Logo" 
              className="app-logo" 
            />
            <h1>OneBoard</h1>
          </div>
          {/* Search bar in the center */}
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-bar"
              value={search}
              onChange={handleChange}
              aria-label="Search"
            />
          </div>
          
          {/* Right side elements */}
          <div className="header-right">     
            {/* Hamburger menu */}
            <button 
              className="hamburger-menu" 
              aria-label="Menu"
              onClick={onHamburgerClick}
            >
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
            </button> 
            {/* Profile picture */}
            <div className="profile-picture" aria-label="Profile">
              <div className="profile-avatar"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }
);

export default Header;
