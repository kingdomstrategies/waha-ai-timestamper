import { Description, Field, Radio, RadioGroup } from '@headlessui/react'
import { Dispatch, SetStateAction } from 'react'
import { TbCircleCheckFilled, TbDownload } from 'react-icons/tb'
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
    <div className="flex flex-col items-center justify-center gap-4 w-full mb-8 mt-12">
      <Field className="w-full flex flex-col">
        <h2 className="form-label">Download Format</h2>
        <RadioGroup
          value={downloadType}
          onChange={setDownloadType}
          className="w-full gap-2 flex flex-col"
        >
          {downloadTypes.map((type) => (
            <Radio
              key={type.type}
              value={type.type}
              className={({ checked }) =>
                `form flex flex-row items-center gap-2 cursor-pointer hover:bg-p1/10 border
                hover:border-p1/10 ${checked ? 'border-p1/50' : 'border-b2'}`
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
                    <TbCircleCheckFilled className="size-8 text-p1" />
                  ) : null}
                </>
              )}
            </Radio>
          ))}
        </RadioGroup>
      </Field>
      <button className="btn-primary w-full" onClick={download}>
        <TbDownload className="size-4" />
        <span>Download</span>
      </button>
    </div>
  )
}
