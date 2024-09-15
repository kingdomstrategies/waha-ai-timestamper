'use client'
import FileSaver from 'file-saver'
import { getBlob, ref } from 'firebase/storage'
import JSZip from 'jszip'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { SnackbarProvider } from 'notistack'
import { useState } from 'react'
import { Windmill } from 'react-activity'
import { TbArrowRight, TbDownload } from 'react-icons/tb'
import { fbStorage } from '../firebase'
import { colors } from '../styles/colors'
import GithubDropdown from './GithubDropdown'
import HelpModal from './HelpModal'

function download(dataurl: string, filename: string) {
  const link = document.createElement('a')
  link.href = dataurl
  link.download = filename
  link.click()
}

export default function Header() {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [isDownloading, setIsDownloading] = useState(false)

  return (
    <div
      className="w-full flex py-1 justify-center items-center px-4 bg-b2 shadow-md sticky top-0
        z-10"
    >
      <div className="max-w-4xl flex flex-row w-full gap-2 items-center justify-center relative">
        {/* <svg
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
        </svg> */}
        <div
          className="flex flex-1 transition py-2 px-4 cursor-pointer flex-col"
          onClick={() => {
            router.push('/')
          }}
        >
          <svg
            width={120}
            viewBox="0 0 756 272"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="109.5"
              cy="165.5"
              r="97.5"
              stroke="black"
              stroke-width="18"
            />
            <circle
              cx="109.5"
              cy="29.5"
              r="25.5"
              stroke="black"
              stroke-width="8"
            />
            <rect x="95" y="23" width="30" height="44" rx="5" fill="black" />
            <rect
              x="1.09875"
              y="81.4199"
              width="36"
              height="23.6309"
              rx="5"
              transform="rotate(-45.5492 1.09875 81.4199)"
              fill="black"
            />
            <rect
              x="29"
              y="145.452"
              width="7.77916"
              height="38.1179"
              rx="3.88958"
              fill="black"
            />
            <rect
              x="183.027"
              y="145.452"
              width="7.77916"
              height="38.1179"
              rx="3.88958"
              fill="black"
            />
            <rect
              x="46.1141"
              y="134.561"
              width="7.77916"
              height="60.6775"
              rx="3.88958"
              fill="black"
            />
            <rect
              x="165.913"
              y="134.561"
              width="7.77916"
              height="60.6775"
              rx="3.88958"
              fill="black"
            />
            <rect
              x="63.2283"
              y="119.002"
              width="7.77916"
              height="91.0162"
              rx="3.88958"
              fill="black"
            />
            <rect
              x="80.3425"
              y="147.008"
              width="7.77916"
              height="35.0062"
              rx="3.88958"
              fill="black"
            />
            <rect
              x="148.799"
              y="145.452"
              width="7.77916"
              height="38.8958"
              rx="3.88958"
              fill="black"
            />
            <rect
              x="97.4565"
              y="135.339"
              width="7.77916"
              height="59.1216"
              rx="3.88958"
              fill="#E42535"
            />
            <rect
              x="114.571"
              y="105"
              width="7.77916"
              height="119.799"
              rx="3.88958"
              fill="#E42535"
            />
            <rect
              x="131.685"
              y="119.002"
              width="7.77916"
              height="91.0162"
              rx="3.88958"
              fill="#E42535"
            />
            <rect
              x="23.6588"
              y="92.1541"
              width="20"
              height="8.86177"
              transform="rotate(-45.55 23.6588 92.1541)"
              fill="black"
            />
            <path
              d="M269.36 59.75H251.99V48.95H298.79V59.75H281.69V116H269.36V59.75ZM305.269 67.04H317.059V116H305.269V67.04ZM304.369 53.54C304.369 51.38 304.969 49.7 306.169 48.5C307.369 47.3 309.019 46.7 311.119 46.7C313.279 46.7 314.959 47.3 316.159 48.5C317.359 49.7 317.959 51.38 317.959 53.54C317.959 55.64 317.359 57.29 316.159 58.49C315.019 59.69 313.339 60.29 311.119 60.29C309.019 60.29 307.369 59.69 306.169 58.49C304.969 57.29 304.369 55.64 304.369 53.54ZM327.945 67.04H339.015V73.16C340.275 70.82 342.075 69.05 344.415 67.85C346.815 66.59 349.575 65.96 352.695 65.96C355.935 65.96 358.905 66.68 361.605 68.12C364.305 69.5 366.375 71.42 367.815 73.88C369.435 71.24 371.535 69.26 374.115 67.94C376.755 66.62 379.725 65.96 383.025 65.96C386.445 65.96 389.535 66.74 392.295 68.3C395.055 69.86 397.215 72.05 398.775 74.87C400.335 77.69 401.115 80.9 401.115 84.5V116H389.325V87.29C389.325 84.05 388.455 81.5 386.715 79.64C385.035 77.72 382.755 76.76 379.875 76.76C377.055 76.76 374.775 77.72 373.035 79.64C371.295 81.56 370.425 84.11 370.425 87.29V116H358.635V87.29C358.635 84.05 357.765 81.5 356.025 79.64C354.345 77.72 352.065 76.76 349.185 76.76C346.365 76.76 344.085 77.72 342.345 79.64C340.605 81.56 339.735 84.11 339.735 87.29V116H327.945V67.04ZM434.31 117.08C429.39 117.08 425.01 115.94 421.17 113.66C417.39 111.38 414.42 108.29 412.26 104.39C410.16 100.49 409.11 96.17 409.11 91.43C409.11 86.63 410.16 82.31 412.26 78.47C414.42 74.57 417.33 71.51 420.99 69.29C424.71 67.07 428.85 65.96 433.41 65.96C438.33 65.96 442.59 67.04 446.19 69.2C449.79 71.3 452.52 74.18 454.38 77.84C456.3 81.5 457.26 85.52 457.26 89.9C457.26 91.94 457.05 93.59 456.63 94.85H421.35C421.71 98.45 423.09 101.33 425.49 103.49C427.89 105.65 430.86 106.73 434.4 106.73C437.04 106.73 439.29 106.19 441.15 105.11C443.07 103.97 444.6 102.41 445.74 100.43L455.28 105.11C453.78 108.71 451.14 111.62 447.36 113.84C443.58 116 439.23 117.08 434.31 117.08ZM444.66 85.85C444.36 82.85 443.19 80.42 441.15 78.56C439.11 76.64 436.53 75.68 433.41 75.68C430.41 75.68 427.86 76.58 425.76 78.38C423.66 80.12 422.28 82.61 421.62 85.85H444.66ZM484.557 116.99C479.637 116.99 475.287 115.82 471.507 113.48C467.787 111.14 465.147 107.93 463.587 103.85L472.317 99.35C473.637 101.99 475.377 104.06 477.537 105.56C479.757 107 482.187 107.72 484.827 107.72C487.107 107.72 488.877 107.27 490.137 106.37C491.457 105.41 492.117 104.12 492.117 102.5C492.117 101.12 491.577 99.98 490.497 99.08C489.417 98.12 488.007 97.49 486.267 97.19L478.257 95.84C474.117 94.76 470.907 92.93 468.627 90.35C466.407 87.71 465.297 84.62 465.297 81.08C465.297 78.14 466.077 75.53 467.637 73.25C469.197 70.91 471.357 69.11 474.117 67.85C476.937 66.59 480.117 65.96 483.657 65.96C488.157 65.96 492.117 67.04 495.537 69.2C498.957 71.3 501.447 74.24 503.007 78.02L494.277 82.52C493.317 80.42 491.847 78.74 489.867 77.48C487.887 76.22 485.697 75.59 483.297 75.59C481.317 75.59 479.727 76.04 478.527 76.94C477.387 77.84 476.817 79.01 476.817 80.45C476.817 83.09 478.797 84.86 482.757 85.76L490.587 87.2C494.727 88.34 497.937 90.2 500.217 92.78C502.497 95.36 503.637 98.42 503.637 101.96C503.637 104.9 502.827 107.51 501.207 109.79C499.647 112.07 497.427 113.84 494.547 115.1C491.667 116.36 488.337 116.99 484.557 116.99ZM534.748 116.54C529.228 116.54 524.938 115.04 521.878 112.04C518.878 108.98 517.378 104.69 517.378 99.17V77.57H508.918V67.04H509.818C512.218 67.04 514.078 66.41 515.398 65.15C516.718 63.89 517.378 62.06 517.378 59.66V55.88H529.168V67.04H540.418V77.57H529.168V98.54C529.168 103.64 531.928 106.19 537.448 106.19C538.408 106.19 539.458 106.1 540.598 105.92V116.09C538.678 116.39 536.728 116.54 534.748 116.54ZM564.192 117.08C559.032 117.08 554.922 115.82 551.862 113.3C548.862 110.78 547.362 107.36 547.362 103.04C547.362 98.9 548.772 95.48 551.592 92.78C554.412 90.08 558.642 88.28 564.282 87.38L578.862 85.04V83.42C578.862 81.26 578.022 79.49 576.342 78.11C574.722 76.73 572.562 76.04 569.862 76.04C567.342 76.04 565.092 76.73 563.112 78.11C561.192 79.43 559.782 81.2 558.882 83.42L549.252 78.74C550.692 74.9 553.332 71.81 557.172 69.47C561.012 67.13 565.392 65.96 570.312 65.96C574.272 65.96 577.782 66.71 580.842 68.21C583.962 69.65 586.362 71.72 588.042 74.42C589.782 77.06 590.652 80.06 590.652 83.42V116H579.492V110.78C575.652 114.98 570.552 117.08 564.192 117.08ZM559.602 102.59C559.602 104.27 560.232 105.62 561.492 106.64C562.752 107.6 564.372 108.08 566.352 108.08C570.012 108.08 573.012 106.94 575.352 104.66C577.692 102.32 578.862 99.44 578.862 96.02V94.04L566.532 96.11C564.192 96.59 562.452 97.37 561.312 98.45C560.172 99.47 559.602 100.85 559.602 102.59ZM601.549 67.04H612.619V73.16C613.879 70.82 615.679 69.05 618.019 67.85C620.419 66.59 623.179 65.96 626.299 65.96C629.539 65.96 632.509 66.68 635.209 68.12C637.909 69.5 639.979 71.42 641.419 73.88C643.039 71.24 645.139 69.26 647.719 67.94C650.359 66.62 653.329 65.96 656.629 65.96C660.049 65.96 663.139 66.74 665.899 68.3C668.659 69.86 670.819 72.05 672.379 74.87C673.939 77.69 674.719 80.9 674.719 84.5V116H662.929V87.29C662.929 84.05 662.059 81.5 660.319 79.64C658.639 77.72 656.359 76.76 653.479 76.76C650.659 76.76 648.379 77.72 646.639 79.64C644.899 81.56 644.029 84.11 644.029 87.29V116H632.239V87.29C632.239 84.05 631.369 81.5 629.629 79.64C627.949 77.72 625.669 76.76 622.789 76.76C619.969 76.76 617.689 77.72 615.949 79.64C614.209 81.56 613.339 84.11 613.339 87.29V116H601.549V67.04ZM684.693 67.04H695.763V72.8C697.563 70.64 699.783 68.96 702.423 67.76C705.123 66.56 708.153 65.96 711.513 65.96C716.073 65.96 720.243 67.1 724.023 69.38C727.803 71.6 730.773 74.66 732.933 78.56C735.093 82.46 736.173 86.78 736.173 91.52C736.173 96.26 735.093 100.58 732.933 104.48C730.773 108.38 727.803 111.47 724.023 113.75C720.303 115.97 716.103 117.08 711.423 117.08C708.423 117.08 705.633 116.6 703.053 115.64C700.473 114.62 698.283 113.18 696.483 111.32V134H684.693V67.04ZM696.483 91.52C696.483 94.34 697.053 96.89 698.193 99.17C699.393 101.39 701.013 103.13 703.053 104.39C705.153 105.65 707.493 106.28 710.073 106.28C714.093 106.28 717.393 104.9 719.973 102.14C722.613 99.32 723.933 95.78 723.933 91.52C723.933 88.76 723.333 86.27 722.133 84.05C720.933 81.77 719.283 80 717.183 78.74C715.083 77.42 712.713 76.76 710.073 76.76C707.493 76.76 705.153 77.39 703.053 78.65C701.013 79.91 699.393 81.68 698.193 83.96C697.053 86.18 696.483 88.7 696.483 91.52ZM275.12 161.95H290.96L314.09 229H300.77L296 214.6H270.08L265.22 229H251.99L275.12 161.95ZM292.49 203.8L283.04 175.54L273.59 203.8H292.49ZM337.143 230.08C331.443 230.08 326.943 228.25 323.643 224.59C320.343 220.93 318.693 216.07 318.693 210.01V180.04H330.483V209.02C330.483 212.08 331.383 214.57 333.183 216.49C335.043 218.35 337.443 219.28 340.383 219.28C343.323 219.28 345.693 218.32 347.493 216.4C349.353 214.48 350.283 211.93 350.283 208.75V180.04H362.073V229H350.913V223.15C349.593 225.43 347.733 227.17 345.333 228.37C342.993 229.51 340.263 230.08 337.143 230.08ZM395.803 230.08C391.123 230.08 386.893 228.97 383.113 226.75C379.393 224.47 376.453 221.38 374.293 217.48C372.133 213.58 371.053 209.26 371.053 204.52C371.053 199.78 372.133 195.46 374.293 191.56C376.453 187.66 379.423 184.6 383.203 182.38C386.983 180.1 391.153 178.96 395.713 178.96C398.833 178.96 401.683 179.5 404.263 180.58C406.843 181.6 409.003 183.07 410.743 184.99V160.87H422.533V229H411.373V223.6C409.573 225.7 407.323 227.32 404.623 228.46C401.923 229.54 398.983 230.08 395.803 230.08ZM383.293 204.52C383.293 207.34 383.863 209.89 385.003 212.17C386.203 214.39 387.853 216.13 389.953 217.39C392.053 218.65 394.423 219.28 397.063 219.28C399.703 219.28 402.043 218.65 404.083 217.39C406.183 216.13 407.803 214.39 408.943 212.17C410.143 209.89 410.743 207.34 410.743 204.52C410.743 201.7 410.143 199.18 408.943 196.96C407.803 194.68 406.183 192.91 404.083 191.65C401.983 190.39 399.643 189.76 397.063 189.76C394.423 189.76 392.053 190.42 389.953 191.74C387.853 193 386.203 194.77 385.003 197.05C383.863 199.27 383.293 201.76 383.293 204.52ZM433.502 180.04H445.292V229H433.502V180.04ZM432.602 166.54C432.602 164.38 433.202 162.7 434.402 161.5C435.602 160.3 437.252 159.7 439.352 159.7C441.512 159.7 443.192 160.3 444.392 161.5C445.592 162.7 446.192 164.38 446.192 166.54C446.192 168.64 445.592 170.29 444.392 171.49C443.252 172.69 441.572 173.29 439.352 173.29C437.252 173.29 435.602 172.69 434.402 171.49C433.202 170.29 432.602 168.64 432.602 166.54ZM480.118 230.08C475.378 230.08 471.028 228.97 467.068 226.75C463.108 224.53 459.958 221.47 457.618 217.57C455.338 213.67 454.198 209.32 454.198 204.52C454.198 199.72 455.338 195.37 457.618 191.47C459.898 187.57 463.018 184.51 466.978 182.29C470.938 180.07 475.318 178.96 480.118 178.96C484.858 178.96 489.178 180.07 493.078 182.29C497.038 184.51 500.158 187.57 502.438 191.47C504.778 195.37 505.948 199.72 505.948 204.52C505.948 209.38 504.778 213.76 502.438 217.66C500.158 221.56 497.038 224.62 493.078 226.84C489.118 229 484.798 230.08 480.118 230.08ZM466.438 204.52C466.438 208.78 467.698 212.32 470.218 215.14C472.798 217.9 476.098 219.28 480.118 219.28C482.698 219.28 485.008 218.65 487.048 217.39C489.088 216.13 490.678 214.39 491.818 212.17C493.018 209.89 493.618 207.34 493.618 204.52C493.618 201.76 493.018 199.27 491.818 197.05C490.678 194.77 489.088 193 487.048 191.74C485.008 190.42 482.698 189.76 480.118 189.76C477.478 189.76 475.108 190.42 473.008 191.74C470.968 193 469.348 194.74 468.148 196.96C467.008 199.18 466.438 201.7 466.438 204.52Z"
              fill="black"
            />
          </svg>
        </div>
        {/* <h1 className="text-p1 text-xl font-bold flex-1">Timestamp Audio</h1> */}
        <div className="sm:absolute sm:right-4 flex flex-row gap-2">
          <GithubDropdown />
          {pathname === '/' ? (
            <Link href="/timestamp" className="btn btn-primary py-2 px-4">
              Try it out
              <TbArrowRight className="size-6" />
            </Link>
          ) : (
            <button
              className="btn py-2 px-4 text-sm"
              disabled={isDownloading}
              onClick={async () => {
                const testFile1Ref = ref(
                  fbStorage,
                  `test_files/SWA_JHN_001.mp3`
                )
                const testFile2Ref = ref(
                  fbStorage,
                  `test_files/SWA_JHN_001.txt`
                )
                setIsDownloading(true)
                const testFile1Blob = await getBlob(testFile1Ref)
                const testFile2Blob = await getBlob(testFile2Ref)
                const zip = new JSZip()
                zip.file('SWA_JHN_001.mp3', testFile1Blob)
                zip.file('SWA_JHN_001.txt', testFile2Blob)
                zip.generateAsync({ type: 'blob' }).then((content) => {
                  FileSaver.saveAs(content, `test_files.zip`)
                })
                // download(testFile1Url, 'SWA_JHN_001.mp3')
                // download(testFile2Url, 'SWA_JHN_001.txt')
                // FileSaver.saveAs(testFile2Blob, 'SWA_JHN_001.txt')
                setIsDownloading(false)
              }}
            >
              {isDownloading ? <Windmill size={12} color={colors.p1} /> : null}
              Download test files
              <TbDownload className="size-4 text-p1" />
            </button>
          )}
          {/* <button
            className="btn px-3 text-sm"
            onClick={() => setShowModal(true)}
          >
            <TbHelp className="size-6 text-p1" />
          </button> */}
        </div>
      </div>
      <HelpModal open={showModal} setOpen={setShowModal} />
      <SnackbarProvider autoHideDuration={3000} />
    </div>
  )
}
