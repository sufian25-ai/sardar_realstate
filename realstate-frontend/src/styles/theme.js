// Sardar Real Estate - Premium Design System
// Unique color palette different from competitors

export const theme = {
  colors: {
    // Primary - Deep Royal Blue (Unique)
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1', // Main
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    },
    // Accent - Luxurious Gold
    accent: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Main Gold
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    // Dark Theme
    dark: {
      bg: '#030712',      // Deep black
      card: '#0f172a',    // Card background
      border: '#1e293b',  // Border
      surface: '#1e293b', // Surface
    },
    // Gradients
    gradients: {
      primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
      gold: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)',
      dark: 'linear-gradient(180deg, #030712 0%, #0f172a 100%)',
      glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    }
  },
  
  // Glassmorphism effects
  glass: {
    light: 'backdrop-blur-xl bg-white/5 border border-white/10',
    medium: 'backdrop-blur-xl bg-white/10 border border-white/20',
    dark: 'backdrop-blur-xl bg-black/20 border border-white/10',
  },
  
  // Animation presets
  animations: {
    fadeUp: 'animate-fadeUp',
    fadeIn: 'animate-fadeIn',
    slideLeft: 'animate-slideLeft',
    slideRight: 'animate-slideRight',
    float: 'animate-float',
    pulse: 'animate-pulse',
    shimmer: 'animate-shimmer',
  }
};

export default theme;
