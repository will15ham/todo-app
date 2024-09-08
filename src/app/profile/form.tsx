"use client";

import { Button } from "@/components/ui/button";
import { redirectToDashboard } from "./actions";
import { signOut } from "../login/actions";

export function ProfileForm() {
  return (
    <>
      <form action={redirectToDashboard} className="w-full">
        <Button variant="secondary" className="w-full">
          Got to Dashboard
        </Button>
      </form>
      <form action={signOut} className="w-full">
        <Button variant="default" className="w-full">
          Sign Out
        </Button>
      </form>
    </>
  );
}
