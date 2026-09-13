import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition",
        className
      )}
      {...props}
    />
  );
}

export { Input };
