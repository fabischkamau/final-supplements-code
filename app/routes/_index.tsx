import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect, useLoaderData, useNavigation } from "@remix-run/react";
import ChatInput from "~/components/chatinput";
import LoadingSkeleton from "~/components/loading-skeleton";
import PresetQuestions from "~/components/preset-questions";
import HistorySheet from "~/components/sheet";
import { call } from "~/genai/index.server";
import HomeLayout from "~/layout";
import { getSession } from "~/utils/authsession.server";
import {
  createSession,
  getHistoryMessages,
  getUser,
} from "~/utils/history.server";

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
  const question = formData.get("question");
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("userId");
  const sessionId = await createSession(email);

  if (typeof question !== "string") {
    return json({ error: "Invalid question" }, { status: 401 });
  }
  return await call(question, sessionId)
    .then((answer) => {
      return redirect(`/chat/${sessionId}`);
    })
    .catch((error) => {
      return json({ error: error }, { status: 401 });
    });
}
export const meta: MetaFunction = () => {
  return [
    { title: "HubbleShop" },
    { name: "description", content: "Discover Supplements Smartly!" },
  ];
};
export default function Index() {
  const navigation = useNavigation();
  const loaderData = useLoaderData<typeof loader>();
  const isSubmitting = navigation.state === "submitting";
  const question = navigation.formData?.get("question");

  return (
    <HomeLayout
      userId={loaderData.userId}
      user={{
        name: loaderData.user?.name as string,
        avatarUrl: loaderData.user?.avatar as string,
      }}
      messageHistory={loaderData.messageHistory}
    >
      <div className="mt-5 px-10 md:px-40"></div>
      {isSubmitting ? (
        <section className="w-full px-10 md:px-40">
          <LoadingSkeleton title={question as string} />
        </section>
      ) : (
        <section id="hero" className="w-full px-10 md:px-40 mt-20 ">
          <div className="w-full flex flex-col justify-center space-y-4">
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
                Discover Supplements Smartly!
              </h1>
            </div>
            <div>
              <ChatInput />
              <PresetQuestions />
            </div>
          </div>
        </section>
      )}
    </HomeLayout>
  );
}
