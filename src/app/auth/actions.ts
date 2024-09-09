"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

type HandleAuthActions =
  | "signInWithPassword"
  | "signUp"
  | "resetPasswordForEmail"
  | "signOut"
  | "updateUserPassword";

const schemas = {
  auth: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
  emailOnly: z.object({
    email: z.string().email("Invalid email address"),
  }),
  passwordOnly: z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
  none: z.object({}),
};

const actionSchemas: Record<HandleAuthActions, z.ZodSchema> = {
  signInWithPassword: schemas.auth,
  signUp: schemas.auth,
  resetPasswordForEmail: schemas.emailOnly,
  updateUserPassword: schemas.passwordOnly,
  signOut: schemas.none,
};

async function validateFormData(formData: FormData, action: HandleAuthActions) {
  const schema = actionSchemas[action];
  const data = Object.fromEntries(formData);
  return schema.parse(data);
}

async function handleAuthAction(action: HandleAuthActions, formData: FormData) {
  try {
    const supabase = createClient();
    const data = await validateFormData(formData, action);

    const actions = {
      signInWithPassword: () =>
        supabase.auth.signInWithPassword(
          data as { email: string; password: string }
        ),
      signUp: () =>
        supabase.auth.signUp(data as { email: string; password: string }),
      resetPasswordForEmail: () =>
        supabase.auth.resetPasswordForEmail((data as { email: string }).email, {
          redirectTo: `${
            process.env.NEXT_PUBLIC_URL || process.env.LOCALHOST_URL
          }/auth/update-password`,
        }),
      signOut: () => supabase.auth.signOut(),
      updateUserPassword: () =>
        supabase.auth.updateUser(data as { password: string }),
    };

    const { error } = await actions[action]();

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: (error as Error).message };
  }
}

export const login = (formData: FormData) =>
  handleAuthAction("signInWithPassword", formData);
export const signup = (formData: FormData) =>
  handleAuthAction("signUp", formData);
export const resetPasswordForEmail = (formData: FormData) =>
  handleAuthAction("resetPasswordForEmail", formData);
export const signOut = () => handleAuthAction("signOut", new FormData());
export const updateUserPassword = (formData: FormData) =>
  handleAuthAction("updateUserPassword", formData);
