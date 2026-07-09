import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

type ThemeContextValue = {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const STORAGE_KEY = 'theme-preference';

function getStoredTheme(): Theme {
    if (typeof window === 'undefined') {
        return 'system';
    }

    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
        return storedTheme;
    }

    return 'system';
}

function getSystemTheme(): ResolvedTheme {
    if (typeof window === 'undefined') {
        return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(getStoredTheme);
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(getSystemTheme);

    useEffect(() => {
        const root = document.documentElement;
        const applyTheme = (nextTheme: ResolvedTheme) => {
            root.classList.toggle('dark', nextTheme === 'dark');
            root.style.colorScheme = nextTheme;
            setResolvedTheme(nextTheme);
        };

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const applySystemTheme = () => applyTheme(mediaQuery.matches ? 'dark' : 'light');

            applySystemTheme();
            mediaQuery.addEventListener('change', applySystemTheme);

            return () => mediaQuery.removeEventListener('change', applySystemTheme);
        }

        applyTheme(theme === 'dark' ? 'dark' : 'light');
    }, [theme]);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const value = useMemo<ThemeContextValue>(
        () => ({
            theme,
            resolvedTheme,
            setTheme: setThemeState,
            toggleTheme: () => {
                setThemeState(currentTheme => {
                    if (currentTheme === 'system') {
                        return resolvedTheme === 'dark' ? 'light' : 'dark';
                    }

                    return currentTheme === 'dark' ? 'light' : 'dark';
                });
            },
        }),
        [resolvedTheme, theme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}
