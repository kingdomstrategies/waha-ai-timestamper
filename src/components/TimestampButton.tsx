import { useMemo } from 'react'
import { Tooltip } from 'react-tooltip'

interface Props {
  filesToUpload: File[]
  isUploading: boolean
  matches: [string | undefined, string | undefined][]
  startJob: () => void
  sessionId: string
  separator: string
}

export default function TimestampButton({
  filesToUpload,
  isUploading,
  matches,
  sessionId,
  startJob,
  separator,
}: Props) {
  const errorMessage = useMemo(() => {
    if (filesToUpload.length !== 0 || isUploading) {
      return 'Please wait for uploads to finish'
    } else if (matches.length === 0) {
      return 'Please upload files to timestamp'
    } else if (
      !matches.every(([audioFile, textFile]) => audioFile && textFile)
    ) {
      return 'Every audio file must have a matching text file (and vice versa)'
    } else if (separator === '') return 'Please enter a custom separator'
    else return
  }, [filesToUpload.length, isUploading, matches, separator])

  async function handleSubmit() {
    startJob()
    const baseUrl = 'http://192.9.233.29:8000'
    // const baseUrl = 'http://localhost:8000'

    const url = `${baseUrl}/?session-id=${sessionId}&separator=${separator}`
    console.log('Fetching from', url)
    fetch(url)
  }

  return (
    <>
      <button
        data-tooltip-id="button"
        data-tooltip-content={errorMessage}
        disabled={errorMessage !== undefined}
        className={`btn-primary ${errorMessage !== undefined ? 'btn-disabled' : ''} w-full mt-4`}
        onClick={handleSubmit}
      >
        {`Timestamp!`}
      </button>
      {errorMessage ? <Tooltip id="button" /> : null}
    </>
  )
}
