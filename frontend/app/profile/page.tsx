"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Loading from "@/components/Loading";
import { Profile } from "@/types/profile";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const [fullName, setFullName] = useState<string>("");

  // Fetch current user's profile
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Error fetching user:", userError);
        setIsLoading(false);
        return;
      }

      setEmail(user.email || "No email found");

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast.error("Error fetching profile data");
      } else {
        setProfile(profileData);
        setFullName(profileData.full_name);
      }

      setIsLoading(false);
    };

    fetchProfile();
  }, []);

  console.log("Profile data:", profile);

  // Handle profile update
  const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setIsUpdating(true);

        // Check if the profile exists first
        const { data: existingProfile, error: fetchError } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", profile.id)
            .maybeSingle();

        if (fetchError) {
            console.error("Error checking profile existence:", fetchError);
            toast.error("Error checking profile existence.");
            setIsUpdating(false);
            return;
        }

        let response;

        if (existingProfile) {
            // Update existing profile
            response = await supabase
            .from("profiles")
            .update({ full_name: fullName })
            .eq("id", profile.id)
            .select(); // no `.single()` here
        } else {
            // Insert new profile if it doesn’t exist
            response = await supabase
            .from("profiles")
            .insert([{ id: profile.id, full_name: fullName }])
            .select();
        }

        const { data, error } = response;
        setIsUpdating(false);

        if (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        } else {
            setProfile({ ...profile, full_name: fullName });
            toast.success("Profile updated successfully!");
        }
    };

    // Loading screen
    if (isLoading || !profile) {
        return (
        <div className="flex justify-center items-center min-h-screen bg-base-200">
            <Loading />
        </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-200 px-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl p-6">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-primary">My Profile</h2>
                    <p className="text-sm opacity-70">
                        Manage your account details below
                    </p>
                </div>

                <div className="space-y-3 mb-4">
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Joined:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
                    <p><strong>Role:</strong> {profile.role}</p>
                </div>

                <form onSubmit={handleUpdate} className="form-control space-y-4">
                    <label className="label">
                        <span className="label-text font-semibold">Full Name</span>
                    </label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className={`btn btn-primary w-full mt-4 rounded-xl ${
                        isUpdating ? "loading" : ""
                        }`}
                        disabled={isUpdating}
                    >
                        {isUpdating ? "Updating..." : "Update Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
}
