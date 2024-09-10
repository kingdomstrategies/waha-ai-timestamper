'use client'
import Link from 'next/link'
import { SnackbarProvider } from 'notistack'
import { useState } from 'react'
import { TbHelp, TbRefresh } from 'react-icons/tb'
import { colors } from '../styles/colors'
import HelpModal from './HelpModal'

export default function Header() {
  const [showModal, setShowModal] = useState(false)

  return (
    <header className="w-full flex py-3 justify-center items-center bg-b2 shadow-md mb-4 px-4">
      <div className="max-w-6xl flex flex-row w-full gap-4">
        <svg
          width={24}
          viewBox="0 0 55 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M44.035 37.969C43.7499 38.5002 42.3241 41.2659 42.0077 41.8635C44.2655 43.7815 46.0975 47.0002 45.078 49.6174C40.8475 58.2072 23.535 52.3049 18.121 46.9221C12.3241 41.7307 15.1444 35.4921 22.1952 35.1371C22.328 34.4574 22.9062 31.3754 23.0429 30.7504C13.8124 29.9418 6.76987 32.5395 4.99987 37.6762C2.72647 46.309 12.5858 54.5982 25.0899 59.1842C33.6172 62.0826 44.7969 63.2701 51.4379 58.3561C58.2777 52.3639 53.2504 44.0941 44.0395 37.9691L44.035 37.969Z"
            fill={colors.p1}
          />
          <path
            d="M39.195 65.613C25.496 65.9372 6.441 56.9372 1.867 45.582C-5.465 60.387 24.367 74.34 39.726 71.574C46.1205 70.5779 49.5971 67.949 50.765 63.3084C47.3197 64.9139 43.722 65.5779 39.195 65.6092V65.613Z"
            fill={colors.p1}
          />
          <path
            d="M26.031 39.246C28.8826 41.7226 32.6443 42.996 36.422 42.828C36.836 42.828 37.2189 42.5897 37.4064 42.2382C38.3595 40.3788 39.672 37.8398 40.633 35.9804C41.7307 33.8554 49.8088 18.2034 51.102 15.6954C55.4379 7.63676 47.3637 -2.08964 38.586 0.761361C34.7891 1.88246 31.9532 5.01136 31.2071 8.90586L27.6837 27.4219C27.0587 30.7657 26.2618 34.8399 25.6368 38.1639C25.5391 38.5779 25.7146 38.9999 26.031 39.246Z"
            fill={colors.p1}
          />
        </svg>
        <h1 className="text-p1 text-2xl font-bold flex-1">Timestamp Audio</h1>
        <Link
          href={'/'}
          className="btn px-3 py-1 text-sm"
          onClick={() => {
            location.reload()
          }}
        >
          <TbRefresh className="size-4 text-p1" />
          Restart
        </Link>
        <button
          className="btn px-3 py-1 text-sm"
          onClick={() => setShowModal(true)}
        >
          <TbHelp className="size-4 text-p1" />
          Help
        </button>
      </div>
      <HelpModal open={showModal} setOpen={setShowModal} />
      <SnackbarProvider autoHideDuration={3000} />
    </header>
  )
}
