import { Description, Field, Radio, RadioGroup } from '@headlessui/react'
import Image from 'next/image'
import { Dispatch, SetStateAction } from 'react'
import { TbCircleCheckFilled, TbDownload } from 'react-icons/tb'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { DownloadType, downloadTypes } from '../hooks/useJob'

interface Props {
  downloadType: DownloadType
  setDownloadType: Dispatch<SetStateAction<DownloadType>>
  download: () => void
}

export default function DownloadButton({
  download,
  downloadType,
  setDownloadType,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-4 w-full flex-1">
      <div className="flex-1 w-full flex flex-col gap-4">
        <Field className="w-full flex flex-col">
          <RadioGroup
            value={downloadType}
            onChange={setDownloadType}
            className="w-full gap-2 flex flex-row"
          >
            {downloadTypes.map((type) => (
              <Radio
                key={type.type}
                value={type.type}
                className={({ checked }) =>
                  `form flex flex-row items-center gap-2 cursor-pointer hover:bg-p1/10 border
                  flex-1 relative hover:border-p1/10 ${checked ? 'border-p1/50' : 'border-b2 '}`
                }
              >
                {({ checked }) => (
                  <>
                    <div className="flex flex-row items-center gap-2 flex-1">
                      <p className="pill w-auto">.{type.type}</p>
                      <Description className="text-f2 text-xs">
                        {type.description}
                      </Description>
                    </div>
                    {checked ? (
                      <TbCircleCheckFilled className="size-4 text-p1 absolute top-1 right-1" />
                    ) : null}
                  </>
                )}
              </Radio>
            ))}
          </RadioGroup>
        </Field>
        <button className="btn-primary w-full mb-4" onClick={download}>
          <TbDownload className="size-4" />
          <span>Download {downloadType}</span>
        </button>
      </div>
      <div className="flex flex-col w-full border rounded-lg border-p1/10 pt-4">
        <h3 className="font-bold mb-4 ml-4">
          Here's what you can do with these timestamps
        </h3>
        <Carousel
          swipeable={false}
          draggable={false}
          className="pb-6 px-4 flex-1 flex"
          responsive={{
            superLargeDesktop: {
              // the naming can be any, depends on you.
              breakpoint: { max: 4000, min: 3000 },
              items: 3,
            },
            desktop: {
              breakpoint: { max: 3000, min: 1024 },
              items: 3,
            },
            tablet: {
              breakpoint: { max: 1024, min: 464 },
              items: 2,
            },
            mobile: {
              breakpoint: { max: 464, min: 0 },
              items: 2,
            },
          }}
        >
          {[
            [
              'Boost Focus & Comprehension',
              "Improve reading comprehension, especially for those with reading or motor disabilities, by highlighting sections of text in real time as they're spoken.",
              'https://firebasestorage.googleapis.com/v0/b/waha-ai-timestamper-4265a.appspot.com/o/images%2Fezgif-4-74833150a6.gif?alt=media',
            ],
            [
              'Make Accessible for All',
              'Download timestamps as .srt files to easily add subtitles to your videos, increasing accessibility, especially for those with hearing disabilities.',
              'https://firebasestorage.googleapis.com/v0/b/waha-ai-timestamper-4265a.appspot.com/o/images%2Fezgif-1-3d416a9be8.gif?alt=media',
            ],
            [
              'Add Effortless Content Navigation',
              'Allow users to instantly find specific sections of podcasts or videos with automatic chapters.',
              'https://firebasestorage.googleapis.com/v0/b/waha-ai-timestamper-4265a.appspot.com/o/images%2Fezgif-1-d25952fe78.gif?alt=media&token=04ab7844-427f-4e0d-af61-e4ef001c29a0',
            ],
            [
              'Simplify Bible Study Creation',
              'Use verse timestamps to programmatically edit specific audio Bible passages.',
              'https://firebasestorage.googleapis.com/v0/b/waha-ai-timestamper-4265a.appspot.com/o/images%2Fezgif-7-85516498a6.gif?alt=media',
            ],
            [
              'Speed Up Bible Translation',
              'Use timestamp data to train AI models to translate Scripture more efficiently, accelerating the process for new languages.',
              'https://firebasestorage.googleapis.com/v0/b/waha-ai-timestamper-4265a.appspot.com/o/images%2Ftraining.gif?alt=media',
            ],
          ].map(([title, description, image]) => (
            <div
              key="title"
              className="card py-0 px-0 h-full mr-4 overflow-hidden"
            >
              <Image
                className="w-full"
                width={80}
                height={40}
                alt={`Image for ${title}`}
                src={image}
              />
              <div className="py-4 px-4 flex flex-col">
                <h2 className="font-bold text-sm mb-1">{title}</h2>
                <p className="text-xs text-f2">{description}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  )
}
