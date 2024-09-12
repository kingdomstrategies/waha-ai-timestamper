import { useMemo } from 'react'
import { audioExtensions, textExtensions } from '../components/Home'

interface Props {
  uploadedFiles: { name: string }[] | undefined
  filesToUpload: File[]
}

export default function useMatches({ filesToUpload, uploadedFiles }: Props) {
  /**
   * Match audio files with text files.
   */
  const matches = useMemo(() => {
    const allFiles = [...(uploadedFiles ?? []), ...filesToUpload].filter(
      (file, index, array) =>
        array.findIndex((f) => f.name === file.name) === index
    )

    const audioFiles: Map<string, string> = new Map()
    const textFiles: Map<string, string> = new Map()

    // Helper function to get the file name without the extension
    function getFileNameWithoutExtension(
      file: string,
      extensions: string[]
    ): string | null {
      for (const ext of extensions) {
        if (file.endsWith(ext)) {
          return file.slice(0, -ext.length)
        }
      }
      return null
    }

    // Separate audio and text files into different maps
    allFiles.forEach((file) => {
      const audioFileName = getFileNameWithoutExtension(
        file.name,
        audioExtensions
      )
      const textFileName = getFileNameWithoutExtension(
        file.name,
        textExtensions
      )

      if (audioFileName) {
        audioFiles.set(audioFileName, file.name)
      } else if (textFileName) {
        textFiles.set(textFileName, file.name)
      }
    })

    const matchedFiles: Array<[string | undefined, string | undefined]> = []

    // Match audio files with text files
    audioFiles.forEach((audioFile, baseName) => {
      if (textFiles.has(baseName)) {
        matchedFiles.push([audioFile, textFiles.get(baseName)])
        textFiles.delete(baseName)
      } else {
        matchedFiles.push([audioFile, undefined])
      }
    })

    // Add remaining text files that have no matching audio files
    textFiles.forEach((textFile, baseName) => {
      matchedFiles.push([undefined, textFile])
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

  const firstAudio = matches.find((match) => match[0] !== undefined)?.[0]
  const firstAudioUpload = uploadedFiles?.find(
    (file) => file.name === firstAudio
  )

  return {
    matches,
    firstAudio,
    isFirstAudioUploaded:
      firstAudio !== undefined && firstAudioUpload !== undefined,
  }
}
