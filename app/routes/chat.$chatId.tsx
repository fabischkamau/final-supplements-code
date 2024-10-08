import HomeLayout from "~/layout";
import { questionsAndAnswers } from "~/components/qa";
import Accordion from "~/components/ui/Accordion";
import ChatInput from "~/components/chatinput";
import HistorySheet from "~/components/sheet";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import LoadingSkeleton from "~/components/loading-skeleton";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { call } from "~/genai/index.server";
import { initGraph } from "~/genai/graph.server";
import {
  chatMessages,
  getHistoryMessages,
  getUser,
} from "~/utils/history.server";
import { getSession } from "~/utils/authsession.server";
import { useEffect, useState } from "react";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const sessionId = params.chatId;
  if (typeof sessionId !== "string") {
    return redirect("/");
  }
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
  const chatmesssages = await chatMessages(sessionId);
  return { chatmesssages, userId, user, messageHistory };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const question = formData.get("question");

  const sessionId = params.chatId;
  if (typeof sessionId !== "string") {
    return redirect("/");
  }

  if (typeof question !== "string") {
    return json({ error: "Invalid question" });
  }

  let answer = null;
  try {
    answer = await call(question, sessionId);
  } catch (error) {
    return json({ error: error });
  }
  return {
    airesponse: {
      question: question,
      message: answer.generation,
    },
  };
}

export const meta: MetaFunction = () => {
  return [
    { title: "HubbleShop" },
    { name: "description", content: "The Ultimate Supplement Guide!" },
  ];
};
export default function chat() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [chatmesssages, setChatmesssages] = useState<any>(
    loaderData.chatmesssages.map((message: any) => ({
      input: message.input,
      output: message.output,
    }))
  );
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const question = navigation.formData?.get("question");
  useEffect(() => {
    if (actionData?.airesponse) {
      console.log("actionData", actionData);
      setChatmesssages((prev) => [
        ...prev,
        {
          input: actionData.airesponse.question,
          output: actionData.airesponse.message,
        },
      ]);
    }
  }, [actionData]);
  return (
    <HomeLayout
      userId={loaderData.userId}
      user={{
        name: loaderData.user?.name as string,
        avatarUrl: loaderData.user?.avatar as string,
      }}
      messageHistory={loaderData.messageHistory}
    >
      <div className="w-full px-5 md:px-40">
        <section id="messages" className="w-full">
          {chatmesssages?.map((message: any, index: any) => (
            <Accordion
              title={message?.input}
              content={message?.output}
              key={index}
              open={index === chatmesssages?.length - 1}
            />
          ))}
          {isSubmitting ? <LoadingSkeleton title={question as string} /> : null}
        </section>

        <div className="py-10">
          <ChatInput />
        </div>
      </div>
    </HomeLayout>
  );
}
