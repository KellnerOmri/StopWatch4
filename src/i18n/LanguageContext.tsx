import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dictionary, en, he } from './dictionaries';

type Language = 'en' | 'he';

interface LanguageContextType {
    language: Language;
    t: Dictionary;
    toggleLanguage: () => void;
    isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    t: en,
    toggleLanguage: () => {},
    isRTL: false,
});

const LANGUAGE_STORAGE_KEY = '@stopwatch4_language';

const dictionaries: Record<Language, Dictionary> = { en, he };

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        AsyncStorage.getItem(LANGUAGE_STORAGE_KEY).then((value) => {
            if (value === 'en' || value === 'he') {
                setLanguage(value);
            }
        });
    }, []);

    const toggleLanguage = () => {
        const newLang: Language = language === 'en' ? 'he' : 'en';
        setLanguage(newLang);
        AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    };

    const t = dictionaries[language];
    const isRTL = language === 'he';

    return (
        <LanguageContext.Provider value={{ language, t, toggleLanguage, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
