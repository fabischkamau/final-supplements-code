import { ChevronUp } from "lucide-react";

const LoadingSkeleton = ({ title }: { title: string }) => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between w-full font-semibold">
        <span>{title}</span>
        <span className="ml-auto rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-900">
          <ChevronUp />
        </span>
      </div>
      <div className="flex space-x-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="w-36 h-36 bg-gray-300 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
