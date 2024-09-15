'use client'
import { listAll, ref } from 'firebase/storage'
import { useRouter, useSearchParams } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Sentry, Windmill } from 'react-activity'
import 'react-activity/dist/library.css'
import FlipNumbers from 'react-flip-numbers'
import { LuPartyPopper } from 'react-icons/lu'
import {
  TbClock,
  TbCopy,
  TbExclamationCircle,
  TbFile,
  TbZzz,
} from 'react-icons/tb'
import 'react-tooltip/dist/react-tooltip.css'
import { v4 as uuidv4 } from 'uuid'
import DownloadButton from '../components/DownloadButon'
import FilesArea from '../components/FilesArea'
import TimestampButton from '../components/TimestampButton'
import { fbStorage } from '../firebase'
import useJob from '../hooks/useJob'
import useLanguage from '../hooks/useLanguage'
import useMatches from '../hooks/useMatches'
import useRemainingTime from '../hooks/useRemainingTime'
import { colors } from '../styles/colors'
import LanguageSelector from './LanguageSelector'
import SeparatorSelect from './SeparatorSelect'

export const audioExtensions = ['.wav', '.mp3']
export const textExtensions = ['.txt', '.usfm']

export default function Home() {
  const router = useRouter()
  const params = useSearchParams()
  const [sessionId, setSessionId] = useState<string>('')
  const [uploadStartTime, setUploadStartTime] = useState<number>()
  const [uploadSize, setUploadSize] = useState<number>()

  useEffect(() => {
    if (!params) return
    const existingSessionId = params.get('sessionId')

    if (existingSessionId && sessionId === '') {
      router.push(`/timestamp?sessionId=${existingSessionId}`)
      setSessionId(existingSessionId)
    } else if (sessionId === '') {
      const newSessionId = uuidv4()
      router.push(`/timestamp?sessionId=${newSessionId}`)
      setSessionId(newSessionId)
    }
  }, [params, router, sessionId])

  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<any>(null)
  const [filesToUpload, setFilesToUpload] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string }[]>()
  const [isUploading, setIsUploading] = useState(false)
  const [isFetchingExistingFiles, setIsFetchingExistingFiles] = useState(false)
  const [sessionTextExt, setSessionTextExt] = useState<string>()
  const [sessionAudioExt, setSessionAudioExt] = useState<string>()
  const [hasSetExistingLanguage, setHasSetExistingLanguage] = useState(false)

  const { matches, firstAudio, isFirstAudioUploaded } = useMatches({
    filesToUpload,
    uploadedFiles,
  })

  const {
    languages,
    selectedLanguage,
    setSelectedLanguage,
    setQuery,
    query,
    lidStatus,
    setLidStatus,
  } = useLanguage({
    firstAudio,
    isFirstAudioUploaded,
    sessionId,
    hasSetExistingLanguage,
  })

  const {
    jobStatus,
    downloadTimestamps,
    startJob,
    downloadType,
    setDownloadType,
    current,
    error,
    progress,
    total,
    separator,
    setSeparator,
    updateSeparator,
    totalLength,
    language,
  } = useJob({
    sessionId,
    setLidStatus,
    query,
    selectedLanguage,
    setQuery,
    hasSetExistingLanguage,
    setHasSetExistingLanguage,
  })

  useEffect(() => {
    async function getExistingFiles() {
      if (!sessionId || sessionId === '') return

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

  const icon = useMemo(() => {
    switch (jobStatus) {
      case 'in_progress':
      case 'starting':
      case undefined:
        return <Sentry color={colors.p1} size={48} animating />
      case 'done':
        return ''
        return <LuPartyPopper className="size-12 text-p1" />
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
        if (progress === undefined || total === undefined)
          return 'Timestamping in progress...'
        else
          return `Using AI to timestamp file ${Math.min(progress + 1, total)} of ${total}...`
      case 'failed':
        return 'Timestamping failed.'
      default:
        return null
    }
  }, [jobStatus, progress, total])

  // Usage in Home component
  const { remainingTime, sizeOfUploaded } = useRemainingTime(
    uploadStartTime,
    filesToUpload,
    uploadedFiles
  )

  const [hrs, setHrs] = useState('99')
  const [mins, setMins] = useState('99')
  useEffect(() => {
    if (totalLength) {
      setHrs(new Date(totalLength * 1.5 * 1000).toISOString().substring(11, 13))
      setMins(
        new Date(totalLength * 1.5 * 1000).toISOString().substring(14, 16)
      )
    }
  }, [totalLength])

  return jobStatus !== 'not_started' ? (
    <>
      <div className="content w-full flex flex-col items-center justify-center flex-1 max-w-3xl px-4">
        <div className="flex flex-col items-center justify-center gap-4 mb-2 w-full">
          {icon}
          {/* {endTime !== undefined && startTime !== undefined ? (
            <p className="text-sm text-f2">
              Timestamping finished in{' '}
              {new Date((endTime - startTime) * 1000)
                .toISOString()
                .substring(11, 19)}
              .
            </p>
          ) : null} */}
          {totalLength !== undefined ? (
            <div className="flex flex-row gap-4 items-center justify-center mb-8 mt-8">
              {/* <LuPartyPopper className="size-12 text-p1" /> */}
              <div className="flex flex-col gap-2 items-center justify-center">
                <div className="flex flex-row items-center">
                  <FlipNumbers
                    height={50}
                    width={60}
                    numberClassName="font-bold rounded-lg mr-1"
                    color={colors.f1}
                    background={colors.b2}
                    duration={2}
                    play
                    perspective={100}
                    numbers={hrs}
                  />
                  <p className="mr-3 text-f2">hrs</p>
                  <FlipNumbers
                    height={50}
                    width={60}
                    numberClassName="text-2xl font-bold rounded-lg mr-1"
                    color={colors.f1}
                    background={colors.b2}
                    duration={2}
                    play
                    perspective={100}
                    numbers={mins}
                  />
                  <p className="text-f2">mins</p>
                </div>
                {/* <h2 className="text-2xl font-bold">
                {secondsToDhms(totalLength * 1.5)}
              </h2> */}
                <p className="text-f2 text-xs">
                  Time saved over timestamping manually
                </p>
              </div>
            </div>
          ) : null}
          {statusText ? (
            <p className="text-f1 font-bold text-xl text-center">
              {statusText}
            </p>
          ) : null}
          {jobStatus === 'in_progress' && current ? (
            <div className="pill font-mono">{current}</div>
          ) : null}
        </div>
        {(jobStatus === 'in_progress' || jobStatus === 'done') && language ? (
          <p className="text-sm text-f2">Language identified as {language}.</p>
        ) : null}
        {jobStatus === 'in_progress' ? (
          <div className="flex flex-col w-full items-start gap-2 text-center bg-p1/5 rounded-xl p-4 mt-8">
            <div className="flex flex-row items-center gap-2">
              <TbZzz className="text-p1 size-6" />
              <h2 className="font-bold">Taking too long?</h2>
            </div>
            <p className="text-xs text-f2 mb-1">
              You can safely close this page and return to this url to download
              the results when they are finished.
            </p>
            <button
              onClick={() => {
                // Copy to clipboard
                navigator.clipboard.writeText(
                  `http://timestampaudio.com/?sessionId=${sessionId}`
                )
                enqueueSnackbar('Copied!')
              }}
              className="btn text-xs font-bold text-p1 px-2 py-1 border border-p1/10 rounded-lg"
            >
              <TbCopy className="size-4 text-p1" />
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
          {/* <button className="btn w-full mt-4 mb-2" onClick={resetStatus}>
            <TbArrowLeft className="size-4" />
            Back to session
          </button> */}
          {/* <button
            className="btn w-full"
            onClick={() => {
              router.replace('/')
              location.reload()
            }}
          >
            <TbRefresh className="size-4" />
            Start over
          </button> */}
        </>
      ) : null}
    </>
  ) : (
    <div className="flex flex-col w-full max-w-3xl px-4 items-center justify-center flex-1 pt-4">
      {/* <h2 className="text-sm mb-2">
        <span className="font-bold">Step 2:</span> Upload Files
      </h2> */}
      {/* <div className="w-full flex flex-col rounded-lg bg-p1/10 mb-4 p-2">
        <h2 className="text-p1 font-bold text-sm mb-2 text-center">
          Save 100+ Hours with Automated Timestamp Data for Your Audio Files
        </h2>
        <p className="text-xs text-center">
          Generate precise timestamps in over{' '}
          <span className="font-bold">1,100 languages</span>—turning months of
          manual work into minutes and simplifying your audio workflow for Bible
          studies, podcasts, and media.
        </p>
      </div> */}
      {matches.length > 2 &&
      remainingTime !== undefined &&
      uploadSize !== undefined ? (
        <div
          className="flex flex-row items-center justify-center w-full bg-p1/10 rounded-xl p-4 mb-4
            text-xs"
        >
          <Windmill size={24} color={colors.p1} />
          <div className="flex flex-row items-center gap-4 flex-1 justify-center h-full">
            <div className="flex flex-row items-center gap-4">
              <TbFile className="size-6 text-p1" />
              <div className="flex flex-col gap-1">
                Upload progress
                <span className="font-mono mr-4 font-bold text-base">
                  {Math.round(sizeOfUploaded / 1024 / 1024)}mb /{' '}
                  {Math.round(uploadSize / 1024 / 1024)}mb
                </span>
              </div>
            </div>
            <div className="h-full w-px bg-p1/20 rounded-lg" />
            <div className="flex flex-row items-center gap-4">
              <TbClock className="size-6 text-p1" />
              <div className="flex flex-col gap-1">
                Est. time remaining:
                <div className="font-mono font-bold text-base">
                  {new Date(remainingTime).toISOString().substring(11, 19)}
                </div>
              </div>
            </div>
          </div>
          <div className="w-6" />
        </div>
      ) : null}
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
        setUploadStartTime={setUploadStartTime}
        setUploadSize={setUploadSize}
        sessionAudioExt={sessionAudioExt}
        sessionTextExt={sessionTextExt}
        setSessionAudioExt={setSessionAudioExt}
        setSessionTextExt={setSessionTextExt}
      />
      <div className="flex flex-col w-full sticky bottom-0 bg-b1 border-t border-p1/10">
        {sessionTextExt === 'txt' ? (
          <SeparatorSelect
            separator={separator}
            setSeparator={setSeparator}
            updateSeparator={updateSeparator}
          />
        ) : null}
        {isFirstAudioUploaded ? (
          <LanguageSelector
            languages={languages}
            selectedLanguage={selectedLanguage}
            setQuery={setQuery}
            query={query}
            lidStatus={lidStatus}
            setLidStatus={setLidStatus}
            setSelectedLanguage={setSelectedLanguage}
          />
        ) : null}
        <TimestampButton
          filesToUpload={filesToUpload}
          isUploading={isUploading}
          matches={matches}
          sessionId={sessionId}
          startJob={startJob}
          separator={separator}
          selectedLanguage={selectedLanguage}
          lidStatus={lidStatus}
        />
      </div>
    </div>
  )
}
