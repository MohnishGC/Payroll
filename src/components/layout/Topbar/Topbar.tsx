import React, { useState } from 'react';
import { Icon } from '../../icons/Icon';
import './Topbar.css';

export interface TopbarProps {
  onToggleMobileMenu?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileMenu }) => {
  const [showBanner, setShowBanner] = useState<boolean>(true);

  return (
    <header className="topbar">
      {/* Top Search & Actions Row */}
      <div className="topbar__main">
        <button
          type="button"
          className="topbar__mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Open mobile navigation menu"
        >
          <Icon name="menu" size={20} />
        </button>

        <div className="topbar__search-wrapper">
          <span className="topbar__search-icon">
            <Icon name="search" size={18} />
          </span>
          <input
            type="text"
            className="topbar__search-input"
            placeholder="Search...."
            aria-label="Search dashboard and employees"
          />
          <span className="topbar__search-badge">⌘ K</span>
        </div>

        <div className="topbar__quick-actions">
          <button
            type="button"
            className="topbar__action-btn"
            title="Help & Support"
            aria-label="Help & Support"
          >
            <Icon name="helpCircle" size={19} />
          </button>
        </div>
      </div>

      {/* Dismissible Info Banner */}
      {showBanner && (
        <div className="topbar__banner">
          <div className="topbar__banner-content">
            <span className="topbar__banner-icon">
              <Icon name="zap" size={14} color="#FFFFFF" />
            </span>
            <span className="topbar__banner-text">
              <strong>New Update:</strong> Payroll calculation engine v2.4 is live. Experience 40% faster automated slip generation!
            </span>
          </div>
          <button
            type="button"
            className="topbar__banner-dismiss"
            onClick={() => setShowBanner(false)}
            aria-label="Dismiss banner"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      )}
    </header>
  );
};
