const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const IconSettings = () => (
  <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></svg>
);
export const IconClose = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const IconZoomOut = () => (
  <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" /></svg>
);
export const IconBook = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M4 5.5C6.5 4 9.5 4 12 5.5 14.5 4 17.5 4 20 5.5V19c-2.5-1.5-5.5-1.5-8 0-2.5-1.5-5.5-1.5-8 0z" /><path d="M12 5.5V19" /></svg>
);
export const IconSun = () => (
  <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M5 19l1.4-1.4M17.6 6.4L19 5" /></svg>
);
export const IconMoon = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" /></svg>
);
