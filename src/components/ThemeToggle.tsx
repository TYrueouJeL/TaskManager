import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    return (
        <button onClick={toggle} className="header-button">
            {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        </button>
    );
}