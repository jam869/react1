import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from '../utils/i18n';
import * as Localization from 'expo-localization';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    if (userData.langue && userData.langue !== 'auto') {
      i18n.changeLanguage(userData.langue);
    } else {
      const locales = Localization.getLocales();
      i18n.changeLanguage(locales && locales.length > 0 ? locales[0].languageCode : 'en');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (newData) => {
    setUser(prev => ({ ...prev, ...newData }));
    if (newData.langue) {
      if (newData.langue === 'auto') {
        const locales = Localization.getLocales();
        i18n.changeLanguage(locales && locales.length > 0 ? locales[0].languageCode : 'en');
      } else {
        i18n.changeLanguage(newData.langue);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
