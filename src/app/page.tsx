'use client'
import { listAll, ref, uploadBytes } from 'firebase/storage'
import { useRouter, useSearchParams } from 'next/navigation'
import { SnackbarProvider } from 'notistack'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Windmill } from 'react-activity'
import 'react-activity/dist/library.css'
import { BiCheckCircle, BiError } from 'react-icons/bi'
import { TbArrowLeft, TbRefresh } from 'react-icons/tb'
import 'react-tooltip/dist/react-tooltip.css'
import { v4 as uuidv4 } from 'uuid'
import DownloadButton from '../components/DownloadButon'
import Header from '../components/Header'
import LanguageSelector from '../components/LanguageSelector'
import MatchItem from '../components/MatchItem'
import TimestampButton from '../components/TimestampButton'
import UploadArea from '../components/UploadArea'
import { fbStorage } from '../firebase'
import useJob from '../hooks/useJob'
import useLanguage from '../hooks/useLanguage'
import { colors } from '../styles/colors'

const audioExtensions = ['.wav', '.mp3']
const textExtensions = ['.txt']

export default function Home() {
  const router = useRouter()
  const params = useSearchParams()
  const [sessionId, setSessionId] = useState<string>('')

  useEffect(() => {
    if (!params) return
    const existingSessionId = params.get('sessionId')

    if (existingSessionId && sessionId === '') {
      router.push(`/?sessionId=${existingSessionId}`)
      setSessionId(existingSessionId)
    } else if (sessionId === '') {
      const newSessionId = uuidv4()
      router.push(`/?sessionId=${newSessionId}`)
      setSessionId(newSessionId)
    }
  }, [params, router, sessionId])

  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<any>(null)
  const [filesToUpload, setFilesToUpload] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string }[]>()
  const [isUploading, setIsUploading] = useState(false)

  const { languages, selectedLanguage, setQuery, query } = useLanguage()

  const {
    jobStatus,
    downloadTimestamps,
    resetStatus,
    startJob,
    downloadType,
    setDownloadType,
  } = useJob({
    sessionId,
    selectedLanguage,
    query,
    setQuery,
  })

  /**
   * Match audio files with text files.
   */
  const matches = useMemo(() => {
    const allFiles = [...(uploadedFiles ?? []), ...filesToUpload].filter(
      (file, index, array) =>
        array.findIndex((f) => f.name === file.name) === index
    )

    const audioFiles: Map<string, string> = new Map()
    const textFiles: Map<string, string> = new Map()

    // Helper function to get the file name without the extension
    function getFileNameWithoutExtension(
      file: string,
      extensions: string[]
    ): string | null {
      for (const ext of extensions) {
        if (file.endsWith(ext)) {
          return file.slice(0, -ext.length)
        }
      }
      return null
    }

    // Separate audio and text files into different maps
    allFiles.forEach((file) => {
      const audioFileName = getFileNameWithoutExtension(
        file.name,
        audioExtensions
      )
      const textFileName = getFileNameWithoutExtension(
        file.name,
        textExtensions
      )

      if (audioFileName) {
        audioFiles.set(audioFileName, file.name)
      } else if (textFileName) {
        textFiles.set(textFileName, file.name)
      }
    })

    const matchedFiles: Array<[string | undefined, string | undefined]> = []

    // Match audio files with text files
    audioFiles.forEach((audioFile, baseName) => {
      if (textFiles.has(baseName)) {
        matchedFiles.push([audioFile, textFiles.get(baseName)])
        textFiles.delete(baseName)
      } else {
        matchedFiles.push([audioFile, undefined])
      }
    })

    // Add remaining text files that have no matching audio files
    textFiles.forEach((textFile, baseName) => {
      matchedFiles.push([undefined, textFile])
    })

    // Sort matches alphabetically.
    return matchedFiles.sort((a, b) => {
      if (a[0] && b[0]) {
        return a[0].localeCompare(b[0])
      } else if (a[0]) {
        return -1
      } else if (b[0]) {
        return 1
      } else if (a[1] && b[1]) {
        return a[1].localeCompare(b[1])
      } else if (a[1]) {
        return -1
      } else if (b[1]) {
        return 1
      } else {
        return 0
      }
    })
  }, [filesToUpload, uploadedFiles])

  useEffect(() => {
    async function getExistingFiles() {
      const sessionRef = ref(fbStorage, `sessions/${sessionId}`)
      const { items } = await listAll(sessionRef)
      setUploadedFiles(
        items
          .map((item) => ({ name: item.name }))
          // Remove files that need to be uploaded. This happens if a file has been
          // uploaded but is being replaced.
          .filter(
            (file) => !filesToUpload.some((upload) => upload.name === file.name)
          )
      )
    }
    getExistingFiles().catch(console.error)
  }, [sessionId, filesToUpload])

  async function handleUpload() {
    setIsUploading(true)
    for (const file of filesToUpload) {
      const storageRef = ref(fbStorage, `sessions/${sessionId}/${file.name}`)

      try {
        await uploadBytes(storageRef, file)

        // Although we update the uploaded files state in the useEffect, updating it
        // here quickly updates the UI immediately to show the file has been uploaded.
        setUploadedFiles((prevState) => [
          ...(prevState ?? []),
          { name: file.name },
        ])

        // Remove file from files to upload.
        setFilesToUpload((prevState) => prevState.filter((f) => f !== file))
        console.log('Uploaded a blob or file!')
      } catch (error) {
        console.error('Error uploading file: ', error)
      }
    }
    setIsUploading(false)
  }

  useEffect(() => {
    if (filesToUpload.length > 0) handleUpload()
  }, [filesToUpload])

  const icon = useMemo(() => {
    switch (jobStatus) {
      case 'in_progress':
      case 'starting':
      case undefined:
        return <Windmill color={colors.p1} size={48} animating />
      case 'done':
        return <BiCheckCircle className="size-12 text-p1" />
      case 'failed':
        return <BiError className="size-12 text-p1" />
      default:
        return null
    }
  }, [jobStatus])

  const statusText = useMemo(() => {
    switch (jobStatus) {
      case undefined:
        return 'Loading...'
      case 'starting':
        return 'Starting timestamping...'
      case 'in_progress':
        return 'Timestamping in progress...'
      case 'done':
        return 'Timestamping finished!'
      case 'failed':
        return 'Timestamping failed.'
      default:
        return null
    }
  }, [jobStatus])

  console.log(uploadedFiles)

  return jobStatus !== 'not_started' ? (
    <div className="flex flex-col w-full flex-1 items-center justify-center py-4">
      <Header
        jobStatus={jobStatus}
        resetStatus={resetStatus}
        sessionId={sessionId}
      />
      <div
        className="w-full flex flex-col items-center justify-center border rounded-lg border-f1/10
          p-4 flex-1"
      >
        <div className="flex flex-col items-center justify-center gap-4 mb-12">
          {icon}
          <p className="text-f1 font-bold text-xl">{statusText}</p>
        </div>
        {jobStatus === 'done' ? (
          <DownloadButton
            download={downloadTimestamps}
            downloadType={downloadType}
            setDownloadType={setDownloadType}
          />
        ) : null}
      </div>
      {jobStatus === 'done' || jobStatus === 'failed' ? (
        <>
          <button className="btn w-full" onClick={resetStatus}>
            <TbArrowLeft className="size-4" />
            Back to session
          </button>
          <button
            className="btn w-full"
            onClick={() => {
              router.push('/')
            }}
          >
            <TbRefresh className="size-4" />
            Start over
          </button>
        </>
      ) : null}
      <SnackbarProvider autoHideDuration={3000} />
    </div>
  ) : (
    <div className="flex flex-col w-full flex-1 pt-4 h-dvh">
      <Header
        jobStatus={jobStatus}
        resetStatus={resetStatus}
        sessionId={sessionId}
      />
      <LanguageSelector
        languages={languages}
        selectedLanguage={selectedLanguage}
        setQuery={setQuery}
        query={query}
      />
      <div className="flex flex-col gap-1 w-full">
        <h2 className="text-f1 text-lg font-bold">Files</h2>
        <p className="text-xs text-f2 mb-4">
          Text files that will be matched against their audio counterparts must
          have the same file name, except the extension.
        </p>
      </div>
      <div className="flex flex-col w-full gap-4 flex-1 flex-grow overflow-y-scroll overflow-x-auto">
        {matches.length !== 0 ? (
          <div className="flex flex-1 flex-col gap-2">
            {matches.map((match) => (
              <MatchItem
                key={match[0]}
                isUploading={isUploading}
                match={match}
                uploadedFiles={uploadedFiles}
                sessionId={sessionId}
                setUploadedFiles={setUploadedFiles}
              />
            ))}
          </div>
        ) : null}
        <UploadArea
          dragActive={dragActive}
          inputRef={inputRef}
          matches={matches}
          setDragActive={setDragActive}
          setFilesToUpload={setFilesToUpload}
          setUploadedFiles={setUploadedFiles}
        />
      </div>
      <TimestampButton
        filesToUpload={filesToUpload}
        isUploading={isUploading}
        matches={matches}
        selectedLanguage={selectedLanguage}
        sessionId={sessionId}
        startJob={startJob}
      />
      <SnackbarProvider autoHideDuration={3000} />
    </div>
  )
}
