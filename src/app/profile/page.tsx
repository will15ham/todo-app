import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./form";

export default async function AuthPage() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            You&apos;re already logged in. What would you like to do?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Logged in as: {data.user.email}</p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <ProfileForm />
        </CardFooter>
      </Card>
    </div>
  );
}
