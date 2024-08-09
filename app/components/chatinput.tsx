import { Form, useNavigation } from "@remix-run/react";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useAutosizeTextArea from "~/hooks/useAtoresize";

export default function ChatInput() {
  const [question, setQuestion] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  useAutosizeTextArea(textAreaRef.current, question);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (isSubmitting) {
      setQuestion("");
    }
  }, [setQuestion, isSubmitting]);
  return (
    <Form method="post" className="w-full md:px-20">
      <div className="relative w-full  ">
        <textarea
          name="question"
          id="question"
          className="rounded-md w-full p-3 bg-gray-100 dark:bg-gray-800 focus:outline-none resize-none border-1 ring-2 ring-gray-400 focus:ring-gray-600 dark:ring-0 dark:focus:ring-2  dark:focus:ring-gray-100 "
          placeholder="Ask your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submitRef.current?.click();
            }
          }}
          rows={1}
          ref={textAreaRef}
          required
        ></textarea>
        <button
          ref={submitRef}
          className="absolute right-3 top-2 hover:bg-gray-300 dark:hover:bg-gray-500 p-2 rounded-lg "
          disabled={isSubmitting}
          type="submit"
          aria-label="Submit"
        >
          <ArrowRight className="size-5" />
        </button>
      </div>
    </Form>
  );
}
