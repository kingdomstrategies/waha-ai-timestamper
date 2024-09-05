'use client'
import { listAll, ref } from 'firebase/storage'
import { useRouter, useSearchParams } from 'next/navigation'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Windmill } from 'react-activity'
import 'react-activity/dist/library.css'
import {
  TbArrowLeft,
  TbCheck,
  TbExclamationCircle,
  TbRefresh,
} from 'react-icons/tb'
import 'react-tooltip/dist/react-tooltip.css'
import { v4 as uuidv4 } from 'uuid'
import DownloadButton from '../components/DownloadButon'
import FilesArea from '../components/FilesArea'
import Header from '../components/Header'
import LanguageSelector from '../components/LanguageSelector'
import TimestampButton from '../components/TimestampButton'
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
  const [isFetchingExistingFiles, setIsFetchingExistingFiles] = useState(false)

  const { languages, selectedLanguage, setQuery, query } = useLanguage()

  const {
    jobStatus,
    downloadTimestamps,
    resetStatus,
    startJob,
    downloadType,
    setDownloadType,
    current,
    error,
    progress,
    total,
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
      if (matches.length === 0) {
        console.log('1')
        setIsFetchingExistingFiles(true)
      }
      console.log('2')
      const sessionRef = ref(fbStorage, `sessions/${sessionId}`)
      const { items } = await listAll(sessionRef)
      console.log('3', items.length)
      setUploadedFiles(
        items
          .map((item) => ({ name: item.name }))
          // Remove files that need to be uploaded. This happens if a file has been
          // uploaded but is being replaced.
          .filter(
            (file) => !filesToUpload.some((upload) => upload.name === file.name)
          )
      )
      console.log('4')
      setIsFetchingExistingFiles(false)
    }
    getExistingFiles().catch(console.error)
  }, [sessionId, filesToUpload, setIsFetchingExistingFiles, jobStatus])

  // useEffect(() => {
  //   if (filesToUpload.length > 0 && !isUploading) handleUpload()
  // }, [filesToUpload, isUploading])

  const icon = useMemo(() => {
    switch (jobStatus) {
      case 'in_progress':
      case 'starting':
      case undefined:
        return <Windmill color={colors.p1} size={48} animating />
      case 'done':
        return <TbCheck className="size-12 text-p1" />
      case 'failed':
        return <TbExclamationCircle className="size-12 text-p1" />
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

  return jobStatus !== 'not_started' ? (
    <div className="flex flex-col w-full flex-1 items-center justify-center py-4">
      <Header
        jobStatus={jobStatus}
        resetStatus={resetStatus}
        sessionId={sessionId}
      />
      <div
        className="w-full flex flex-col items-center justify-center border rounded-xl border-p1/10
          p-4 flex-1"
      >
        <div className="flex flex-col items-center justify-center gap-4 mb-12">
          {icon}
          <p className="text-f1 font-bold text-xl">{statusText}</p>
        </div>
        {jobStatus === 'in_progress' ? (
          <div className="flex flex-col w-full items-center gap-2 text-center">
            {current ? (
              <div className="flex flex-row items-center gap-2 mb-2">
                <p>Currently processing:</p>
                <div className="pill font-mono">{current}</div>
              </div>
            ) : null}
            {progress !== undefined && total !== undefined ? (
              <p className="text-xs mb-2">
                {progress} of {total} files processed
              </p>
            ) : null}
            <p>
              You can safely close this page. Return to this url to download the
              results when they are finished.
            </p>
            <button
              onClick={() => {
                // Copy to clipboard
                navigator.clipboard.writeText(
                  `http://localhost:3000/?sessionId=${sessionId}`
                )
                enqueueSnackbar('Copied!')
              }}
              className="btn text-xs font-bold text-p1 px-2 py-1 border border-p1/10 rounded-lg"
            >
              Copy url to clipboard
            </button>
          </div>
        ) : null}
        {jobStatus === 'done' ? (
          <DownloadButton
            download={downloadTimestamps}
            downloadType={downloadType}
            setDownloadType={setDownloadType}
          />
        ) : null}
        {jobStatus === 'failed' && error ? (
          <div className="rounded-lg p-4 bg-p1/10 gap-2 flex flex-col w-full">
            <h3 className="text-f1 font-bold text-lg">Error</h3>
            <p className="font- text-xs">{error}</p>
          </div>
        ) : null}
      </div>
      {jobStatus === 'done' || jobStatus === 'failed' ? (
        <>
          <button className="btn w-full my-4" onClick={resetStatus}>
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
      {/* <div className="flex flex-col gap-1 w-full">
        <h2 className="text-f1 text-lg font-bold">Files</h2>
        <p className="text-xs text-f2 mb-4">
          Upload audio files and their text transcript files. Matches should
          have the same name.
        </p>
      </div> */}
      <FilesArea
        isUploading={isUploading}
        uploadedFiles={uploadedFiles}
        dragActive={dragActive}
        inputRef={inputRef}
        matches={matches}
        setDragActive={setDragActive}
        setFilesToUpload={setFilesToUpload}
        setUploadedFiles={setUploadedFiles}
        sessionId={sessionId}
        setIsUploading={setIsUploading}
        isFetchingExistingFiles={isFetchingExistingFiles}
      />
      <TimestampButton
        filesToUpload={filesToUpload}
        isUploading={isUploading}
        matches={matches}
        selectedLanguage={selectedLanguage}
        sessionId={sessionId}
        startJob={startJob}
        resetStatus={resetStatus}
      />
      <SnackbarProvider autoHideDuration={3000} />
    </div>
  )
}
