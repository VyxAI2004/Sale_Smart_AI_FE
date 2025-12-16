import { useState, useEffect } from 'react'
import i18n, { changeLanguage } from '@/lib/i18n'

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'vi'>(
    (localStorage.getItem('language') as 'en' | 'vi') || 'vi'
  )

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng as 'en' | 'vi')
    }

    i18n.on('languageChanged', handleLanguageChange)

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [])

  const t = (key: string) => {
    return i18n.t(key) || key
  }

  const switchLanguage = (lng: 'en' | 'vi') => {
    changeLanguage(lng)
    setCurrentLanguage(lng)
  }

  return {
    t,
    currentLanguage,
    switchLanguage,
  }
}
