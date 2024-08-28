'use client'
import { listAll, ref, uploadBytes } from 'firebase/storage'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Windmill } from 'react-activity'
import 'react-activity/dist/library.css'
import { BiError, BiSolidCheckCircle, BiUpload } from 'react-icons/bi'
import { BsArrowRight } from 'react-icons/bs'
import { v4 as uuidv4 } from 'uuid'
import { fbStorage } from '../firebase'
import { colors } from '../styles/colors'

type Match = [string | undefined, string | undefined]

export default function Home() {
  const router = useRouter()
  const params = useSearchParams()
  const [existingSessionId] = useState(params.get('sessionId'))
  const [sessionId] = useState<string>(existingSessionId ?? uuidv4())

  useEffect(() => {
    router.push(`/?sessionId=${sessionId}`)
  }, [router, sessionId])

  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<any>(null)
  const [filesToUpload, setFilesToUpload] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string }[]>([])
  // const [refresh, setRefresh] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  /**
   * Match audio files with text files.
   */
  const matches = useMemo(() => {
    const allFiles = [...uploadedFiles, ...filesToUpload].filter(
      (file, index, array) =>
        array.findIndex((f) => f.name === file.name) === index
    )

    const audioFiles: Set<string> = new Set()
    const textFiles: Set<string> = new Set()

    // Separate audio and text files into different sets
    allFiles.forEach((file) => {
      if (file.name.endsWith('.wav')) {
        audioFiles.add(file.name.replace('.wav', ''))
      } else if (file.name.endsWith('.txt')) {
        textFiles.add(file.name.replace('.txt', ''))
      }
    })

    const matchedFiles: Array<[string | undefined, string | undefined]> = []

    // Match audio files with text files
    audioFiles.forEach((audioFile) => {
      if (textFiles.has(audioFile)) {
        matchedFiles.push([audioFile + '.wav', audioFile + '.txt'])
        textFiles.delete(audioFile)
      } else {
        matchedFiles.push([audioFile + '.wav', undefined])
      }
    })

    // Add remaining text files that have no matching audio files
    textFiles.forEach((textFile) => {
      matchedFiles.push([undefined, textFile + '.txt'])
    })

    // Sort matches alphabetically.
    return matchedFiles.sort((a, b) => {
      if (a[0] && b[0]) {
        return a[0].localeCompare(b[0])
      } else if (a[0]) {
        return -1
      } else if (b[0]) {
        return 1
      } else if (a[1] && b[1]) {
        return a[1].localeCompare(b[1])
      } else if (a[1]) {
        return -1
      } else if (b[1]) {
        return 1
      } else {
        return 0
      }
    })
  }, [filesToUpload, uploadedFiles])

  useEffect(() => {
    async function getExistingFiles() {
      const sessionRef = ref(fbStorage, `sessions/${sessionId}`)
      const { items } = await listAll(sessionRef)
      setUploadedFiles(
        items
          .map((item) => ({ name: item.name }))
          // Remove files that need to be uploaded. This happens if a file has been
          // uploaded but is being replaced.
          .filter(
            (file) => !filesToUpload.some((upload) => upload.name === file.name)
          )
      )
    }
    getExistingFiles().catch(console.error)
  }, [sessionId, existingSessionId, filesToUpload])

  async function handleSubmit(e: any) {
    if (filesToUpload.length === 0) {
      // no file has been submitted
    } else {
      setIsUploading(true)
      for (const file of filesToUpload) {
        const storageRef = ref(fbStorage, `sessions/${sessionId}/${file.name}`)

        try {
          await uploadBytes(storageRef, file)

          // Although we update the uploaded files state in the useEffect, updating it
          // here quickly updates the UI immediately to show the file has been uploaded.
          setUploadedFiles((prevState) => [...prevState, { name: file.name }])

          // Remove file from files to upload.
          setFilesToUpload((prevState) => prevState.filter((f) => f !== file))
          console.log('Uploaded a blob or file!')
        } catch (error) {
          console.error('Error uploading file: ', error)
        }
      }
      setIsUploading(false)
    }
  }

  function removeFile(fileName: any, idx: any) {
    const newArr = [...filesToUpload]
    newArr.splice(idx, 1)
    setFilesToUpload([])
    setFilesToUpload(newArr)
  }

  return (
    <main
      className="px-4 flex min-h-screen flex-col items-center justify-between py-12 w-full
        max-w-2xl gap-4"
    >
      <div className="w-full">
        {/* <h1 className="font-bold text-xl mb-1">Forced Alignment</h1>
        <p className="text-f2 text-sm mb-1">
          This app will take your audio files and your text files and output
          data mapping each piece of a text to a specific time in the audio.
          This process is called &quot;forced alignment&quot;.
        </p> */}
        <span
          className="text-xs text-f2 font-bold cursor-pointer group/copy flex relative justify-center"
          onClick={() => {
            // Copy to clipboard
            navigator.clipboard.writeText(
              `http://localhost:3000/?sessionId=${sessionId}`
            )
          }}
        >
          http://localhost:3000/?sessionId={sessionId}
          <span className="tooltip group-hover/copy:scale-100">
            Click to copy
          </span>
        </span>
      </div>
      {matches.length !== 0 ? (
        <div className="flex flex-row w-full gap-4 flex-1">
          <div className="flex flex-1 flex-col gap-2">
            {/* <p className="text-center font-bold">Audio Files</p> */}
            {matches.map(([audioFile, textFile]) => {
              const isAudioUploaded = uploadedFiles.some(
                (uploaded) => uploaded.name === audioFile
              )

              const isTextUploaded = uploadedFiles.some(
                (uploaded) => uploaded.name === textFile
              )

              return (
                <div
                  key={audioFile}
                  className="flex flex-row py-1 gap-4 items-center"
                >
                  <span
                    className={`flex-1 flex flex-row items-center card px-4 py-4 ${!audioFile ? 'bg-p1/10' : ''}`}
                  >
                    <p className="flex-1">
                      {audioFile ?? 'No audio file found'}
                    </p>
                    {audioFile ? (
                      isAudioUploaded ? (
                        <span className="group/uploaded flex relative justify-center">
                          <BiSolidCheckCircle className="text-p1/40" />
                          <span className="tooltip group-hover/uploaded:scale-100">
                            Uploaded
                          </span>
                        </span>
                      ) : isUploading ? (
                        <Windmill size={16} color={colors.p1} animating />
                      ) : (
                        <span className="group/uploaded flex relative justify-center">
                          <BiUpload className="text-p1" />
                          <span className="tooltip group-hover/uploaded:scale-100">
                            This file needs to be uploaded
                          </span>
                        </span>
                      )
                    ) : (
                      <span className="group/uploaded flex relative justify-center">
                        <BiError className="text-p1" />
                        <span className="tooltip group-hover/uploaded:scale-100">
                          Cannot find a text file with the same name as this
                          audio file. Please upload a text file with the same
                          name.
                        </span>
                      </span>
                    )}
                  </span>
                  <BsArrowRight className="text-f1" />
                  <span
                    className={` flex-1 flex flex-row items-center card px-4 py-4 ${!textFile ? 'bg-p1/10' : ''}`}
                  >
                    <p className="flex-1">{textFile ?? 'No text found'}</p>
                    {textFile ? (
                      isTextUploaded ? (
                        <span className="group/uploaded flex relative justify-center">
                          <BiSolidCheckCircle className="text-p1/40" />
                          <span className="tooltip group-hover/uploaded:scale-100">
                            Uploaded
                          </span>
                        </span>
                      ) : isUploading ? (
                        <Windmill size={16} color={colors.p1} animating />
                      ) : (
                        <span className="group/uploaded flex relative justify-center">
                          <BiUpload className="text-p1" />
                          <span className="tooltip group-hover/uploaded:scale-100">
                            This file needs to be uploaded
                          </span>
                        </span>
                      )
                    ) : (
                      <span className="group/uploaded flex relative justify-center">
                        <BiError className="text-p1" />
                        <span className="tooltip group-hover/uploaded:scale-100">
                          Cannot find a text file with the same name as this
                          audio file. Please upload a text file with the same
                          name.
                        </span>
                      </span>
                    )}
                  </span>
                  {/* <button
                  className="text-sm border border-p1/10 rounded-lg text-p1"
                  onClick={() => removeFile(file.name, 0)}
                >
                  Remove
                </button> */}
                </div>
              )
            })}
          </div>
          {/* <div className="flex flex-1 flex-col bg-b2 rounded-xl p-4 gap-2">
            <p className="text-center font-bold">Text Files</p>
            {textFiles.map((file: any, idx: any) => (
              <div key={idx} className="flex flex-row">
                <span>{file.name}</span>
              </div>
            ))}
          </div> */}
        </div>
      ) : null}
      {
        // Update this logic to disable button if every file isn't matched.
        filesToUpload.length !== 0 && !isUploading ? (
          <button
            className="btn-primary w-full"
            disabled={isUploading}
            onClick={handleSubmit}
          >
            {isUploading ? 'Uploading...' : `Upload (${filesToUpload.length})`}
          </button>
        ) : null
      }
      <div
        className={`${dragActive ? 'bg-p1/10' : ''} transition flex flex-col w-full
          ${matches.length === 0 ? 'flex-1' : ''} py-4 h-full border-dashed border
          border-p1 rounded-xl items-center justify-center gap-4`}
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
              setFilesToUpload((prevState) => [
                ...prevState,
                e.dataTransfer.files[i],
              ])
              // Remove file from uploaded files.
              setUploadedFiles((prevState) =>
                prevState.filter(
                  (uploadedFile) =>
                    uploadedFile.name !== e.dataTransfer.files[i].name
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
                setFilesToUpload((prevState) => [
                  ...prevState,
                  e.target.files[i],
                ])
                // Remove file from uploaded files.
                setUploadedFiles((prevState) =>
                  prevState.filter(
                    (uploadedFile) =>
                      uploadedFile.name !== e.target.files[i].name
                  )
                )
              }
          }}
          accept=".wav,.txt"
        />
        <p>
          Drag and drop files here or{' '}
          <span
            className="font-bold text-blue-600 cursor-pointer"
            onClick={() => {
              inputRef.current.value = ''
              inputRef.current.click()
            }}
          >
            <u>browse</u>
          </span>
        </p>
      </div>
    </main>
  )
}
