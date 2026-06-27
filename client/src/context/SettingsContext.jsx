import { useCallback, useState, useEffect, useLayoutEffect } from 'react';
import { publicAPI } from '../services/api';
import { SettingsContext } from './settingsContextCore';

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('hoavu_site_settings');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!settings);

  const ensureHexHash = useCallback((val, fallback = '#000000') => {
    if (!val) return fallback;
    const clean = val.trim();
    if (clean.startsWith('#')) return clean;
    if (/^[0-9A-F]{3}$|^[0-9A-F]{6}$/i.test(clean)) {
      return `#${clean}`;
    }
    return clean;
  }, []);

  const applySettings = useCallback((data) => {
    if (!data) return;

    // Apply colors and typography to :root stylesheet properties
    const root = document.documentElement;
    if (data.theme) {
      const { primaryColor, accentColor, fontFamily } = data.theme;
      if (primaryColor) {
        const formattedPrimary = ensureHexHash(primaryColor, '#D2232A');
        root.style.setProperty('--primary', formattedPrimary);
        root.style.setProperty('--color-primary', formattedPrimary);
        root.style.setProperty('--primary-dark', formattedPrimary);
        root.style.setProperty('--primary-light', formattedPrimary);
      }
      if (accentColor) {
        const formattedAccent = ensureHexHash(accentColor, '#FF6B35');
        root.style.setProperty('--accent', formattedAccent);
        root.style.setProperty('--color-accent', formattedAccent);
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
  }, [ensureHexHash]);

  useLayoutEffect(() => {
    if (settings) {
      applySettings(settings);
    }
  }, [settings, applySettings]);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await publicAPI.getSettings();
      if (res.data?.success) {
        const data = res.data.data;
        setSettings(data);
        try {
          localStorage.setItem('hoavu_site_settings', JSON.stringify(data));
        } catch (err) {
          console.warn('Failed to save settings to localStorage:', err);
        }
      }
    } catch (err) {
      console.error('Failed to load site settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
