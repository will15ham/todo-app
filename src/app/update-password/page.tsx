// import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/navigation";
import Auth from "./form";

export default async function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Auth />
    </div>
  );
}
