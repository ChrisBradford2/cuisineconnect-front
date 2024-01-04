import React, { useState, createContext, useContext } from 'react';

// Création du contexte
const LanguageContext = createContext({
  lang: 'fr',
  setLang: (lang: string) => {},
});

export const useLanguage = () => useContext(LanguageContext);

// Fournisseur de contexte
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState('fr');

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};
