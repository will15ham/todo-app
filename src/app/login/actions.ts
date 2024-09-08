"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

type HandleAuthActions =
  | "signInWithPassword"
  | "signUp"
  | "resetPasswordForEmail"
  | "signOut"
  | "updateUserPassword";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const emailOnlySchema = z.object({
  email: z.string().email("Invalid email address"),
});

const passwordOnlySchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const noSchema = z.object({});

async function validateFormData(
  formData: FormData,
  action: HandleAuthActions
): Promise<
  | z.infer<typeof authSchema>
  | z.infer<typeof emailOnlySchema>
  | z.infer<typeof passwordOnlySchema>
  | z.infer<typeof noSchema>
> {
  const data = {
    email: formData.get("email") || "",
    password: formData.get("password") || "",
  };

  switch (action) {
    case "resetPasswordForEmail":
      return emailOnlySchema.parse(data);
    case "updateUserPassword":
      return passwordOnlySchema.parse(data);
    case "signOut":
      return noSchema.parse(data);
    default:
      return authSchema.parse(data);
  }
}

async function handleAuthAction(action: HandleAuthActions, formData: FormData) {
  try {
    const supabase = createClient();
    const data = await validateFormData(formData, action);

    switch (action) {
      case "signInWithPassword":
        if ("password" in data && "email" in data) {
          const { error: signInWithPasswordError } =
            await supabase.auth.signInWithPassword(data);
          if (signInWithPasswordError) {
            throw new Error("Invalid Credentials. Please try again.");
          }
        }
        break;
      case "signUp":
        if ("password" in data && "email" in data) {
          const { error: signUpError } = await supabase.auth.signUp(data);
          if (signUpError) {
            throw new Error("An error occurred. Please try again.");
          }
        }
        break;
      case "resetPasswordForEmail":
        if ("email" in data) {
          const { error: resetPasswordForEmailError } =
            await supabase.auth.resetPasswordForEmail(data.email, {
              redirectTo: process.env.NEXT_PUBLIC_URL
                ? `${process.env.NEXT_PUBLIC_URL}/update-password`
                : `${process.env.LOCALHOST_URL}/update-password`,
            });
          if (resetPasswordForEmailError) {
            switch (resetPasswordForEmailError.code) {
              case "over_email_send_rate_limit":
                throw new Error("Too many requests. Please try again later.");
              default:
                throw new Error(
                  "An error occurred while resetting your password. Please try again."
                );
            }
          }
        }
        break;
      case "signOut":
        const { error: signOut } = await supabase.auth.signOut();
        if (signOut) {
          throw new Error(
            "An error occurred while signing out. Please try again."
          );
        }
        break;
      case "updateUserPassword":
        const { error: updatePasswordError } = await supabase.auth.updateUser(
          data
        );
        if (updatePasswordError) {
          console.error("Error", updatePasswordError);
          throw new Error(
            "An error occurred while updating your password. Please try again."
          );
        }
      default:
        break;
    }
  } catch (error) {
    console.error("Error", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: (error as Error).message };
  }
}

export async function login(formData: FormData) {
  return handleAuthAction("signInWithPassword", formData);
}

export async function signup(formData: FormData) {
  return handleAuthAction("signUp", formData);
}

export async function resetPasswordForEmail(formData: FormData) {
  return handleAuthAction("resetPasswordForEmail", formData);
}

export async function signOut() {
  return handleAuthAction("signOut", new FormData());
}

export async function updateUserPassword(formData: FormData) {
  return handleAuthAction("updateUserPassword", formData);
}
