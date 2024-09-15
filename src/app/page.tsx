'use client'
import Link from 'next/link'
import { Suspense } from 'react'
import 'react-activity/dist/library.css'
import { TbArrowRight } from 'react-icons/tb'
import 'react-tooltip/dist/react-tooltip.css'
import Footer from '../components/Footer'
import HowItWorks from '../components/HowItWorks'
import UseCases from '../components/UseCases'

export default function Page() {
  return (
    <Suspense>
      <div
        className="flex flex-col w-full items-center justify-center bg-[url('../assets/bg.png')]
          bg-no-repeat bg-cover bg-f1 bg-opacity-80 bg-blend-darken h-svh"
      >
        <div className="flex flex-col items-center gap-4 max-w-4xl px-4">
          <h1 className="text-4xl font-bold text-center text-op">
            Save 100+ Hours with Automated Timestamp Data for Your Audio Files
          </h1>
          <h4 className="text-xl text-center text-op mb-4">
            Generate precise timestamps in over{' '}
            <span className="font-bold">1,100 languages</span>—turning months of
            manual work into minutes and simplifying your audio workflow for
            Bible studies, podcasts, and media.
          </h4>
          <Link href="/#use-cases" className="btn-primary">
            Learn more
            <TbArrowRight />
          </Link>
          <p className="text-op text-sm text-center">
            200,000+ files timestamped saving 19,000+ hours
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center w-full bg-b1 justify-center py-12">
        <div className="flex flex-col items-center gap-4 max-w-4xl px-4">
          <h1 className="text-4xl font-bold text-center mb-2">
            How does it work?
          </h1>
          <h3 className="text-2xl text-center mb-8 text-op"></h3>
          <HowItWorks />
          <Link id="use-cases" href="/timestamp" className="btn">
            Try it out
            <TbArrowRight />
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center w-full bg-p1 justify-center py-12">
        <div className="flex flex-col items-center gap-4 max-w-4xl px-4">
          <h1 className="text-4xl font-bold text-center mb-2 text-op">
            What can you do with timestamp data?
          </h1>
          <h1 className="text-2xl text-center mb-8 text-op"></h1>
          <UseCases />
          <Link href="/timestamp" className="btn text-op border-op mt-8">
            Try it out
            <TbArrowRight />
          </Link>
        </div>
      </div>
      <Footer />
    </Suspense>
  )
}
