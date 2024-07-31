import { Form, Link } from "@remix-run/react";
import logo from "./assets/logo.png";
import ModeToggle from "./mode-toggle";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

type User = {
  name: string;
  avatarUrl: string;
};

export default function Header({ user }: { user?: User }) {
  return (
    <header className="flex sticky top-0 justify-between items-center p-3 w-full z-20 bg-white/80 backdrop-blur-md dark:bg-black/80 dark:backdrop-blur-md">
      <div>
        <Link to="/">
          <img src={logo} alt="hubbleshop" className="h-10" />
        </Link>
      </div>
      <div className="flex items-center space-x-3">
        <ModeToggle />
        {user?.name ? (
          <Popover>
            <PopoverButton className="block text-sm/6 font-semibold  focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
              <img
                src={user?.avatarUrl}
                alt={user?.name}
                className="h-8 w-8 rounded-full"
              />
            </PopoverButton>
            <PopoverPanel
              transition
              anchor="bottom"
              className="divide-y w-40 divide-white/5 rounded-xl bg-white/80 shadow dark:bg-black/80 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
            >
              <div className="p-3">
                <div className="block rounded-lg py-2 px-3 transition hover:bg-white/5">
                  <p className="font-semibold ">Welcome</p>
                  <p className="">{user?.name}</p>
                </div>
              </div>
              <Form method="post" action="/logout" className="p-3">
                <button className="inline-flex border space-x-3 w-full p-2 items-center bg-gray-800 dark:bg-white dark:text-black text-white justify-center rounded-md hover:bg-gray-900 dark:hover-bg-gray-800">
                  Logout
                </button>
              </Form>
            </PopoverPanel>
          </Popover>
        ) : (
          <Link
            to="/login"
            className="px-2 py-1 text-sm bg-gray-800 text-gray-200 hover:bg-gray-900 dark:bg-black rounded-md dark:ring-1 dark:ring-gray-100"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
