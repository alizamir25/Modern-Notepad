
import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('notepad-theme', 'light');

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all possible theme classes
    root.classList.remove(
      'dark', 
      'theme-purple', 
      'theme-green', 
      'theme-orange', 
      'theme-pink',
      'theme-blue',
      'theme-teal',
      'theme-indigo',
      'theme-amber',
      'theme-rose',
      'theme-violet'
    );
    
    // Apply current theme
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme !== 'light') {
      root.classList.add(theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => current === 'light' ? 'dark' : 'light');
  };

  return { theme, setTheme, toggleTheme };
}
