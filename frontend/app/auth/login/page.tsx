"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        toast.error(error.message);
    } else {
        toast.success("Login successful!");
        router.push("/");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary text-center text-2xl mb-2">
            Welcome Back!
          </h2>

          <p className="text-center text-sm text-gray-500 mb-4">
            Log in to your <span className="font-semibold text-primary">EduBook</span> account to
            continue booking courses, tracking your progress, and exploring
            new learning opportunities designed just for you.
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full mb-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="btn btn-primary w-full mt-4 rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <Link href="/auth/signup" className="link link-primary">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
