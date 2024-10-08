'use client'
import FileSaver from 'file-saver'
import { getBlob, ref, uploadBytes } from 'firebase/storage'
import JSZip from 'jszip'
import { enqueueSnackbar } from 'notistack'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Windmill } from 'react-activity'
import 'react-activity/dist/library.css'
import { TbDownload, TbUpload } from 'react-icons/tb'
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
  const [isDownloading, setIsDownloading] = useState(false)

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
      setSessionTextExt(uploadedTextExt)
    }
    if (!sessionAudioExt) {
      const uploadedAudioExt = uploadedFiles
        .find((f) => audioExtensions.some((ext) => f.name.includes(ext)))
        ?.name.split('.')
        .pop()
      setSessionAudioExt(uploadedAudioExt)
    }
  }, [
    sessionAudioExt,
    sessionTextExt,
    setSessionAudioExt,
    setSessionTextExt,
    uploadedFiles,
  ])

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
    enqueueSnackbar('Files uploaded successfully.', { variant: 'success' })
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
        border-dashed border border-p1/40 rounded-xl overflow-y-auto gap-2 min-h-0`}
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
      {matches.length > 0 ? (
        <div className="w-full flex sm:mt-4 invisible sm:visible">
          <p className="flex-1 text-center text-sm text-f2">Audio</p>
          <p className="flex-1 text-center text-sm text-f2">Text</p>
        </div>
      ) : null}
      <div className="flex flex-col gap-2 w-full">
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
      <div className="flex-1 flex flex-col items-center justify-center gap-4 mb-8 mt-4">
        <TbUpload className="size-8 text-p1" />
        <div className="flex flex-col w-full items-center">
          <p className="text-center text-xl font-bold">
            Drag and drop audio and text files you want to align here
          </p>

          <p
            className="font-bold cursor-pointer"
            onClick={() => {
              inputRef.current.value = ''
              inputRef.current.click()
            }}
          >
            <u className="text-p1">or browse</u>
          </p>
        </div>
        <div className="flex flex-row gap-2 mb-4">
          {[...audioExtensions, ...textExtensions].map((ext) => (
            <p key={ext} className="pill">
              {ext}
            </p>
          ))}
        </div>
        <div className="p-4 text-xs text-center text-f2 bg-f2/10 rounded-lg flex flex-col w-full gap-1">
          Audio and its corresponding text files should have the same name but
          different extensions
          <p>
            For example, you can upload{' '}
            <span className="font-mono bg-f2/10 p-1 rounded-lg">GEN.1.mp3</span>{' '}
            and{' '}
            <span className="font-mono bg-f2/10 p-1 rounded-lg">GEN.1.txt</span>
            .
          </p>
        </div>
        <button
          className="btn mt-4"
          disabled={isDownloading}
          onClick={async () => {
            const testFile1Ref = ref(fbStorage, `test_files/SWA_JHN_001.mp3`)
            const testFile2Ref = ref(fbStorage, `test_files/SWA_JHN_001.txt`)
            setIsDownloading(true)
            const testFile1Blob = await getBlob(testFile1Ref)
            const testFile2Blob = await getBlob(testFile2Ref)
            const zip = new JSZip()
            zip.file('SWA_JHN_001.mp3', testFile1Blob)
            zip.file('SWA_JHN_001.txt', testFile2Blob)
            zip.generateAsync({ type: 'blob' }).then((content) => {
              FileSaver.saveAs(
                content,
                `timestamp_audio_hackathon_sample_files.zip`
              )
            })
            // download(testFile1Url, 'SWA_JHN_001.mp3')
            // download(testFile2Url, 'SWA_JHN_001.txt')
            // FileSaver.saveAs(testFile2Blob, 'SWA_JHN_001.txt')
            setIsDownloading(false)
          }}
        >
          {isDownloading ? <Windmill size={12} color={colors.p1} /> : null}
          Download sample files
          <TbDownload className="size-4 text-p1" />
        </button>
      </div>
    </div>
  )
}
