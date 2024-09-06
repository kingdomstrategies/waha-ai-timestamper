import { deleteObject, ref } from 'firebase/storage'
import { Dispatch, SetStateAction, useState } from 'react'
import { Windmill } from 'react-activity'
import {
  TbArrowsLeftRight,
  TbCheck,
  TbExclamationCircle,
  TbTrash,
} from 'react-icons/tb'
import { fbStorage } from '../firebase'
import { colors } from '../styles/colors'

export type Match = [string | undefined, string | undefined]

interface Props {
  match: Match
  uploadedFiles: undefined | { name: string }[]
  setUploadedFiles: Dispatch<SetStateAction<undefined | { name: string }[]>>
  isUploading: boolean
  sessionId: string
}

export default function MatchItem({
  match: [audioFile, textFile],
  uploadedFiles,
  isUploading,
  sessionId,
  setUploadedFiles,
}: Props) {
  const [deleting, setDeleting] = useState<string>()
  const isAudioUploaded = uploadedFiles?.some(
    (uploaded) => uploaded.name === audioFile
  )

  const isTextUploaded = uploadedFiles?.some(
    (uploaded) => uploaded.name === textFile
  )

  async function deleteFile(name: string) {
    setDeleting(name)
    const storageRef = ref(fbStorage, `sessions/${sessionId}/${name}`)
    await deleteObject(storageRef)
    setUploadedFiles((prevValue) =>
      prevValue?.filter((file) => file.name !== name)
    )
    setDeleting(undefined)
  }

  const audioExt = audioFile?.split('.').pop()
  const textExt = textFile?.split('.').pop()
  const audioName = audioFile?.split('.').slice(0, -1).join('.')
  const textName = textFile?.split('.').slice(0, -1).join('.')

  return (
    <div
      key={audioFile}
      className="w-full flex flex-col sm:flex-row gap-1 sm:gap-4 items-center p-2 rounded-xl
        sm:p-0 bg-p1/10 sm:bg-p1/0"
    >
      <div
        className={`w-full flex-1 flex flex-row items-center card px-4 py-4 gap-2
          ${!audioFile ? 'bg-p1/10' : ''}`}
      >
        {audioFile ? (
          deleting === audioFile ? (
            <Windmill size={16} color={colors.p1} />
          ) : isAudioUploaded ? (
            <TbCheck
              data-tooltip-id="audio-uploaded"
              data-tooltip-content="Uploaded"
              className="text-p1/40"
            />
          ) : isUploading ? (
            <Windmill size={16} color={colors.p1} />
          ) : null
        ) : (
          <TbExclamationCircle className="text-p1" />
        )}
        {audioFile ? (
          <p className="flex-1 font-mono text-sm">
            {audioName}
            <span className="text-f2">.{audioExt}</span>
          </p>
        ) : (
          <p className="flex-1 text-sm">No audio file found</p>
        )}
        {isAudioUploaded && audioFile ? (
          <button onClick={() => deleteFile(audioFile)}>
            <TbTrash className="text-p1/40" />
          </button>
        ) : null}
      </div>
      <TbArrowsLeftRight className="text-f1 h-0 invisible sm:visible sm:h-auto" />
      <div
        className={`w-full flex-1 flex flex-row items-center card px-4 py-4 gap-2
          ${!textFile ? 'bg-p1/10' : ''}`}
      >
        {textFile ? (
          deleting === textFile ? (
            <Windmill size={16} color={colors.p1} animating />
          ) : isTextUploaded ? (
            <TbCheck className="text-p1/40" />
          ) : isUploading ? (
            <Windmill size={16} color={colors.p1} />
          ) : null
        ) : (
          <TbExclamationCircle
            data-tooltip-id="no-text-match"
            data-tooltip-content="Upload audio with matching name."
            className="text-p1"
          />
        )}
        {textFile ? (
          <p className="flex-1 font-mono text-sm">
            {textName}
            <span className="text-f2">.{textExt}</span>
          </p>
        ) : (
          <p className="flex-1 text-sm">No text file found</p>
        )}
        {isTextUploaded && textFile ? (
          <button onClick={() => deleteFile(textFile)}>
            <TbTrash className="text-p1/40" />
          </button>
        ) : null}
      </div>
      {/* <Tooltip id="no-audio-match" />
      <Tooltip id="no-text-match" />
      <Tooltip id="text-uploading" />
      <Tooltip id="text-uploaded" />
      <Tooltip id="text-delete" />
      <Tooltip id="text-deleting" />
      <Tooltip id="audio-uploading" />
      <Tooltip id="audio-uploaded" />
      <Tooltip id="audio-delete" />
      <Tooltip id="audio-deleting" /> */}
    </div>
  )
}
