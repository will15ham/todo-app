"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MailIcon, LockIcon, EyeOffIcon, EyeIcon } from "lucide-react";
import { signup, login, resetPasswordForEmail } from "./actions";
import { SubmitButton } from "@/components/loading-spinner";

export function PasswordInput({
  id,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <LockIcon
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <Input
          id={id}
          name={id}
          type={showPassword ? "text" : "password"}
          className="pl-10 pr-10"
          required
          {...props}
        />
        <Button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          variant="ghost"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
        </Button>
      </div>
    </div>
  );
}

function EmailInput() {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <div className="relative">
        <MailIcon
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <Input
          id="email"
          name="email"
          placeholder="you@example.com"
          type="email"
          className="pl-10"
          required
        />
      </div>
    </div>
  );
}

function AuthForm({
  formType,
  onResetPassword,
}: {
  formType: "login" | "signup" | "reset";
  onResetPassword: () => void;
}) {
  const { toast } = useToast();

  async function handleSubmit(formData: FormData) {
    let action;
    switch (formType) {
      case "signup":
        action = signup;
        break;
      case "login":
        action = login;
        break;
      case "reset":
        action = resetPasswordForEmail;
        break;
    }
    const result = await action(formData);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else if (formType === "reset") {
      toast({
        title: "Success",
        description: "Password reset email sent. Please check your inbox.",
      });
    } else if (formType === "signup") {
      toast({
        title: "Success",
        description: "Account created. Please check your email to verify.",
      });
    }
  }

  return (
    <form action={handleSubmit}>
      <CardContent className="space-y-4">
        <EmailInput />
        {formType !== "reset" && (
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Enter your password"
          />
        )}
        {formType === "signup" && (
          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
          />
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <SubmitButton>
          {formType === "signup"
            ? "Sign Up"
            : formType === "login"
            ? "Login"
            : "Reset Password"}
        </SubmitButton>
        {formType === "login" && (
          <div className="flex justify-between w-full text-sm">
            <Button variant="link" className="px-0" onClick={onResetPassword}>
              Forgot password?
            </Button>
          </div>
        )}
      </CardFooter>
    </form>
  );
}

export default function Auth() {
  const [formType, setFormType] = useState<"login" | "signup" | "reset">(
    "login"
  );

  const title = {
    login: "Login",
    signup: "Sign Up",
    reset: "Reset Password",
  }[formType];

  const description = {
    login: "Enter your email and password to access your account",
    signup: "Create a new account to get started",
    reset: "Enter your email to receive a password reset link",
  }[formType];

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <AuthForm
        formType={formType}
        onResetPassword={() => setFormType("reset")}
      />
      <CardFooter>
        {formType !== "reset" && (
          <p className="text-sm text-muted-foreground">
            {formType === "signup"
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <Button
              className="text-primary hover:underline"
              onClick={() =>
                setFormType(formType === "signup" ? "login" : "signup")
              }
              variant="link"
            >
              {formType === "signup" ? "Login" : "Sign up"}
            </Button>
          </p>
        )}
        {formType === "reset" && (
          <Button
            className="px-0"
            onClick={() => setFormType("login")}
            variant="link"
          >
            Back to Login
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
