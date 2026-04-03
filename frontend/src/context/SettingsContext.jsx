import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [anonymize, setAnonymize] = useState(() => {
    const saved = localStorage.getItem('medishield_anonymize');
    return saved === 'true';
  });

  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    localStorage.setItem('medishield_anonymize', anonymize);
  }, [anonymize]);

  const maskName = (name) => {
    if (!anonymize) return name;
    // Simple stable hash-like ID for the demo
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `Subject-${hash.toString(16).toUpperCase().slice(-4)}`;
  };

  return (
    <SettingsContext.Provider value={{ anonymize, setAnonymize, notifications, setNotifications, maskName }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
