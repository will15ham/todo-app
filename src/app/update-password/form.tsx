"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubmitButton } from "@/components/loading-spinner";
import { updateUserPassword } from "../login/actions";
import { redirect } from "next/navigation";
import { PasswordInput } from "../login/form";

function AuthForm() {
  const { toast } = useToast();

  async function handleSubmit(formData: FormData) {
    const result = await updateUserPassword(formData);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      redirect("/login");
    }
  }

  return (
    <form action={handleSubmit}>
      <CardContent className="space-y-4">
        <PasswordInput
          id="password"
          label="Password"
          placeholder="Enter your password"
        />
        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
        />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <SubmitButton>Reset Password</SubmitButton>
      </CardFooter>
    </form>
  );
}

export default function Auth() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>Enter your new password</CardDescription>
      </CardHeader>
      <AuthForm />
    </Card>
  );
}
