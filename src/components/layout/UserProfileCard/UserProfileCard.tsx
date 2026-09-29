import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../../icons/Icon';
import { useAuth } from '../../../app/providers/AuthProvider';
import { employeeApi } from '../../../features/employee/services/employeeApi';
import { useSecureImage } from '../../../features/employee/hooks/useSecureImage';
import './UserProfileCard.css';

export interface UserProfileCardProps {
  isCollapsed?: boolean;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ isCollapsed = false }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [avatarPath, setAvatarPath] = useState<string | undefined>(undefined);
  const cardRef = useRef<HTMLDivElement>(null);

  const name = user?.name || 'Arnold Smith';
  const email = user?.username && user.username.includes('@')
    ? user.username
    : `${user?.username || 'arnold.smith'}@efficio.io`;

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  useEffect(() => {
    const idOrCode = user?.employeeId || user?.employeeCode;
    if (idOrCode) {
      employeeApi.getById(idOrCode)
        .then((emp) => {
          if (emp) {
            setAvatarPath(emp.avatarUrl || (emp as any).AvatarUrl);
          }
        })
        .catch((err) => console.error('Failed to load user avatar:', err));
    }
  }, [user?.employeeId, user?.employeeCode]);

  const { src: secureAvatarUrl } = useSecureImage(avatarPath);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`user-profile-card ${isCollapsed ? 'user-profile-card--collapsed' : ''}`} ref={cardRef}>
      <button
        type="button"
        className="user-profile-card__trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="User account menu"
      >
        <div className="user-profile-card__avatar">
          {secureAvatarUrl ? (
            <img
              src={secureAvatarUrl}
              alt={name}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          ) : (
            initials
          )}
        </div>
        {!isCollapsed && (
          <div className="user-profile-card__info">
            <span className="user-profile-card__name">{name}</span>
            <span className="user-profile-card__email">{email}</span>
          </div>
        )}
        {!isCollapsed && (
          <span className={`user-profile-card__chevron ${isOpen ? 'user-profile-card__chevron--open' : ''}`}>
            <Icon name="chevronDown" size={16} />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="user-profile-card__dropdown" role="menu">
          <div className="user-profile-card__dropdown-header">
            <span className="user-profile-card__dropdown-name">{name}</span>
            <span className="user-profile-card__dropdown-role">{user?.role || 'Administrator'}</span>
          </div>
          <div className="user-profile-card__dropdown-divider" />
          <button type="button" className="user-profile-card__dropdown-item" role="menuitem">
            <Icon name="user" size={16} />
            <span>Profile Settings</span>
          </button>
          <button
            type="button"
            className="user-profile-card__dropdown-item user-profile-card__dropdown-item--logout"
            onClick={logout}
            role="menuitem"
          >
            <Icon name="logOut" size={16} />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
