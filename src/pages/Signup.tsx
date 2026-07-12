import SignUpForm from "@/components/SignUpForm";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "lucide-react";

export default function Signup() {
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

      <Card className="w-full max-w-lg z-10 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border-white/60 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl">
        <CardHeader className="space-y-2 text-center pb-4 pt-6">
          <div className="mx-auto bg-linear-to-br from-primary/20 to-primary/5 w-12 h-12 rounded-2xl flex items-center justify-center mb-1 shadow-inner border border-primary/10">
            <User className="w-7 h-7 text-primary drop-shadow-sm" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create an account
          </CardTitle>
          <CardDescription className="text-base text-zinc-500 dark:text-zinc-400">
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        <SignUpForm />
      </Card>
    </div>
  );
}
