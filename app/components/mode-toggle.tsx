import { useFetcher } from "@remix-run/react";
import { Moon, Palette, Sun } from "lucide-react";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";

export default function ModeToggle() {
  const fetcher = useFetcher();

  return (
    <Menu>
      <MenuButton>
        <Palette className="ize-5" />
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        className="w-28  mt-5 origin-top-right rounded-xl border border-slate-200 bg-white dark:bg-black/5 shadow-lg text-sm/6  transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <fetcher.Form
          method="post"
          action="/action/theme"
          className="p-2 w-full hover:bg-gray-50 dark:hover:bg-slate-700"
        >
          <button
            type="submit"
            className="inline-flex w-full"
            aria-label="light"
            name="theme"
            value="light"
          >
            <Sun className="mr-1 size-5" />
            Light
          </button>
        </fetcher.Form>

        <fetcher.Form
          method="post"
          action="/action/theme"
          className="p-2 w-full hover:bg-gray-50 dark:hover:bg-slate-700"
        >
          <button
            type="submit"
            className="inline-flex w-full"
            aria-label="dark"
            name="theme"
            value="dark"
          >
            <Moon className="mr-1 size-5" />
            Dark
          </button>
        </fetcher.Form>
      </MenuItems>
    </Menu>
  );
}
