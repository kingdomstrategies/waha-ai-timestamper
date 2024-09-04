import FileSaver from 'file-saver'
import { signInAnonymously } from 'firebase/auth'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import JSZip from 'jszip'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { stringify } from 'yaml'
import { fbAuth, fbDb } from '../firebase'
import { MmsLanguage } from './useLanguage'

export type JobStatus =
  | 'in_progress'
  | 'done'
  | 'failed'
  | 'not_started'
  | 'starting'

interface Section {
  begin: number
  begin_str: string
  end: number
  end_str: string
  text: string
  uroman_tokens: string
}

interface FileTimestamps {
  audio_file: string
  text_file: string
  sections: Section[]
}

interface SessionDoc {
  status: JobStatus
  language?: string
  timestamps?: FileTimestamps[]
}

interface Props {
  sessionId: string
  selectedLanguage: MmsLanguage | null | undefined
  query: string
  setQuery: Dispatch<SetStateAction<string>>
}

export type DownloadType = 'json' | 'srt' | 'yaml'

export const downloadTypes: { type: DownloadType; description: string }[] = [
  {
    type: 'json',
    description: 'Standard and developer friendly-format for web apps.',
  },
  {
    type: 'srt',
    description: 'Standard format for video subtitles.',
  },
  {
    type: 'yaml',
    description: 'Another developer-friendly alternative to json.',
  },
]

export default function useJob({
  query,
  selectedLanguage,
  sessionId,
  setQuery,
}: Props) {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [jobStatus, setJobStatus] = useState<JobStatus | undefined>()
  const [timestampData, setTimestampData] = useState<FileTimestamps[]>()
  const [existingLanguage, setExistingLanguage] = useState<string>()
  const [hasSetExistingLanguage, setHasSetExistingLanguage] = useState(false)
  const [downloadType, setDownloadType] = useState<DownloadType>('json')

  useEffect(() => {
    signInAnonymously(fbAuth).then(() => setIsSignedIn(true))
  }, [])

  useEffect(() => {
    if (!isSignedIn) return

    const unsub = onSnapshot(doc(fbDb, 'sessions', sessionId), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as SessionDoc
        setJobStatus(data.status)
        if (data.status === 'done') setTimestampData(data.timestamps)
        if (data.language) setExistingLanguage(data.language)
      } else resetStatus()
    })

    return () => unsub()
  }, [isSignedIn])

  useEffect(() => {
    if (query !== '') setHasSetExistingLanguage(true)
  }, [query])

  useEffect(() => {
    if (!hasSetExistingLanguage && existingLanguage) {
      setQuery(existingLanguage)
      setHasSetExistingLanguage(true)
    }
  }, [existingLanguage, hasSetExistingLanguage, setQuery])

  useEffect(() => {
    if (!isSignedIn || !selectedLanguage) return

    updateLanguage(selectedLanguage.iso)
  }, [isSignedIn, selectedLanguage])

  const updateLanguage = async (language: string) => {
    await setDoc(
      doc(fbDb, 'sessions', sessionId),
      { language },
      { merge: true }
    )
  }

  const downloadTimestamps = () => {
    if (!timestampData) return

    if (downloadType === 'srt') {
      const zip = new JSZip()
      timestampData.forEach((file) => {
        const sections = file.sections.map((section, index) => {
          if (section.text === '<star>') return ''

          const sectionNumber = index
          const srtStartTime = new Date(section.begin * 1000)
          const srtEndTime = new Date(section.end * 1000)
          const srtStartString = `${srtStartTime.getUTCHours()}:${srtStartTime.getUTCMinutes()}:${srtStartTime.getUTCSeconds()},${srtStartTime.getUTCMilliseconds()}`
          const srtEndString = `${srtEndTime.getUTCHours()}:${srtEndTime.getUTCMinutes()}:${srtEndTime.getUTCSeconds()},${srtEndTime.getUTCMilliseconds()}`

          return `${sectionNumber}\n${srtStartString} --> ${srtEndString}\n${section.text}\n\n`
        })
        zip.file(file.audio_file.replace('.mp3', '.srt'), sections.join(''))
        zip.generateAsync({ type: 'blob' }).then((content) => {
          FileSaver.saveAs(content, `timestamps-${sessionId}.zip`)
        })
      })

      return
    }

    let file
    if (downloadType === 'json') {
      const json = JSON.stringify(timestampData)
      file = new Blob([json], { type: 'application/json' })
    }
    // else if (format === 'txt') file = new Blob([json], { type: 'text/plain' })
    else if (downloadType === 'yaml') {
      const yaml = stringify(timestampData)
      file = new Blob([yaml], { type: 'text/plain' })
    }

    if (!file) return

    FileSaver.saveAs(file, `timestamps-${sessionId}.${downloadType}`)
  }

  const resetStatus = async () => {
    await setDoc(
      doc(fbDb, 'sessions', sessionId),
      { status: 'not_started' },
      { merge: true }
    )
  }

  const startJob = async () => {
    await setDoc(
      doc(fbDb, 'sessions', sessionId),
      { status: 'starting' },
      { merge: true }
    )
  }

  return {
    jobStatus,
    downloadTimestamps,
    resetStatus,
    startJob,
    downloadType,
    setDownloadType,
  }
}
