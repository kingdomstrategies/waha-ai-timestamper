import { deleteObject, ref } from 'firebase/storage'
import { Dispatch, SetStateAction, useState } from 'react'
import { Windmill } from 'react-activity'
import { BiSolidCheckCircle, BiTrash } from 'react-icons/bi'
import { BsArrowRight } from 'react-icons/bs'
import { TbCheck, TbExclamationCircle, TbTrash } from 'react-icons/tb'
import { Tooltip } from 'react-tooltip'
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

  return (
    <div
      key={audioFile}
      className="w-full flex flex-col sm:flex-row sm:gap-4 items-center border border-p1/10 p-4
        sm:pd-0 rounded-xl sm:border-0 sm:p-0"
    >
      <div
        className={`w-full flex-1 flex flex-row items-center card px-4 py-4
          ${!audioFile ? 'bg-p1/10' : ''}`}
      >
        <p className="flex-1">{audioFile ?? 'No audio file found'}</p>
        {audioFile ? (
          deleting === audioFile ? (
            <Windmill
              data-tooltip-id="audio-deleting"
              data-tooltip-content="Deleting..."
              size={16}
              color={colors.p1}
              animating
            />
          ) : isAudioUploaded ? (
            <div className="flex flex-row gap-2">
              <button
                data-tooltip-id="audio-delete"
                data-tooltip-content="Delete"
                onClick={() => deleteFile(audioFile)}
              >
                <TbTrash className="text-p1/40" />
              </button>
              <TbCheck
                data-tooltip-id="audio-uploaded"
                data-tooltip-content="Uploaded"
                className="text-p1/40"
              />
            </div>
          ) : isUploading ? (
            <Windmill
              data-tooltip-id="audio-uploading"
              data-tooltip-content="Uploading..."
              size={16}
              color={colors.p1}
              animating
            />
          ) : null
        ) : (
          <TbExclamationCircle
            data-tooltip-id="no-audio-match"
            data-tooltip-content="Upload text with matching name."
            className="text-p1"
          />
        )}
      </div>
      <BsArrowRight className="text-f1 invisible sm:visible" />
      <div
        className={`w-full flex-1 flex flex-row items-center card px-4 py-4
          ${!textFile ? 'bg-p1/10' : ''}`}
      >
        <p className="flex-1">{textFile ?? 'No text file found'}</p>
        {textFile ? (
          deleting === textFile ? (
            <Windmill
              data-tooltip-id="text-deleting"
              data-tooltip-content="Deleting..."
              size={16}
              color={colors.p1}
              animating
            />
          ) : isTextUploaded ? (
            <div className="flex flex-row gap-2">
              <button
                data-tooltip-id="text-delete"
                data-tooltip-content="Delete"
                onClick={() => deleteFile(textFile)}
                className="tooltip-parent group/uploaded"
              >
                <BiTrash className="text-p1/40" />
              </button>
              <BiSolidCheckCircle
                data-tooltip-id="text-uploaded"
                data-tooltip-content="Uploaded"
                className="text-p1/40"
              />
            </div>
          ) : isUploading ? (
            <Windmill
              data-tooltip-id="text-uploading"
              data-tooltip-content="Upload..."
              size={16}
              color={colors.p1}
              animating
            />
          ) : null
        ) : (
          <TbExclamationCircle
            data-tooltip-id="no-text-match"
            data-tooltip-content="Upload audio with matching name."
            className="text-p1"
          />
        )}
      </div>
      <Tooltip id="no-audio-match" />
      <Tooltip id="no-text-match" />
      <Tooltip id="text-uploading" />
      <Tooltip id="text-uploaded" />
      <Tooltip id="text-delete" />
      <Tooltip id="text-deleting" />
      <Tooltip id="audio-uploading" />
      <Tooltip id="audio-uploaded" />
      <Tooltip id="audio-delete" />
      <Tooltip id="audio-deleting" />
    </div>
  )
}
