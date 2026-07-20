import React from 'react';
import { Icon } from '../../../components/icons/Icon';
import './StatCard.css';

export interface StatCardProps {
  title: string;
  value: string;
  deltaPercent: string;
  deltaDirection: 'up' | 'down';
  deltaLabel: string;
  onDetailsClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  deltaPercent,
  deltaDirection,
  deltaLabel,
  onDetailsClick,
}) => {
  const isUp = deltaDirection === 'up';

  return (
    <div className="stat-card">
      {/* Top Header Row */}
      <div className="stat-card__header">
        <div className="stat-card__title-group">
          <span className="stat-card__title">{title}</span>
          <span className="stat-card__info-icon" title="Information tooltip">
            <Icon name="helpCircle" size={15} />
          </span>
        </div>
        <button
          type="button"
          className="stat-card__menu-btn"
          aria-label="Stat options menu"
        >
          <Icon name="moreVertical" size={16} />
        </button>
      </div>

      {/* Main Metric & Percentage Badge */}
      <div className="stat-card__body">
        <span className="stat-card__value">{value}</span>
        <span className={`stat-card__badge ${isUp ? 'stat-card__badge--up' : 'stat-card__badge--down'}`}>
          <Icon name={isUp ? 'trendingUp' : 'trendingDown'} size={14} />
          <span>{deltaPercent}</span>
        </span>
      </div>

      {/* Bottom Footer Row */}
      <div className="stat-card__footer">
        <span className="stat-card__caption">{deltaLabel}</span>
        <button
          type="button"
          className="stat-card__details-btn"
          onClick={onDetailsClick}
        >
          <span>Details</span>
          <Icon name="arrowRight" size={14} />
        </button>
      </div>
    </div>
  );
};
