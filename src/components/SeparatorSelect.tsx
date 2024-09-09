import {
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import { Dispatch, SetStateAction } from 'react'
import { TbCheck, TbChevronDown } from 'react-icons/tb'

export type Separator = 'lineBreak' | 'squareBracket' | 'downArrow' | 'custom'

export const separatorOptions: Array<{ value: Separator; label: string }> = [
  {
    value: 'lineBreak',
    label: 'Line break',
  },
  {
    value: 'squareBracket',
    label: '[',
  },
  {
    value: 'downArrow',
    label: '⬇️',
  },
  {
    value: 'custom',
    label: 'Custom',
  },
]

interface Props {
  separator: string
  setSeparator: Dispatch<SetStateAction<string>>
  updateSeparator: (separator: string) => void
}

export default function SeparatorSelect({
  separator,
  setSeparator,
  updateSeparator,
}: Props) {
  return (
    <>
      <Field className="w-full flex flex-col gap-2 mt-4">
        <Label className="text-sm">
          <span className="font-bold">Step 3:</span> Choose Timestamp Location
        </Label>
        {/* <Description className="text-xs">
          Select the character you want to use as a separator between
          timestamps.
        </Description> */}
        <Listbox
          value={separator}
          onChange={(value) => {
            const newValue = value === 'custom' ? '' : value
            setSeparator(newValue)
            updateSeparator(newValue)
          }}
        >
          <ListboxButton
            className="w-full rounded-lg bg-b2 p-2 flex justify-between items-center hover:shadow-lg
              transition font-mono"
          >
            {separatorOptions.find((option) => option.value === separator)
              ?.label ?? 'Custom'}
            <TbChevronDown className="size-4 text-p1" />
          </ListboxButton>
          <ListboxOptions
            transition
            anchor="bottom"
            className="w-[var(--button-width)] bg-b2 rounded-lg mt-2 flex flex-col origin-top
              transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            {separatorOptions.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className="data-[focus]:bg-p1/10 w-full bg-b2 flex flex-row p-2 cursor-pointer items-center
                  gap-2"
              >
                {({ selected }) => (
                  <>
                    {selected ? <TbCheck className="size-4 text-p1" /> : null}
                    <span className="font-mono">{option.label}</span>
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      </Field>
      {separator !== 'lineBreak' &&
      separator !== 'downArrow' &&
      separator !== 'squareBracket' ? (
        <input
          placeholder="Enter custom separator"
          type="text"
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
          spellCheck="false"
          className={`w-full mt-2 rounded-lg bg-b2 p-2 ${separator === '' ? 'border border-p1' : ''}`}
          value={separator}
          maxLength={3}
          onChange={(e) => {
            setSeparator(e.target.value as Separator)
            updateSeparator(e.target.value as Separator)
          }}
        />
      ) : null}
    </>
  )
}
