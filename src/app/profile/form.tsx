"use client";

import { Button } from "@/components/ui/button";
import { redirectToDashboard } from "./actions";
import { signOut } from "../auth/actions";
import { SubmitButton } from "@/components/loading-spinner";

export function ProfileForm() {
  return (
    <>
      <form action={redirectToDashboard} className="w-full">
        <Button variant="secondary" className="w-full">
          Got to Dashboard
        </Button>
      </form>
      <form action={signOut} className="w-full">
        <SubmitButton>Sign Out</SubmitButton>
      </form>
    </>
  );
}
