import { Form } from "@remix-run/react";
import { SkipForward } from "lucide-react";

const questions = [
  "List supplements that contain ingredient Zinc",
  "List supplements that help with Hair Growth",
  "List some supplements",
];

export default function PresetQuestions() {
  return (
    <div className="flex flex-col space-y-2 mt-5">
      {questions.map((question, index) => (
        <Form
          method="post"
          className="w-full px-20 flex items-center justify-center"
          key={index}
        >
          <button
            type="submit"
            value={question}
            name="question"
            className="inline-flex space-x-1 w-full hover:underline font-medium"
          >
            <SkipForward className="size-5 stroke-green-800 dark:stroke-green-600" />
            <span>{question}</span>
          </button>
        </Form>
      ))}
    </div>
  );
}
