import { JobStatus } from '../hooks/useJob'

interface Props {
  sessionId: string
  jobStatus: JobStatus | undefined
  resetStatus: () => void
}

export default function Header({ jobStatus, resetStatus, sessionId }: Props) {
  return (
    <div className="flex flex-col w-full gap-4 mb-4">
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="flex flex-row flex-1 items-center gap-4 w-full">
          {/* {jobStatus === 'done' || jobStatus === 'failed' ? (
            <button className="btn" onClick={resetStatus}>
              <TbArrowLeft className="size-4 text-p1" />
            </button>
          ) : null} */}
          <h1 className="text-p1 text-2xl font-bold flex-1">timestamp.audio</h1>
        </div>
      </div>
      {/* {sessionId !== '' ? (
        <div className="flex-1 flex items-center gap-2">
          <p>
            Your session id is{' '}
            <span className="text-p1">{sessionId.slice(0, 8)}</span>
          </p>
          <button
            onClick={() => {
              // Copy to clipboard
              navigator.clipboard.writeText(sessionId)
              enqueueSnackbar('Copied!')
            }}
            className="btn text-xs font-bold text-p1 px-2 py-1 border border-p1/10 rounded-lg"
          >
            Copy id
          </button>
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
            Copy full url
          </button>
        </div>
      ) : null} */}
    </div>
  )
}
