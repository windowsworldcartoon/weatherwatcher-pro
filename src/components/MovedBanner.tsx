
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// You can customize the new URL and message below
const MOVED_URL = "https://your-new-website.com";
const LOCAL_STORAGE_KEY = "movedBannerDismissed";

const MovedBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    setDismissed(stored === "true");
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(LOCAL_STORAGE_KEY, "true");
  };

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "w-full flex justify-center items-center px-4 py-3 z-50 transition-colors",
        "bg-yellow-200 text-yellow-900 border-b border-yellow-400",
        "dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700",
        "fixed top-0 left-0"
      )}
      style={{ minHeight: "56px" }}
      role="alert"
    >
      <div className="flex items-center gap-2 flex-1 justify-center">
        <span className="font-semibold">This website has moved!</span>
        <span>
          Please visit our new site:{" "}
          <a
            href={MOVED_URL}
            className="underline font-medium hover:text-blue-700 dark:hover:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            {MOVED_URL.replace(/^https?:\/\//, "")}
          </a>
        </span>
      </div>
      <button
        onClick={handleDismiss}
        className="ml-4 rounded p-1 transition hover:bg-yellow-300 dark:hover:bg-yellow-800"
        aria-label="Dismiss"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default MovedBanner;
