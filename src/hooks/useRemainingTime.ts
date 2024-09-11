import { useEffect, useState } from 'react'
import { useInterval } from 'usehooks-ts'

export default function useRemainingTime(
  uploadStartTime: number | undefined,
  filesToUpload: File[],
  uploadedFiles: { name: string }[] | undefined
) {
  const [remainingTime, setRemainingTime] = useState<number>()

  const uploaded = filesToUpload.filter((file) =>
    uploadedFiles?.some((uploaded) => uploaded.name === file.name)
  )

  useEffect(() => {
    if (!uploadStartTime) return

    setRemainingTime(0)
  }, [uploadStartTime])

  const sizeOfUploaded = uploaded.reduce((acc, file) => acc + file.size, 0)
  const sizeRemaining = filesToUpload
    .filter((file) => !uploaded.some((uploaded) => uploaded.name === file.name))
    .reduce((acc, file) => acc + file.size, 0)

  useInterval(
    () => {
      if (!uploadStartTime || sizeOfUploaded === 0) return

      const elapsedTime = Date.now() - uploadStartTime
      const averageTimePerByte = elapsedTime / sizeOfUploaded
      const remainingTime = sizeRemaining * averageTimePerByte

      setRemainingTime(remainingTime)
    },
    uploadStartTime ? 2000 : null
  )

  return { remainingTime, sizeOfUploaded, sizeRemaining }
}
