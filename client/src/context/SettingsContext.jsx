import { createContext, useContext, useState, useEffect } from 'react';
import { publicAPI } from '../services/api';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await publicAPI.getSettings();
      if (res.data?.success) {
        const data = res.data.data;
        setSettings(data);
        applySettings(data);
      }
    } catch (err) {
      console.error('Failed to load site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const applySettings = (data) => {
    if (!data) return;

    // Apply colors and typography to :root stylesheet properties
    const root = document.documentElement;
    if (data.theme) {
      const { primaryColor, accentColor, fontFamily } = data.theme;
      if (primaryColor) {
        root.style.setProperty('--primary', primaryColor);
        root.style.setProperty('--color-primary', primaryColor);
        root.style.setProperty('--primary-dark', primaryColor);
        root.style.setProperty('--primary-light', primaryColor);
      }
      if (accentColor) {
        root.style.setProperty('--accent', accentColor);
        root.style.setProperty('--color-accent', accentColor);
      }
      if (fontFamily) {
        root.style.setProperty('--font-primary', `${fontFamily}, 'SVN-Avo', 'UTM Avo', sans-serif`);
        root.style.setProperty('--font-heading', `${fontFamily}, 'SVN-Avo', sans-serif`);
        root.style.setProperty('--font-display', `${fontFamily}, 'SVN-Avo', sans-serif`);
      }
    }

    // Apply favicon dynamically to all icon links in head
    if (data.favicon) {
      const iconLinks = document.querySelectorAll("link[rel*='icon']");
      if (iconLinks.length > 0) {
        iconLinks.forEach((link) => {
          link.href = data.favicon;
        });
      } else {
        const newIcon = document.createElement('link');
        newIcon.rel = 'shortcut icon';
        newIcon.href = data.favicon;
        document.head.appendChild(newIcon);
      }
      // Apple-touch-icon update
      const appleIcon = document.querySelector("link[rel='apple-touch-icon']");
      if (appleIcon) {
        appleIcon.href = data.favicon;
      }
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    return { settings: null, loading: false, refreshSettings: () => {} };
  }
  return context;
}
