'use client'
import { Suspense } from 'react'
import 'react-activity/dist/library.css'
import 'react-tooltip/dist/react-tooltip.css'
import Home from '../../components/Home'

export default function Page() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  )
}
