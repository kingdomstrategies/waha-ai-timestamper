import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import mmsLanguages from '../data/mms_languages.json'

export interface MmsLanguage {
  align: boolean
  identify: boolean
  iso: string
  name: string
  tts: boolean
}

export type LidStatus = 'notStarted' | 'inProgress' | 'done'

const languages: MmsLanguage[] = mmsLanguages.filter(
  (language) => language.name && language.iso && language.align
)

interface Props {
  sessionId: string
  hasSetExistingLanguage: boolean
  firstAudio: string | undefined
  isFirstAudioUploaded: boolean
}

export default function useLanguage({
  sessionId,
  hasSetExistingLanguage,
  firstAudio,
  isFirstAudioUploaded,
}: Props) {
  const [selectedLanguage, setSelectedLanguage] = useState<null | MmsLanguage>()
  const [query, setQuery] = useState('')
  const [lidStatus, setLidStatus] = useState<LidStatus>('notStarted')

  useEffect(() => {
    console.log('hasSetExistingLanguage', hasSetExistingLanguage)
    if (
      !hasSetExistingLanguage ||
      selectedLanguage ||
      query !== '' ||
      lidStatus !== 'notStarted' ||
      !isFirstAudioUploaded
    )
      return

    const baseUrl = 'http://192.9.233.29:8000'
    // const baseUrl = 'http://localhost:8000'
    const url = `${baseUrl}/lid?file-name=${firstAudio}&session-id=${sessionId}`
    setLidStatus('inProgress')
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const languageMatch = mmsLanguages.find(
          (language) => language.iso === data.language
        )
        if (!languageMatch) {
          enqueueSnackbar(
            `Failed to identify language. Error: Language not found: ${data.language}`,
            {
              variant: 'error',
            }
          )
          setLidStatus('done')
          return
        } else if (!languageMatch.align) {
          enqueueSnackbar(
            `Identified language ${data.language} does not support alignment.`,
            {
              variant: 'error',
            }
          )
          setLidStatus('done')
          return
        }

        setQuery(languageMatch.name)
        setLidStatus('done')
      })
      .catch((e) => {
        enqueueSnackbar(`Failed to identify language. Error: ${e}`, {
          variant: 'error',
        })
        setLidStatus('done')
      })
  }, [
    firstAudio,
    hasSetExistingLanguage,
    isFirstAudioUploaded,
    lidStatus,
    query,
    selectedLanguage,
    sessionId,
  ])

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

  return {
    selectedLanguage,
    setSelectedLanguage,
    query,
    setQuery,
    languages,
    lidStatus,
    setLidStatus,
  }
}
