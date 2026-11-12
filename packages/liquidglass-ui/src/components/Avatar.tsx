import { forwardRef, HTMLAttributes, ReactNode, CSSProperties, useState } from 'react';
import { cn } from '../utils/cn';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'busy' | 'away';
}

const sizeConfig = {
  xs: { size: 24, fontSize: 10, statusSize: 6 },
  sm: { size: 32, fontSize: 12, statusSize: 8 },
  md: { size: 40, fontSize: 14, statusSize: 10 },
  lg: { size: 56, fontSize: 18, statusSize: 12 },
  xl: { size: 80, fontSize: 24, statusSize: 16 },
};

const statusColors = {
  online: 'var(--lg-success)',
  offline: 'var(--lg-muted)',
  busy: 'var(--lg-destructive)',
  away: 'var(--lg-warning)',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      style,
      src,
      alt = '',
      fallback,
      size = 'md',
      shape = 'circle',
      status,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);
    const config = sizeConfig[size];

    const showFallback = !src || imageError;

    const avatarStyles: CSSProperties = {
      width: config.size,
      height: config.size,
      fontSize: config.fontSize,
      borderRadius: shape === 'circle' ? '50%' : '20%',
      ...style,
    };

    const renderFallback = () => {
      if (fallback) return fallback;
      if (alt) return getInitials(alt);
      return (
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          'lg-glass relative inline-flex items-center justify-center',
          'overflow-hidden font-medium',
          'text-[var(--lg-foreground-secondary)]',
          className
        )}
        style={avatarStyles}
        {...props}
      >
        {showFallback ? (
          renderFallback()
        ) : (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        )}

        {status && (
          <span
            className="absolute bottom-0 right-0 rounded-full border-2 border-white"
            style={{
              width: config.statusSize,
              height: config.statusSize,
              backgroundColor: statusColors[status],
            }}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
