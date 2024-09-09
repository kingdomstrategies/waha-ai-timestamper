'use client'
import { Dispatch, SetStateAction } from 'react'
import { TbCheck, TbExclamationCircle } from 'react-icons/tb'
import { Tooltip } from 'react-tooltip'
import { MmsLanguage } from '../hooks/useLanguage'

interface Props {
  selectedLanguage: MmsLanguage | null | undefined
  languages: MmsLanguage[]
  query: string
  setQuery: Dispatch<SetStateAction<string>>
}

export default function LanguageSelector({
  selectedLanguage,
  query,
  setQuery,
  languages,
}: Props) {
  return (
    <div className="w-full flex flex-col mb-6">
      <h2 className="text-sm mb-2">
        <span className="font-bold">Step 1:</span> Select Language
      </h2>
      <div className="flex flex-row w-full items-center gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="text"
          name="myFruit"
          id="myFruit"
          list="languages"
          className={`w-full p-4 rounded-lg shadow-md border
            ${selectedLanguage === null ? 'border-p1' : 'border-b2'}`}
          placeholder="Select from 1000+ languages"
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
        {selectedLanguage === null ? (
          <TbExclamationCircle
            data-tooltip-id="no-language"
            data-tooltip-content="Select a language"
            className="size-8 text-p1"
          />
        ) : selectedLanguage !== undefined ? (
          <TbCheck
            data-tooltip-id="valid-language"
            data-tooltip-content="Valid language selected"
            className="size-8 text-p1"
          />
        ) : null}
      </div>
      <datalist id="languages">
        {languages.map((language) => (
          <option
            key={language.iso}
            value={language.name}
            label={language.iso}
          />
        ))}
      </datalist>
      <Tooltip id="valid-language" />
      <Tooltip id="no-language" />
    </div>
  )
}
