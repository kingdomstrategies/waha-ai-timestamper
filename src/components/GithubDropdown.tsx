import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { IoOpenOutline } from 'react-icons/io5'
import { TbBrandGithub } from 'react-icons/tb'

export default function GithubDropdown() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="btn">
          Github
          <TbBrandGithub className="size-6 text-p1 h-full" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-b2 shadow-lg
          transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform
          data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75
          data-[enter]:ease-out data-[leave]:ease-in pb-2"
      >
        {/* <h3 className="ml-4 font-bold mt-4 mb-1">View on Github</h3> */}
        <div className="py-1 flex flex-col px-4 gap-1">
          <MenuItem>
            <a
              href="https://github.com/kingdomstrategies/waha-ai-timestamper"
              className="hover:bg-p1/10 transition w-full rounded-lg px-2 flex items-center
                justify-between py-2"
            >
              Frontend
              <IoOpenOutline />
            </a>
          </MenuItem>
          <MenuItem>
            <a
              href="https://github.com/kingdomstrategies/waha-ai-timestamper-backend"
              className="hover:bg-p1/10 transition w-full rounded-lg px-2 flex items-center
                justify-between py-2"
            >
              Backend
              <IoOpenOutline />
            </a>
          </MenuItem>
          <MenuItem>
            <a
              href="https://github.com/kingdomstrategies/waha-ai-timestamper-cli"
              className="hover:bg-p1/10 transition w-full rounded-lg px-2 flex items-center
                justify-between py-2"
            >
              Command Line Interface
              <IoOpenOutline />
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  )
}
