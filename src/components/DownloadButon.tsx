import { Description, Field, Label, Radio, RadioGroup } from '@headlessui/react'
import { Dispatch, SetStateAction } from 'react'
import { BiDownload } from 'react-icons/bi'
import { TbCheck } from 'react-icons/tb'
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
      {/* <form className="flex flex-col w-full">
        <label className="mb-2 text-sm font-bold">Select download format</label>
        <select
          className="bg-b1"
          value={downloadType}
          onChange={(event) =>
            setDownloadType(event.target.value as DownloadType)
          }
        >
          {downloadTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </form> */}
      <Field className="w-full gap-2 flex flex-col">
        <Label>Select download format</Label>
        <RadioGroup
          value={downloadType}
          onChange={setDownloadType}
          className="w-full gap-2 flex flex-col"
        >
          {downloadTypes.map((type) => (
            // <Field
            //   key={type.type}
            //   className="flex items-center gap-2 w-full bg-b2 rounded-lg p-4"
            // >
            <Radio
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
            // </Field>
          ))}
        </RadioGroup>
      </Field>
      {/* <Field className="w-full flex flex-col gap-2 mb-4">
        <Label className="text-sm font-bold">Select download format</Label>
        <Listbox value={downloadType} onChange={setDownloadType}>
          <ListboxButton
            className="w-full rounded-lg bg-b2 p-4 flex justify-between items-center hover:shadow-lg
              transition"
          >
            {downloadType}
            <TbChevronDown className="size-4 text-p1" />
          </ListboxButton>
          <ListboxOptions
            transition
            anchor="bottom"
            className="w-[var(--button-width)] bg-b2 rounded-lg mt-2 flex flex-col origin-top
              transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            {downloadTypes.map((type) => (
              <ListboxOption
                key={type}
                value={type}
                className="data-[focus]:bg-p1/10 w-full bg-b2 flex flex-row p-4 cursor-pointer items-center
                  gap-2"
              >
                {({ selected }) => (
                  <>
                    {selected ? <TbCheck className="size-4 text-p1" /> : null}
                    {type}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      </Field> */}
      <button className="btn-primary gap-4 w-full" onClick={download}>
        <BiDownload className="size-4" />
        <span>Download</span>
      </button>
    </div>
  )
}
