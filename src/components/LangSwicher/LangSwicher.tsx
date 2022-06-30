import React from 'react'
import { useTranslation } from 'react-i18next'
import Dropdown from '../Dropdown'

const LangSwicher: React.FC = () => {
  const langs = [
    { value: 'en', name: 'English' },
    { value: 'zh', name: '中文' }
  ]

  const { i18n } = useTranslation()

  const curLang = langs.find(({ value }) => i18n.language === value)
  
  return (
    <Dropdown
      list={langs}
      placeholder={curLang ? curLang.name : 'English'}
      onClick={(lang) => i18n.changeLanguage(lang.value as string)}
      border={false}
    />
  )
}

export default LangSwicher