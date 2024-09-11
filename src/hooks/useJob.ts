import FileSaver from 'file-saver'
import { signInAnonymously } from 'firebase/auth'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import JSZip from 'jszip'
import { useEffect, useState } from 'react'
import { stringify } from 'yaml'
import { Separator } from '../components/SeparatorSelect'
import mmsLanguages from '../data/mms_languages.json'
import { fbAuth, fbDb } from '../firebase'

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
  error?: string
  total?: number
  progress?: number
  current?: string
  language?: string
  start?: number
  end?: number
  timestamps?: FileTimestamps[]
  separator?: string
  total_length?: number
}

interface Props {
  sessionId: string
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

export default function useJob({ sessionId }: Props) {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [jobStatus, setJobStatus] = useState<JobStatus | undefined>()
  const [timestampData, setTimestampData] = useState<FileTimestamps[]>()
  const [existingLanguage, setExistingLanguage] = useState<string>()
  const [hasSetExistingLanguage, setHasSetExistingLanguage] = useState(false)
  const [downloadType, setDownloadType] = useState<DownloadType>('json')
  const [total, setTotal] = useState<number | undefined>()
  const [progress, setProgress] = useState<number | undefined>()
  const [current, setCurrent] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()
  const [startTime, setStartTime] = useState<number | undefined>()
  const [endTime, setEndTime] = useState<number | undefined>()
  const [separator, setSeparator] = useState<Separator | string>('lineBreak')
  const [totalLength, setTotalLength] = useState<number | undefined>()
  const [language, setLanguage] = useState<string>()

  useEffect(() => {
    signInAnonymously(fbAuth).then(() => setIsSignedIn(true))
  }, [])

  useEffect(() => {
    if (!isSignedIn || sessionId === '') return

    const unsub = onSnapshot(doc(fbDb, 'sessions', sessionId), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as SessionDoc
        setJobStatus(data.status)
        if (data.timestamps !== undefined) setTimestampData(data.timestamps)
        if (data.language !== undefined) setExistingLanguage(data.language)
        if (data.total !== undefined) setTotal(data.total)
        if (data.progress !== undefined) setProgress(data.progress)
        if (data.current !== undefined) setCurrent(data.current)
        if (data.error !== undefined) setError(data.error)
        if (data.start !== undefined) setStartTime(data.start)
        if (data.end !== undefined) setEndTime(data.end)
        if (data.separator !== undefined) setSeparator(data.separator)
        if (data.total_length !== undefined) setTotalLength(data.total_length)
        if (data.language !== undefined)
          setLanguage(mmsLanguages.find((l) => l.iso === data.language)?.name)
      } else resetStatus()
    })

    return () => unsub()
  }, [isSignedIn, sessionId])

  const updateSeparator = async (separator: string) => {
    await setDoc(
      doc(fbDb, 'sessions', sessionId),
      { separator },
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
    total,
    progress,
    current,
    error,
    startTime,
    endTime,
    separator,
    setSeparator,
    updateSeparator,
    totalLength,
    language,
  }
}
