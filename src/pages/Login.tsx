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
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 relative overflow-hidden">
      {/* Premium Background Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div
          className="absolute top-[-10%] left-[-10%] w-150 h-150 rounded-full bg-primary/15 dark:bg-primary/10 blur-[120px] animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-125 h-125 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] animate-pulse"
          style={{ animationDuration: "8s", animationDelay: "1s" }}
        />
      </div>

      <Card className="w-full max-w-md z-10 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border-white/60 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl">
        <CardHeader className="space-y-3 text-center pb-8 pt-8">
          <div className="mx-auto bg-linear-to-br from-primary/20 to-primary/5 w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-inner border border-primary/10">
            <Lock className="w-7 h-7 text-primary drop-shadow-sm" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome back
          </CardTitle>
          <CardDescription className="text-base text-zinc-500 dark:text-zinc-400">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1 flex flex-col">
            <label
              className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="pl-11 h-12 bg-white/60 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300 shadow-sm"
              />
            </div>
          </div>
          <div className="space-y-1 flex flex-col">
            <div className="flex items-center justify-between">
              <label
                className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="password"
              >
                Password
              </label>
              <Link
                to="#"
                className="text-sm text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-11 h-12 bg-white/60 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300 shadow-sm"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-5 pb-8 pt-2 bg-transparent border-t-0">
          <Button className="w-full text-base h-12 font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-px active:translate-y-px group">
            Sign In
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <div className="text-sm text-center text-zinc-500 dark:text-zinc-400">
            Don't have an account?{" "}
            <Link
              to="#"
              className="text-primary hover:text-primary/80 font-semibold transition-colors hover:underline"
            >
              Create one now
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
