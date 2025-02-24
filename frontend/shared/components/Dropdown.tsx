import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface DropdownProps {
  menuTitle: string;
  menuIcon: JSX.Element;
  menuItemTitles: string[];
  menuItemFunctions: (() => void)[];
}

export default function Dropdown({
  menuTitle,
  menuIcon,
  menuItemTitles,
  menuItemFunctions,
}: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
          {menuTitle}
          {menuIcon}
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          {menuItemTitles.map((title: string, index: number) => (
            <MenuItem key={index}>
              <button
                onClick={menuItemFunctions[index]}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
              >
                {title}
              </button>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
}
