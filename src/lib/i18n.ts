import i18n from 'i18next'
import enTranslations from '../locales/en.json'
import viTranslations from '../locales/vi.json'

const resources = {
  en: {
    translation: enTranslations,
  },
  vi: {
    translation: viTranslations,
  },
}

i18n.init({
  resources,
  lng: localStorage.getItem('language') || 'vi', // Default to Vietnamese
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export const changeLanguage = (lng: 'en' | 'vi') => {
  i18n.changeLanguage(lng)
  localStorage.setItem('language', lng)
}

export default i18n
