
import React from 'react';
import { Palette, Sun, Moon, Sparkles, Heart, Zap } from 'lucide-react';
import { Theme } from '../types/theme';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const themes: Theme[] = [
  {
    id: 'light',
    name: 'Light',
    className: '',
    colors: {
      bg: '#e0e5ec',
      light: '#ffffff',
      dark: '#a3b1c6',
      text: '#2c3e50',
      accent: '#3498db'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    className: 'dark',
    colors: {
      bg: '#2c3e50',
      light: '#3a4e63',
      dark: '#1e2a38',
      text: '#ecf0f1',
      accent: '#3498db'
    }
  },
  {
    id: 'theme-purple',
    name: 'Purple',
    className: 'theme-purple',
    colors: {
      bg: '#e8e2f0',
      light: '#f5f1f9',
      dark: '#c9bdd4',
      text: '#4a3c5a',
      accent: '#9b59b6'
    }
  },
  {
    id: 'theme-green',
    name: 'Green',
    className: 'theme-green',
    colors: {
      bg: '#e8f5e8',
      light: '#f1f9f1',
      dark: '#c4d9c4',
      text: '#2d4a2d',
      accent: '#27ae60'
    }
  },
  {
    id: 'theme-orange',
    name: 'Orange',
    className: 'theme-orange',
    colors: {
      bg: '#f5e8d3',
      light: '#f9f1e6',
      dark: '#d4c4a8',
      text: '#5a4a2d',
      accent: '#e67e22'
    }
  },
  {
    id: 'theme-pink',
    name: 'Pink',
    className: 'theme-pink',
    colors: {
      bg: '#f0e2e8',
      light: '#f9f1f5',
      dark: '#d4bdc9',
      text: '#5a3c4a',
      accent: '#e91e63'
    }
  },
  {
    id: 'theme-blue',
    name: 'Blue',
    className: 'theme-blue',
    colors: {
      bg: '#e2f0f8',
      light: '#f1f9fc',
      dark: '#bdd4e0',
      text: '#1a3c5a',
      accent: '#2980b9'
    }
  },
  {
    id: 'theme-teal',
    name: 'Teal',
    className: 'theme-teal',
    colors: {
      bg: '#e0f2f1',
      light: '#f1f9f8',
      dark: '#c2d6d4',
      text: '#2d4a45',
      accent: '#26a69a'
    }
  },
  {
    id: 'theme-indigo',
    name: 'Indigo',
    className: 'theme-indigo',
    colors: {
      bg: '#e8eaf6',
      light: '#f3f4fc',
      dark: '#c5cae9',
      text: '#3f51b5',
      accent: '#3f51b5'
    }
  },
  {
    id: 'theme-amber',
    name: 'Amber',
    className: 'theme-amber',
    colors: {
      bg: '#fff8e1',
      light: '#fffcf5',
      dark: '#f0e68c',
      text: '#5a4a00',
      accent: '#ffc107'
    }
  },
  {
    id: 'theme-rose',
    name: 'Rose',
    className: 'theme-rose',
    colors: {
      bg: '#fce4ec',
      light: '#fdf2f7',
      dark: '#f8bbd9',
      text: '#880e4f',
      accent: '#e91e63'
    }
  },
  {
    id: 'theme-violet',
    name: 'Violet',
    className: 'theme-violet',
    colors: {
      bg: '#f3e5f5',
      light: '#faf2fb',
      dark: '#e1bee7',
      text: '#4a148c',
      accent: '#9c27b0'
    }
  }
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  const getThemeIcon = (themeId: string) => {
    switch (themeId) {
      case 'light': return <Sun className="w-4 h-4" />;
      case 'dark': return <Moon className="w-4 h-4" />;
      case 'theme-pink':
      case 'theme-rose': return <Heart className="w-4 h-4" />;
      case 'theme-purple':
      case 'theme-violet': return <Sparkles className="w-4 h-4" />;
      case 'theme-amber': return <Zap className="w-4 h-4" />;
      default: return <div 
        className="w-4 h-4 rounded-full animate-scale-pulse"
        style={{ backgroundColor: themes.find(t => t.id === themeId)?.colors.accent }}
      />;
    }
  };

  return (
    <div className="neo-panel animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="animate-rotate-slow">
          <Palette className="w-6 h-6 text-neo-accent" />
        </div>
        <h3 className="text-xl font-bold text-neo-text">Choose Your Theme</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            className={`neo-button neo-theme-button flex items-center gap-3 justify-start p-4 relative overflow-hidden ${
              currentTheme === theme.id ? 'shadow-neo-pressed ring-2 ring-neo-accent' : ''
            }`}
            style={{
              background: currentTheme === theme.id ? 
                `linear-gradient(45deg, ${theme.colors.bg}, ${theme.colors.light})` : 
                undefined
            }}
          >
            <div className="flex items-center gap-3 relative z-10">
              {getThemeIcon(theme.id)}
              <span className="text-sm font-medium">{theme.name}</span>
            </div>
            
            {/* Animated background gradient */}
            <div 
              className="absolute inset-0 opacity-20 bg-gradient-to-r animate-shimmer"
              style={{
                backgroundImage: `linear-gradient(90deg, transparent, ${theme.colors.accent}, transparent)`,
                backgroundSize: '200% 100%'
              }}
            />
            
            {/* Theme preview dots */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
              <div 
                className="w-2 h-2 rounded-full animate-bounce-subtle"
                style={{ backgroundColor: theme.colors.accent, animationDelay: '0ms' }}
              />
              <div 
                className="w-2 h-2 rounded-full animate-bounce-subtle"
                style={{ backgroundColor: theme.colors.dark, animationDelay: '150ms' }}
              />
              <div 
                className="w-2 h-2 rounded-full animate-bounce-subtle"
                style={{ backgroundColor: theme.colors.light, animationDelay: '300ms' }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
