import { useMemo } from 'react'
import { Tooltip } from 'react-tooltip'
import { MmsLanguage } from '../hooks/useLanguage'

interface Props {
  filesToUpload: File[]
  isUploading: boolean
  matches: [string | undefined, string | undefined][]
  selectedLanguage: MmsLanguage | null | undefined
  startJob: () => void
  sessionId: string
}

export default function TimestampButton({
  filesToUpload,
  isUploading,
  matches,
  selectedLanguage,
  sessionId,
  startJob,
}: Props) {
  const errorMessage = useMemo(() => {
    if (filesToUpload.length !== 0 || isUploading) {
      return 'Please wait for uploads to finish.'
    } else if (matches.length === 0) {
      return 'Please upload files to timestamp.'
    } else if (
      !matches.every(([audioFile, textFile]) => audioFile && textFile)
    ) {
      return 'Please upload both an audio and text file for each match.'
    } else if (!selectedLanguage) {
      return 'Please select a language.'
    } else return
  }, [filesToUpload, isUploading, matches, selectedLanguage])

  async function handleSubmit() {
    startJob()
    const baseUrl = 'http://34.81.60.7:8000'
    const url = `${baseUrl}/?lang=${selectedLanguage?.iso}&session-id=${sessionId}`
    console.log('Fetching from', url)
    fetch(url)
  }

  return (
    <>
      <button
        data-tooltip-id="button"
        data-tooltip-content={errorMessage}
        disabled={errorMessage !== undefined}
        className={`btn-primary ${errorMessage !== undefined ? 'btn-disabled' : ''} w-full my-4`}
        onClick={handleSubmit}
      >
        {`Timestamp!`}
      </button>
      {errorMessage ? <Tooltip id="button" /> : null}
    </>
  )
}
