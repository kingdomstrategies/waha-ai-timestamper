'use client'
import { Dispatch, SetStateAction } from 'react'
import { Sentry } from 'react-activity'
import { TbExclamationCircle, TbSparkles } from 'react-icons/tb'
import { Tooltip } from 'react-tooltip'
import { LidStatus, MmsLanguage } from '../hooks/useLanguage'
import { colors } from '../styles/colors'

interface Props {
  selectedLanguage: MmsLanguage | null | undefined
  setSelectedLanguage: Dispatch<SetStateAction<MmsLanguage | null | undefined>>
  languages: MmsLanguage[]
  query: string
  setQuery: Dispatch<SetStateAction<string>>
  lidStatus: LidStatus
  setLidStatus: Dispatch<SetStateAction<LidStatus>>
}

export default function LanguageSelector({
  selectedLanguage,
  setSelectedLanguage,
  query,
  setQuery,
  languages,
  lidStatus,
  setLidStatus,
}: Props) {
  return (
    <div className="w-full flex flex-col mt-4">
      <h2 className="form-label">Language</h2>
      <div className="flex flex-row w-full items-center gap-2">
        {lidStatus === 'inProgress' ? (
          <div className="flex flex-row form items-center gap-2 border-p1 bg-p1/10 hover:shadow-sm">
            <Sentry color={colors.p1} size={12} animating />
            <span className="text-p1">
              Using AI to determine the language of your uploaded files...
            </span>
          </div>
        ) : (
          <>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="text"
              name="myFruit"
              id="myFruit"
              list="languages"
              className={`form border ${selectedLanguage === null ? 'border-p1' : 'border-b2'}`}
              placeholder={'Select from 1000+ languages'}
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
            ) : null}
            {lidStatus === 'done' ? (
              <button
                className="btn py-2 px-2"
                onClick={() => {
                  setQuery('')
                  setSelectedLanguage(null)
                  setLidStatus('notStarted')
                }}
              >
                <TbSparkles
                  data-tooltip-id="redo-lid"
                  data-tooltip-content="Re-identify language"
                  className="size-6 text-p1"
                />
              </button>
            ) : null}
          </>
        )}
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
      <Tooltip id="redo-lid" />
    </div>
  )
}
