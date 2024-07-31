import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { useState } from "react";
import { X, SkipForward, ChevronRight } from "lucide-react";
import moment from "moment";
import { Link } from "@remix-run/react";
export default function HistorySheet({
  messageHistory,
}: {
  messageHistory: any[];
}) {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(true)}
      >
        <ChevronRight />
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        {/* Full-screen container to center the panel */}
        <Transition show={isOpen}>
          <div className="fixed inset-0 flex w-screen items-center justify-end transition duration-300 delay-150 ease-in data-[closed]:opacity-0 ">
            {/* The actual dialog panel  */}

            <DialogPanel className="max-w-sm space-y-1 bg-white h-full overflow-y-scroll right-0 dark:bg-black dark:border-l dark:border-gray-100">
              <div className="flex justify-end w-full p-4">
                <button
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <X />
                </button>
              </div>
              <div className="px-8 ">
                <DialogTitle className="font-bold">History</DialogTitle>
                {messageHistory.map((message, index) => (
                  <Link
                    to={`/chat/${message?.sessionId}`}
                    key={message?.sessionId}
                  >
                    <div
                      className="flex items-center space-x-2 hover:bg-muted p-2 rounded-md"
                      key={index}
                    >
                      <div className="flex items-center space-x-2 ">
                        <div>
                          <SkipForward className="size-5 stroke-green-800 dark:stroke-green-600" />
                        </div>
                        <div>
                          <div>
                            <p className="text-foreground text-sm line-clamp-1">
                              {message?.input}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-sm">
                              {moment(message?.createdAt).fromNow()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </DialogPanel>
          </div>
        </Transition>
      </Dialog>
    </>
  );
}
