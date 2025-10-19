"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [full_name, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    const user = data.user;
    if (user) {
      // Create a profile row for the new user
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            full_name,
            email: user.email,
            role: "student", // optional default role
          },
        ]);

      if (profileError) {
        console.error("Error creating profile:", profileError);
      }
    }

    toast.success("Signup successful! Please check your email to confirm your account.");
    router.push("/auth/login");
    setIsLoading(false);
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary text-center text-2xl mb-2">
            Create Your Account
          </h2>
          <p className="text-center text-sm text-gray-500 mb-4">
            Join{" "}
            <span className="font-semibold text-primary">EduBook</span> to
            explore and book your favorite courses! Creating an account allows
            you to manage your enrollments, track progress, and connect with
            instructors.
          </p>

          <form onSubmit={handleSignup}>
            {/* Full Name */}
            <input
              type="text"
              placeholder="John Doe"
              className="input input-bordered w-full mb-2"
              value={full_name}
              onChange={(e) => setFullname(e.target.value)}
              required
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full mb-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full mt-4 rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link href="/auth/login" className="link link-primary">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
