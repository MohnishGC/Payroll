import React, { useEffect, useRef } from 'react';
import { Icon } from '../../../components/icons/Icon';
import './CaptchaBox.css';

export interface CaptchaBoxProps {
  code: string;
  onRefresh: () => void;
  className?: string;
}

export const CaptchaBox: React.FC<CaptchaBoxProps> = ({
  code,
  onRefresh,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = '#F1F5F9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw noise lines
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(91, 95, 239, ${0.15 + Math.random() * 0.25})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw noise dots
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(107, 114, 128, ${0.2 + Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1 + Math.random(),
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Draw Captcha text characters with rotation & color variations
    const chars = code.split('');
    const charWidth = canvas.width / (chars.length + 1);

    ctx.font = 'bold 22px "Inter", monospace';
    ctx.textBaseline = 'middle';

    chars.forEach((char, index) => {
      ctx.save();
      const x = charWidth * (index + 0.8);
      const y = canvas.height / 2 + (Math.random() * 6 - 3);
      const angle = (Math.random() * 0.4 - 0.2); // Random slant

      ctx.translate(x, y);
      ctx.rotate(angle);

      // Gradient text color
      ctx.fillStyle = index % 2 === 0 ? '#4F46E5' : '#312E81';
      ctx.fillText(char, 0, 0);

      ctx.restore();
    });
  }, [code]);

  return (
    <div className={`captcha-box ${className}`}>
      <div className="captcha-box__canvas-container">
        <canvas
          ref={canvasRef}
          width={150}
          height={48}
          className="captcha-box__canvas"
          aria-label={`Security Captcha Code: ${code}`}
        />
      </div>
      <button
        type="button"
        className="captcha-box__refresh-btn"
        onClick={onRefresh}
        title="Generate new Captcha"
        aria-label="Refresh Captcha"
      >
        <Icon name="refresh" size={18} />
      </button>
    </div>
  );
};
