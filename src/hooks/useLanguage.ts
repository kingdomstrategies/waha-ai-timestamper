import { useEffect, useState } from 'react'
import mmsLanguages from '../data/mms_languages.json'

export interface MmsLanguage {
  align: boolean
  identify: boolean
  iso: string
  name: string
  tts: boolean
}

const languages: MmsLanguage[] = mmsLanguages.filter(
  (language) => language.name && language.iso && language.align
)

export default function useLanguage() {
  const [selectedLanguage, setSelectedLanguage] = useState<null | MmsLanguage>()
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (query !== '') {
      setSelectedLanguage(
        languages.find(
          (language) => language.iso === query || language.name === query
        ) ?? null
      )
    } else if (selectedLanguage !== undefined) {
      setSelectedLanguage(null)
    }
  }, [query])

  return { selectedLanguage, query, setQuery, languages }
}
