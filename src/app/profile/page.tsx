import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockIcon, MailIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AuthPage() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  const isLoggedIn = !error && data?.user;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {isLoggedIn ? "Welcome Back" : "Login"}
          </CardTitle>
          <CardDescription>
            {isLoggedIn
              ? "You're already logged in. What would you like to do?"
              : "Enter your email and password to access your account"}
          </CardDescription>
        </CardHeader>
        {isLoggedIn ? <LoggedInContent user={data.user} /> : <LoginForm />}
      </Card>
    </div>
  );
}

function LoginForm() {
  return (
    <form>
      <CardContent className="space-y-4">
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
              placeholder="wham@wham.com"
              type="email"
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <LockIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="wham"
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button className="w-full">Login</Button>
        <div className="flex justify-between w-full text-sm">
          <a href="#" className="text-primary hover:underline">
            Forgot password?
          </a>
          <span className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-primary hover:underline">
              Sign up
            </a>
          </span>
        </div>
      </CardFooter>
    </form>
  );
}

function LoggedInContent({ user }) {
  return (
    <>
      <CardContent className="space-y-4">
        <p>Logged in as: {user.email}</p>
        {/* Add any other user information or actions here */}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Link href="/" className="w-full">
          Go to Dashboard
        </Link>
        <form></form>
        <Button variant="outline" className="w-full">
          Logout
        </Button>
      </CardFooter>
    </>
  );
}
