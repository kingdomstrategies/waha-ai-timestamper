'use client'
import { ref, uploadBytes } from 'firebase/storage'
import { enqueueSnackbar } from 'notistack'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { Windmill } from 'react-activity'
import 'react-activity/dist/library.css'
import { TbUpload } from 'react-icons/tb'
import { fbStorage } from '../firebase'
import { colors } from '../styles/colors'
import { audioExtensions, textExtensions } from './Home'
import MatchItem, { Match } from './MatchItem'

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
  setUploadStartTime: Dispatch<SetStateAction<number | undefined>>
  setUploadSize: Dispatch<SetStateAction<number | undefined>>
  sessionTextExt: string | undefined
  setSessionTextExt: Dispatch<SetStateAction<string | undefined>>
  sessionAudioExt: string | undefined
  setSessionAudioExt: Dispatch<SetStateAction<string | undefined>>
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
  setUploadStartTime,
  setUploadSize,
  sessionAudioExt,
  sessionTextExt,
  setSessionAudioExt,
  setSessionTextExt,
}: Props) {
  useEffect(() => {
    if (!uploadedFiles) {
      // setSessionTextExt(undefined)
      // setSessionAudioExt(undefined)
      return
    }

    if (!sessionTextExt) {
      const uploadedTextExt = uploadedFiles
        .find((f) => textExtensions.some((ext) => f.name.includes(ext)))
        ?.name.split('.')
        .pop()
      console.log('uploadedTextExt', uploadedTextExt)
      setSessionTextExt(uploadedTextExt)
    }
    if (!sessionAudioExt) {
      const uploadedAudioExt = uploadedFiles
        .find((f) => audioExtensions.some((ext) => f.name.includes(ext)))
        ?.name.split('.')
        .pop()
      console.log('uploadedAudioExt', uploadedAudioExt)
      setSessionAudioExt(uploadedAudioExt)
    }
  }, [
    sessionAudioExt,
    sessionTextExt,
    setSessionAudioExt,
    setSessionTextExt,
    uploadedFiles,
  ])

  console.log(
    'sessionTextExt',
    sessionTextExt,
    'sessionAudioExt',
    sessionAudioExt
  )

  async function onDragOrSelect(files: FileList | null) {
    if (!files) {
      enqueueSnackbar('No files selected.')
      return
    } else if (isUploading) {
      enqueueSnackbar('Please wait for the current uploads to finish.')
      return
    } else if (uploadedFiles && uploadedFiles.length + files.length > 2000) {
      enqueueSnackbar('You can only upload up to 2000 files at a time.')
      return
    } else if (files['length'] > 2000) {
      enqueueSnackbar('You can only upload up to 2000 files at a time.')
      return
    }

    setIsUploading(true)

    const filesToUpload: File[] = []

    for (let i = 0; i < files.length; i++) {
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
      }

      const size = file.size / 1024 / 1024
      if (size > 1000) {
        enqueueSnackbar(
          `Ignoring file "${file.name}" due to file size exceeding 1GB.`
        )
        continue
      }

      if (!sessionTextExt && isValidTextType)
        setSessionTextExt(file.name.split('.').pop())
      if (!sessionAudioExt && isValidAudioType)
        setSessionAudioExt(file.name.split('.').pop())

      if (
        isValidTextType &&
        sessionTextExt &&
        sessionTextExt !== file.name.split('.').pop()
      ) {
        enqueueSnackbar(
          `Ignoring file "${file.name}" due to different file type.`
        )
        continue
      } else if (
        isValidAudioType &&
        sessionAudioExt &&
        sessionAudioExt !== file.name.split('.').pop()
      ) {
        enqueueSnackbar(
          `Ignoring file "${file.name}" due to different file type.`
        )
        continue
      }

      filesToUpload.push(file)
    }

    // Remove any of these files from uploaded files state
    // Remove file from uploaded files in case we are replacing a file.
    setUploadedFiles((prevState) =>
      prevState?.filter(
        (f) => !filesToUpload.some((file) => file.name === f.name)
      )
    )

    setFilesToUpload(filesToUpload)
    setUploadStartTime(Date.now())
    setUploadSize(filesToUpload.reduce((acc, file) => acc + file.size, 0))

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
    setUploadSize(undefined)
    setIsUploading(false)
    setUploadStartTime(undefined)
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
