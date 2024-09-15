import {
  TbCircleNumber1,
  TbCircleNumber2,
  TbCircleNumber3,
  TbCircleNumber4,
} from 'react-icons/tb'
import 'react-multi-carousel/lib/styles.css'

export default function HowItWorks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {[
        [
          'Upload Your Files',
          'Upload your audio files and matching text transcript files. Make sure their file names match to ensure correct pairing.',
          <TbCircleNumber1 className="size-8 text-p1 mb-2" />,
          // 'https://firebasestorage.googleapis.com/v0/b/waha-ai-timestamper-4265a.appspot.com/o/images%2Fezgif-7-85516498a6.gif?alt=media',
        ],
        [
          'Detect Language',
          'Timestamp Audio will automatically detect the language of your audio files, or you can select manually from 1100+ languages  .',
          <TbCircleNumber2 className="size-8 text-p1 mb-2" />,
        ],
        [
          'Timestamp!',
          'Using AI, the app will timestamp the text based on its corresponding section in the audio.',
          <TbCircleNumber3 className="size-8 text-p1 mb-2" />,
          // 'https://firebasestorage.googleapis.com/v0/b/waha-ai-timestamper-4265a.appspot.com/o/images%2Fezgif-4-74833150a6.gif?alt=media',
        ],
        [
          'Download your data',
          'Download your timestamped data as json and add to your web app or as srt to easily add subtitles to your videos.',
          <TbCircleNumber4 className="size-8 text-p1 mb-2" />,
        ],
      ].map(([title, description, icon], index) => (
        <div
          key={title as string}
          className="card bg-b2 px-6 py-6 overflow-hidden mb-2"
        >
          {icon}
          <h2 className="font-bold text-xl mb-2">{title}</h2>
          <p className="text-f2">{description}</p>
        </div>
      ))}
    </div>
  )
}
