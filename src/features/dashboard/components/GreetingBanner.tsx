import React from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';

export const GreetingBanner: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.name ? user.name.split(' ')[0] : 'Arnold';

  // Format real current date in "Wednesday, 06 March 2025" style
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(today);

  return (
    <div className="greeting-banner" style={{ marginBottom: '24px' }}>
      <h1
        style={{
          fontSize: '32px',
          fontWeight: 800,
          color: 'var(--color-text-heading)',
          letterSpacing: '-0.6px',
          marginBottom: '6px',
        }}
      >
        Hallo, {userName}
      </h1>
      <p
        style={{
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--color-text-muted)',
        }}
      >
        {formattedDate}
      </p>
    </div>
  );
};
