import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function LoadingSpinner() {
  return (
    <div role="status" className="flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-200 dark:text-gray-600 fill-primary" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function SubmitButton(
  { children }: { children: React.ReactNode },
  className: string
) {
  const { pending } = useFormStatus();

  return (
    <Button
      className={cn("w-full", className)}
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingSpinner /> : children}
    </Button>
  );
}
