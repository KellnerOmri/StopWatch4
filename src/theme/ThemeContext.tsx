import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, lightTheme, darkTheme } from './theme';

interface ThemeContextType {
    theme: Theme;
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: lightTheme,
    isDarkMode: false,
    toggleTheme: () => {},
});

const THEME_STORAGE_KEY = '@stopwatch4_dark_mode';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(THEME_STORAGE_KEY).then((value) => {
            if (value !== null) {
                setIsDarkMode(value === 'true');
            }
        });
    }, []);

    const toggleTheme = () => {
        const newValue = !isDarkMode;
        setIsDarkMode(newValue);
        AsyncStorage.setItem(THEME_STORAGE_KEY, String(newValue));
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
