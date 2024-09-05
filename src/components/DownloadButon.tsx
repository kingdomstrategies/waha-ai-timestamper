import { Description, Field, Radio, RadioGroup } from '@headlessui/react'
import { Dispatch, SetStateAction } from 'react'
import { TbCheck, TbDownload } from 'react-icons/tb'
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
    <div className="flex flex-col items-center justify-center gap-4 w-full mb-8">
      <Field className="w-full gap-2 flex flex-col">
        <h2 className="text-f1 text-lg font-bold mb-1">Download Format</h2>
        <RadioGroup
          value={downloadType}
          onChange={setDownloadType}
          className="w-full gap-2 flex flex-col"
        >
          {downloadTypes.map((type) => (
            <Radio
              key={type.type}
              value={type.type}
              className="bg-b2 flex w-full flex-row items-center gap-4 cursor-pointer rounded-lg p-4
                shadow-sm transition hover:bg-p1/10 hover:shadow-lg"
            >
              {({ checked }) => (
                <>
                  <div className="flex-1 gap-1 flex flex-col items-start">
                    <p className="pill w-auto">.{type.type}</p>
                    <Description className="text-f2 text-xs">
                      {type.description}
                    </Description>
                  </div>
                  {checked ? <TbCheck className="size-8 text-p1" /> : null}
                </>
              )}
            </Radio>
          ))}
        </RadioGroup>
      </Field>
      <button className="btn-primary gap-4 w-full" onClick={download}>
        <TbDownload className="size-4" />
        <span>Download</span>
      </button>
    </div>
  )
}
