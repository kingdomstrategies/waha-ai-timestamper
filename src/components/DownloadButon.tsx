import { Description, Field, Radio, RadioGroup } from '@headlessui/react'
import { Dispatch, SetStateAction } from 'react'
import { TbCircleCheckFilled, TbDownload } from 'react-icons/tb'
import 'react-multi-carousel/lib/styles.css'
import { DownloadType, downloadTypes } from '../hooks/useJob'
import Footer from './Footer'
import UseCases from './UseCases'

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
      <div className="flex-1 w-full flex flex-col gap-4 mb-8">
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
      <h1 className="text-xl font-bold mb-2 w-full text-center">
        What can you do with timestamp data?
      </h1>
      <UseCases />
      <Footer />
    </div>
  )
}
