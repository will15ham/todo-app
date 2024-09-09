"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { SubmitButton } from "@/components/loading-spinner";
import { z } from "zod";
import { login, resetPasswordForEmail, signup } from "../actions";

const usePasswordVisibility = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  return { showPassword, togglePasswordVisibility };
};

const PasswordInput = ({
  id,
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) => {
  const { showPassword, togglePasswordVisibility } = usePasswordVisibility();

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
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
          className={`pl-10 pr-10 ${error ? "border-red-500" : ""}`}
          required
          {...props}
        />
        <Button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          variant="ghost"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </motion.div>
  );
};

const EmailInput = ({ error }: { error?: string }) => (
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
        className={`pl-10 ${error ? "border-red-500" : ""}`}
        required
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = loginSchema
  .extend({
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const resetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const AuthForm = ({
  formType,
  onResetPassword,
}: {
  formType: "login" | "signup" | "reset";
  onResetPassword: () => void;
}) => {
  const { toast } = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    let schema;

    switch (formType) {
      case "login":
        schema = loginSchema;
        break;
      case "signup":
        schema = signupSchema;
        break;
      case "reset":
        schema = resetSchema;
        break;
      default:
        return false;
    }

    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (!validateForm(formData)) {
      return;
    }

    const actions = { signup, login, reset: resetPasswordForEmail };
    const action = actions[formType];
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
  };

  return (
    <form action={handleSubmit}>
      <CardContent className="space-y-4">
        <EmailInput error={errors.email} />
        <AnimatePresence mode="wait">
          {formType !== "reset" && (
            <PasswordInput
              key="password"
              id="password"
              label="Password"
              placeholder="Enter your password"
              error={errors.password}
            />
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {formType === "signup" && (
            <PasswordInput
              key="confirmPassword"
              id="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              error={errors.confirmPassword}
            />
          )}
        </AnimatePresence>
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
};

const Auth = () => {
  const [formType, setFormType] = useState<"login" | "signup" | "reset">(
    "login"
  );

  const formConfig = {
    login: {
      title: "Login",
      description: "Enter your email and password to access your account",
    },
    signup: {
      title: "Sign Up",
      description: "Create a new account to get started",
    },
    reset: {
      title: "Reset Password",
      description: "Enter your email to receive a password reset link",
    },
  };

  const { title, description } = formConfig[formType];

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
        <AnimatePresence mode="wait">
          {formType !== "reset" ? (
            <motion.p
              key="switch-form"
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.p>
          ) : (
            <motion.div
              key="back-to-login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                className="px-0"
                onClick={() => setFormType("login")}
                variant="link"
              >
                Back to Login
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardFooter>
    </Card>
  );
};

export default Auth;
