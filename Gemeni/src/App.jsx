import React, { useEffect } from 'react';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import ChatRoom from './components/ChatRoom';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const token = useAuthStore((s) => s.token);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle); // <-- Add this

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 relative">
        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded shadow text-sm"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
        {!token ? (
          <AuthForm />
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1"><Dashboard /></div>
            <div className="md:col-span-2"><ChatRoom /></div>
          </div>
        )}
      </div>
    </>
  );
}