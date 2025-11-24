import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Define the theme type based on your available themes
export type Theme = "Slate" | "Red" | "Rose" | "Orange" | "Green" | "Blue" | "Yellow" | "Violet";

interface ThemeContextType {
  theme: Theme;
  darkMode: boolean;
  toggleDarkMode: () => void;
  changeTheme: (newTheme: Theme) => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || 'Blue'; // default theme
  });
  
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // Apply theme classes to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', (theme + "-" + (darkMode ? 'dark' : 'light')).toLowerCase());
    document.documentElement.classList.toggle('dark', darkMode);
    
    localStorage.setItem('theme', theme);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [theme, darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    darkMode,
    toggleDarkMode,
    changeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};