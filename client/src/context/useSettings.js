import { useContext } from 'react';
import { SettingsContext } from './settingsContextCore';

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    return { settings: null, loading: false, refreshSettings: () => {} };
  }
  return context;
}