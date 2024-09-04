'use client'
import { enqueueSnackbar } from 'notistack'
import { Dispatch, SetStateAction } from 'react'
import 'react-activity/dist/library.css'
import {} from 'react-icons/fa6'
import { TbUpload } from 'react-icons/tb'
import { Match } from './MatchItem'
const audioExtensions = ['.wav', '.mp3']
const textExtensions = ['.txt']

interface Props {
  dragActive: boolean
  setDragActive: Dispatch<SetStateAction<boolean>>
  inputRef: any
  setFilesToUpload: Dispatch<SetStateAction<File[]>>
  setUploadedFiles: Dispatch<
    SetStateAction<
      | {
          name: string
        }[]
      | undefined
    >
  >
  matches: Match[]
}
export default function UploadArea({
  dragActive,
  inputRef,
  setDragActive,
  setFilesToUpload,
  setUploadedFiles,
  matches,
}: Props) {
  return (
    <div
      className={`${dragActive ? 'bg-p1/10' : ''} transition flex flex-col w-full
        ${matches.length === 0 ? 'flex-1' : ''} py-8 h-full border-dashed border
        border-p1 rounded-xl items-center justify-center gap-4 mb-4`}
      onDragEnter={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(true)
      }}
      onSubmit={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
          for (let i = 0; i < e.dataTransfer.files['length']; i++) {
            const file = e.dataTransfer.files[i]
            const isValidTextType = textExtensions.some((ext) =>
              file.name.includes(ext)
            )
            const isValidAudioType = audioExtensions.some((ext) =>
              file.name.includes(ext)
            )

            if (!isValidTextType && !isValidAudioType) {
              enqueueSnackbar(
                `Ignoring file "${file.name}" due to invalid file type.`
              )
              continue
            }

            setFilesToUpload((prevState) => [...prevState, file])
            // Remove file from uploaded files.
            setUploadedFiles((prevState) =>
              prevState?.filter(
                (uploadedFile) => uploadedFile.name !== file.name
              )
            )
          }
        }
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(true)
      }}
    >
      <input
        placeholder="fileInput"
        className="hidden"
        ref={inputRef}
        type="file"
        multiple={true}
        onChange={(e) => {
          e.preventDefault()
          console.log('File has been added')
          if (e.target.files && e.target.files[0])
            for (let i = 0; i < e.target.files['length']; i++) {
              const file = e.target.files[i]
              if (!file) continue

              setFilesToUpload((prevState) => [...prevState, file])
              // Remove file from uploaded files.
              setUploadedFiles((prevState) =>
                prevState?.filter(
                  (uploadedFile) => uploadedFile.name !== file.name
                )
              )
            }
        }}
        accept={audioExtensions.concat(textExtensions).join(',')}
      />
      <TbUpload className="size-8 text-p1" />
      <p className="text-center">
        Drag and drop files here or{' '}
        <span
          className="font-bold text-blue-600 cursor-pointer"
          onClick={() => {
            inputRef.current.value = ''
            inputRef.current.click()
          }}
        >
          <u className="text-p1">browse</u>
        </span>
      </p>
      <div className="flex flex-row gap-2">
        {[...audioExtensions, ...textExtensions].map((ext) => (
          <p key={ext} className="pill">
            {ext}
          </p>
        ))}
      </div>
    </div>
  )
}
