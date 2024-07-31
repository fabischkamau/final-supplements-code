import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { BotMessage } from "./messages";

export default function Accordion({
  title,
  content,
  open,
}: {
  title: string;
  content: string;
  open?: boolean;
}) {
  const [accordion, setAccordion] = useState<boolean>(open || false);
  return (
    <div className="p-4 rounded-md  w-full  d  dark:bg-black ">
      <button
        className="flex justify-between w-full font-semibold"
        onClick={() => setAccordion(!accordion)}
      >
        <span>{title}</span>
        <span className="ml-auto rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-900">
          {accordion ? <ChevronUp /> : <ChevronDown />}
        </span>
      </button>
      <div
        className={`grid transition-all overflow-hidden duration-300 ease-in-out text-sm ${
          accordion
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="py-4">
            <BotMessage content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
