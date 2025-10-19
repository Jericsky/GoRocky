"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import Image from "next/image";
import { set } from "mongoose";
import toast from "react-hot-toast";

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    toast.success("Logged out successfully!");

    router.push("/auth/login");

  };

  return (
    <div className="navbar bg-base-100 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="navbar-start">
        {/* Mobile Menu */}
        <div className="dropdown">
          <button tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li><Link href="/">Home</Link></li>
            <li><Link href="/courses">Courses</Link></li>
            {user ? (
              <>
                <li><Link href="/profile">Profile</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <li><Link href="/auth/login">Login</Link></li>
            )}
          </ul>
        </div>

        {/* Brand */}
        <Link href="/" className="btn btn-ghost normal-case text-2xl font-bold text-primary">
          EduBook
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-base font-medium gap-2">
          <li><Link href="/courses">Courses</Link></li>
        </ul>
      </div>

      <div className="navbar-end">
        {user ? (
            <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full overflow-hidden">
                        <span>
                            <Image
                                src={"/user.png"}
                                alt="User Avatar"
                                width={40}
                                height={40}
                                // className="rounded-full"
                            />
                        </span>
                    </div>
                </button>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                    <li><Link href="/profile">Profile</Link></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
            </div>
        ) : (
            <Link href="/auth/login" className="btn btn-primary rounded-xl">
                Login
            </Link>
        )}
      </div>
    </div>
  );
}
