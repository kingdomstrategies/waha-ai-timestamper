'use client'

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { Dispatch, SetStateAction } from 'react'
import { TbX } from 'react-icons/tb'

interface Props {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function HelpModal({ open, setOpen }: Props) {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-f1 bg-opacity-30 transition-opacity data-[closed]:opacity-0
          data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out
          data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center px-4">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-b2 text-left shadow-xl
              transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0
              data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out
              data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl
              data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 w-full"
          >
            <div className="p-4 w-full">
              <div className="flex items-start w-full">
                <div className="flex flex-col w-full">
                  <div className="w-full justify-end flex flex-row">
                    <DialogTitle as="h3" className="text-lg flex-1 font-bold">
                      Introducing{' '}
                      <span className="font-mono text-p1">timestamp.audio</span>
                    </DialogTitle>
                    <button
                      className="btn px-2 py-2"
                      onClick={() => setOpen(false)}
                    >
                      <TbX className="size-4 text-p1" />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-col">
                    <h2 className="text-md font-bold mb-1">
                      What is forced alignment?
                    </h2>
                    <p className="text-sm">
                      This app uses AI to accurately align audio recordings with
                      their corresponding text transcriptions. Forced alignment
                      assigns timestamps to each line of text, indicating when
                      it is spoken in the audio, making it easy to sync text and
                      sound.
                    </p>
                    <h2 className="text-md font-bold mt-4 mb-1">
                      Why is it useful?
                    </h2>
                    <p className="text-sm">
                      With timestamped text, you can create subtitles, add
                      read-along modes where text highlights as it’s spoken, or
                      even programmatically edit audio files. This data is
                      valuable for video production, digital bibles, podcasting,
                      language learning, and more.
                    </p>
                    <h2 className="text-md font-bold mt-4 mb-1">
                      How do I use the app?
                    </h2>
                    <ol className="list-decimal ml-4 text-sm">
                      <li className="mb-1">
                        <span className="font-bold">Upload Your Files:</span>{' '}
                        Upload your audio files and matching text files. Each
                        text file should contain the transcription of its
                        corresponding audio file. Make sure their file names
                        match to ensure correct pairing.
                      </li>
                      <li className="mb-1">
                        <span className="font-bold">
                          Automatic Segmentation:
                        </span>{' '}
                        The app will mark segments based on line-breaks and
                        align each line with its corresponding section in the
                        audio.
                      </li>
                      <li>
                        <span className="font-bold">Language Selection:</span>{' '}
                        Don’t forget to select the language of your audio and
                        text files. The app supports over 1,000 languages!
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
