import { json, redirect, useFetcher } from "@remix-run/react";
import HomeLayout from "~/layout";
import goolgeIcon from "~/components/assets/logo-google-svgrepo-com.svg";
import googleIconwhite from "~/components/assets/logo-google-svgrepo-com (1).svg";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { commitSession, getSession } from "~/utils/authsession.server";
import {
  createUser,
  getHistoryMessages,
  getUser,
} from "~/utils/history.server";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  let user = null;
  if (userId) {
    user = await getUser(userId);
  }
  let messageHistory = null;
  if (userId) {
    messageHistory = await getHistoryMessages(userId);
  }
  return json({
    userId,
    user,
    messageHistory,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { email, name, avatar } = Object.fromEntries(formData);
  const session = await getSession(request.headers.get("Cookie"));

  if (typeof email !== "string" || email.length === 0) {
    return json({ error: "Email is required" }, { status: 400 });
  }
  if (typeof name !== "string" || name.length === 0) {
    return json({ error: "Name is required" }, { status: 400 });
  }

  return await createUser(email, name, avatar as string)
    .then(async (email) => {
      session.set("userId", email);
      return redirect("/", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    })
    .catch((error) => {
      return json({ error: error.message }, { status: 500 });
    });
}

export default function login() {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const [error, setError] = useState<boolean>(false);
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",

          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const formData = new FormData();
        formData.append("name", res.data.name);
        formData.append("email", res.data.email);
        formData.append("avatar", res.data.picture);

        fetcher.submit(formData, { method: "POST" });
      } catch (error) {
        setError(true);
      }
    },
  });
  return (
    <HomeLayout>
      <section className="mt-36 flex flex-col w-full justify-center items-center">
        <div className="bg-white border border-gray-200 rounded-md shadow-md dark:bg-black dark:border dark:border-100 p-4 w-full max-w-md ">
          <div className="space-y-2">
            <h1 className="text-lg font-semibold ">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              Sign in to your account
            </p>
          </div>
          <div className="p-10">
            <button
              onClick={() => login()}
              className="inline-flex border space-x-3 w-full p-2 items-center bg-gray-800 dark:bg-white dark:text-black text-white justify-center rounded-md hover:bg-gray-900 dark:hover-bg-gray-800"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                  please wait!
                </div>
              ) : (
                <div className="flex space-x-3 w-full items-center">
                  <img
                    src={goolgeIcon}
                    alt="google"
                    className="h-6 hidden dark:flex"
                  />
                  <img
                    src={googleIconwhite}
                    alt="google"
                    className="h-6 flex dark:hiiden"
                  />
                  <span>Sign In with Google</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
