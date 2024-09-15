import Image from 'next/image'
import 'react-multi-carousel/lib/styles.css'

export default function UseCases() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
        {[
          [
            'Simplify Bible Study Creation',
            'Use verse timestamps to programmatically edit specific audio Bible passages.',
            'https://firebasestorage.googleapis.com/v0/b/waha-ai-timestamper-4265a.appspot.com/o/images%2Fezgif-7-85516498a6.gif?alt=media',
          ],
          [
            'Boost Focus & Comprehension',
            "Improve reading comprehension, especially for those with reading or motor disabilities, by highlighting sections of text in real time as they're spoken.",
            'https://firebasestorage.googleapis.com/v0/b/waha-ai-timestamper-4265a.appspot.com/o/images%2Fezgif-4-74833150a6.gif?alt=media',
          ],
          [
            'Increase Accessibility',
            'Download timestamps as .srt files to easily add subtitles to your videos, increasing accessibility, especially for those with hearing disabilities.',
            'https://firebasestorage.googleapis.com/v0/b/waha-ai-timestamper-4265a.appspot.com/o/images%2Fezgif-1-3d416a9be8.gif?alt=media',
          ],
          [
            'Add Effortless Content Navigation',
            'Allow users to instantly find specific sections of podcasts or videos with automatic chapters.',
            'https://firebasestorage.googleapis.com/v0/b/waha-ai-timestamper-4265a.appspot.com/o/images%2Fezgif-1-d25952fe78.gif?alt=media&token=04ab7844-427f-4e0d-af61-e4ef001c29a0',
          ],
          [
            'Speed Up Bible Translation',
            'Use timestamp data to train AI models to translate Scripture more efficiently, accelerating the process for new languages.',
            'https://firebasestorage.googleapis.com/v0/b/waha-ai-timestamper-4265a.appspot.com/o/images%2Ftraining.gif?alt=media',
          ],
          [
            'And many more!',
            'This data is versatile and can be used in many workflows!',
            'https://firebasestorage.googleapis.com/v0/b/waha-ai-timestamper-4265a.appspot.com/o/images%2Fmarvin-meyer-SYTO3xs06fU-unsplash.jpg?alt=media',
          ],
        ].map(([title, description, image]) => (
          <div
            key="title"
            className="grid card bg-b2 py-0 px-0 overflow-hidden"
          >
            <Image
              className="w-full"
              width={80}
              height={40}
              alt={`Image for ${title}`}
              src={image}
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
