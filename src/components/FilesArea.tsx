'use client'
import { ref, uploadBytes } from 'firebase/storage'
import { enqueueSnackbar } from 'notistack'
import { Dispatch, SetStateAction } from 'react'
import { Windmill } from 'react-activity'
import 'react-activity/dist/library.css'
import { TbUpload } from 'react-icons/tb'
import { fbStorage } from '../firebase'
import { colors } from '../styles/colors'
import MatchItem, { Match } from './MatchItem'
const audioExtensions = ['.wav', '.mp3']
const textExtensions = ['.txt']

interface Props {
  isUploading: boolean
  setIsUploading: Dispatch<SetStateAction<boolean>>
  uploadedFiles: { name: string }[] | undefined
  sessionId: string
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
  isFetchingExistingFiles: boolean
}
export default function FilesArea({
  isUploading,
  uploadedFiles,
  setIsUploading,
  sessionId,
  dragActive,
  inputRef,
  setDragActive,
  setFilesToUpload,
  setUploadedFiles,
  matches,
  isFetchingExistingFiles,
}: Props) {
  async function onDragOrSelect(files: FileList | null) {
    if (!files) {
      enqueueSnackbar('No files selected.')
      return
    } else if (isUploading) {
      enqueueSnackbar('Please wait for the current uploads to finish.')
      return
    }

    setIsUploading(true)

    const filesToUpload = []

    for (let i = 0; i < files['length']; i++) {
      let file = files[i]
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
      } else {
        // Remove file from uploaded files in case we are replacing a file.
        setUploadedFiles((prevState) =>
          prevState?.filter((uploadedFile) => uploadedFile.name !== file.name)
        )
        filesToUpload.push(file)
      }
    }

    setFilesToUpload(filesToUpload)

    for (const file of filesToUpload) {
      const storageRef = ref(
        fbStorage,
        `sessions/${sessionId}/${file.name.replace(/ /g, '_')}`
      )

      try {
        await uploadBytes(storageRef, file)

        // Although we update the uploaded files state in the useEffect, updating it
        // here quickly updates the UI immediately to show the file has been uploaded.
        setUploadedFiles((prevState) => [
          ...(prevState ?? []),
          { name: file.name },
        ])

        // Remove file from files to upload.
        // setFilesToUpload((prevState) => prevState.filter((f) => f !== file))
        console.log('Uploaded a blob or file!')
      } catch (error) {
        console.error('Error uploading file: ', error)
      }
    }
    setFilesToUpload([])
    setIsUploading(false)
  }

  return isFetchingExistingFiles ? (
    <div
      className="w-full flex flex-col flex-1 items-center justify-center border-dashed border
        border-p1/40 rounded-xl overflow-y-auto gap-8"
    >
      <Windmill color={colors.p1} size={32} />
      Loading files...
    </div>
  ) : (
    <div
      className={`${dragActive ? 'bg-p1/10' : ''} transition flex flex-col w-full flex-1 px-4
        h-full border-dashed border border-p1/40 rounded-xl overflow-y-auto gap-8`}
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
        onDragOrSelect(e.dataTransfer.files)
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
      <div className="flex flex-col gap-2 w-full mt-4">
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
      <input
        placeholder="fileInput"
        className="hidden"
        ref={inputRef}
        type="file"
        multiple={true}
        onChange={(e) => {
          e.preventDefault()
          onDragOrSelect(e.target.files)
        }}
        accept={audioExtensions.concat(textExtensions).join(',')}
      />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 mb-8">
        <TbUpload className="size-8 text-p1" />
        <div className="flex flex-col w-full items-center">
          <p className="text-center">
            Drag and drop files audio and text files you want to align here
          </p>
          <p>
            <span
              className="font-bold cursor-pointer"
              onClick={() => {
                inputRef.current.value = ''
                inputRef.current.click()
              }}
            >
              <u className="text-p1">or browse</u>
            </span>
          </p>
        </div>
        <div className="flex flex-row gap-2">
          {[...audioExtensions, ...textExtensions].map((ext) => (
            <p key={ext} className="pill">
              {ext}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
