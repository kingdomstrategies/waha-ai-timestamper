import { getDownloadURL, ref } from 'firebase/storage'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import 'react-multi-carousel/lib/styles.css'
import { fbStorage } from '../firebase'

export default function UseCases() {
  const [urls, setUrls] = useState<string[]>([])

  useEffect(() => {
    const refs = [
      ref(fbStorage, 'images/use_case_edit.gif'),
      ref(fbStorage, 'images/use_case_focus.gif'),
      ref(fbStorage, 'images/use_case_subtitles.gif'),
      ref(fbStorage, 'images/use_case_chapters.gif'),
      ref(fbStorage, 'images/use_case_train.gif'),
      ref(fbStorage, 'images/use_case_more.jpg'),
    ]
    Promise.all(refs.map((r) => getDownloadURL(r))).then((urls) => {
      setUrls(urls)
    })
  })

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
        {[
          [
            'Simplify Bible Study Creation',
            'Use verse timestamps to programmatically edit specific audio Bible passages.',
          ],
          [
            'Boost Focus & Comprehension',
            "Improve reading comprehension, especially for those with reading or motor disabilities, by highlighting sections of text in real time as they're spoken.",
          ],
          [
            'Increase Accessibility',
            'Download timestamps as .srt files to easily add subtitles to your videos, increasing accessibility, especially for those with hearing disabilities.',
          ],
          [
            'Add Effortless Content Navigation',
            'Allow users to instantly find specific sections of podcasts or videos with automatic chapters.',
          ],
          [
            'Speed Up Bible Translation',
            'Use timestamp data to train AI models to translate Scripture more efficiently, accelerating the process for new languages.',
          ],
          [
            'And many more!',
            'This data is versatile and can be used in many workflows!',
          ],
        ].map(([title, description], index) => (
          <div
            key={title}
            className="grid card bg-b2 py-0 px-0 overflow-hidden"
          >
            <Image
              className="w-full"
              width={80}
              height={40}
              alt={`Image for ${title}`}
              src={urls[index]}
            />
            <div className="py-4 px-4 flex flex-col">
              <h2 className="font-bold text-xl mb-2">{title}</h2>
              <p className="text-f2">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
