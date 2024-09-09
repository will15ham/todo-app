import { createClient } from "@/utils/supabase/server";
import Auth from "./form";
import { redirect } from "next/navigation";

export default async function AuthPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/profile");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Auth />
    </div>
  );
}
