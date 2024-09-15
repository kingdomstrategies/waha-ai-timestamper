import { useMemo } from 'react'
import { TbSparkles } from 'react-icons/tb'
import { Tooltip } from 'react-tooltip'
import { baseUrl } from '../../constants'
import { LidStatus, MmsLanguage } from '../hooks/useLanguage'
import Footer from './Footer'

interface Props {
  filesToUpload: File[]
  isUploading: boolean
  matches: [string | undefined, string | undefined][]
  startJob: () => void
  sessionId: string
  separator: string
  selectedLanguage: MmsLanguage | null | undefined
  lidStatus: LidStatus
}

export default function TimestampButton({
  filesToUpload,
  isUploading,
  matches,
  sessionId,
  startJob,
  separator,
  selectedLanguage,
  lidStatus,
}: Props) {
  const errorMessage = useMemo(() => {
    if (filesToUpload.length !== 0 || isUploading)
      return 'Please wait for uploads to finish'
    else if (matches.length === 0) return 'Please upload files to timestamp'
    else if (!matches.every(([audioFile, textFile]) => audioFile && textFile))
      return 'Every audio file must have a matching text file (and vice versa)'
    else if (lidStatus === 'inProgress')
      return 'Please wait for language identification to finish'
    else if (!selectedLanguage) return 'Please select a language.'
    else if (separator === '') return 'Please enter a custom separator'
    else return
  }, [
    filesToUpload.length,
    isUploading,
    lidStatus,
    matches,
    selectedLanguage,
    separator,
  ])

  async function handleSubmit() {
    startJob()

    const url = `${baseUrl}/?lang=${selectedLanguage?.iso}&session-id=${sessionId}&separator=${separator}`
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
        <TbSparkles className="size-6" />
        {`Timestamp!`}
      </button>
      {errorMessage ? <Tooltip id="button" /> : null}
      <Footer />
    </>
  )
}
