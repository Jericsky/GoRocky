"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

export default function CreateCoursePage() {
  const router = useRouter();

  // ✅ Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [instructorId, setInstructorId] = useState<string | null>(null);

  // ✅ Get logged-in instructor ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        toast.error("You must be logged in to create a course");
        router.push("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", user.id)
        .single();

      if (profileError || profile.role !== "instructor") {
        toast.error("Only instructors can create courses");
        router.push("/courses");
        return;
      }

      setInstructorId(profile.id);
    };

    fetchUser();
  }, [router]);

  // ✅ Handle course creation
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!instructorId) {
      toast.error("Instructor ID not found");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("courses").insert([
      {
        title,
        description,
        instructor_id: instructorId,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course");
    } else {
      toast.success("Course created successfully!");
      router.push("/courses");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex justify-center items-center pt-24 pb-10 px-6">
      <div className="bg-base-100 shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-primary text-center mb-6">
          Create a New Course
        </h1>

        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text font-semibold">Course Title</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Enter course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
}
