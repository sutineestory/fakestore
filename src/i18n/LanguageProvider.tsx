import {
  createContext,
  use,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { messages, type Language } from './languages';
import type { Messages } from './locales/en';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  messages: Messages;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

type LanguageProviderProps = PropsWithChildren<{
  initialLanguage?: Language;
}>;

export function LanguageProvider({
  children,
  initialLanguage = 'en',
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, messages: messages[language] }),
    [language],
  );

  return <LanguageContext value={value}>{children}</LanguageContext>;
}

function useLanguageContext(): LanguageContextValue {
  const context = use(LanguageContext);
  if (!context) {
    throw new Error('Language hooks must be used inside <LanguageProvider>.');
  }
  return context;
}

export function useTranslation(): Messages {
  return useLanguageContext().messages;
}

export function useLanguage() {
  const { language, setLanguage } = useLanguageContext();
  return { language, setLanguage };
}
