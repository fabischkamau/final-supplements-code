import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import "./tailwind.css";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getThemeSession } from "./utils/themesession.server";
import { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SpeedInsights } from '@vercel/speed-insights/remix';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getThemeSession(request.headers.get("Cookie"));
  const theme = session.get("theme");

  return {
    theme: theme,
    clientId: process.env.GOOGLE_AUTH_CLIENT_ID || "",
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>();
  useEffect(() => {
    if (
      typeof loaderData.theme !== "string" ||
      (loaderData.theme === "dark" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [loaderData]);
  return (
    <GoogleOAuthProvider clientId={loaderData.clientId}>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body className=" relative antialiased  text-gray-800 dark:text-gray-200 bg-[#fefefd] dark:bg-black h-dvh md:h-lvh w-full overflow-x-hidden">
          {children}
          <SpeedInsights />
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </GoogleOAuthProvider>
  );
}

export default function App() {
  return <Outlet />;
}
