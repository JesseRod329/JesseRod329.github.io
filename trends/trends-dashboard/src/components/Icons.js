import React from 'react';

const IconBase = ({ size = 16, color = 'currentColor', children, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

export const TrendingUp = (props) => (
  <IconBase {...props}>
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
    <polyline points="16,7 22,7 22,13" />
  </IconBase>
);

export const TrendingDown = (props) => (
  <IconBase {...props}>
    <polyline points="22,17 13.5,8.5 8.5,13.5 2,7" />
    <polyline points="16,17 22,17 22,11" />
  </IconBase>
);

export const Activity = (props) => (
  <IconBase {...props}>
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
  </IconBase>
);

export const Globe = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="m12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </IconBase>
);

export const Search = (props) => (
  <IconBase {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </IconBase>
);

export const BarChart3 = (props) => (
  <IconBase {...props}>
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </IconBase>
);

export const Command = (props) => (
  <IconBase {...props}>
    <path d="m15 6 3 3-3 3" />
    <path d="m9 6-3 3 3 3" />
  </IconBase>
);

export const Hash = (props) => (
  <IconBase {...props}>
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </IconBase>
);

export const Zap = (props) => (
  <IconBase {...props}>
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
  </IconBase>
);

export const AlertCircle = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <circle cx="12" cy="16" r="1" />
  </IconBase>
);

export const ChevronUp = (props) => (
  <IconBase {...props}>
    <polyline points="18,15 12,9 6,15" />
  </IconBase>
);

export const ChevronDown = (props) => (
  <IconBase {...props}>
    <polyline points="6,9 12,15 18,9" />
  </IconBase>
);
