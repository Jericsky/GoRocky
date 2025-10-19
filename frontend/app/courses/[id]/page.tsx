"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import toast from 'react-hot-toast';
import { Course, Profile, User } from "@/types/types";
import Loading from "@/components/Loading";

export default function CoursePage() {
    const { id } = useParams();
    const router = useRouter();

    const [course, setCourse] = useState<Course | null>(null);
    const [user, setUser] = useState<User | any>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCourse = async () => {
            setIsLoading(true);

            // Get current user
            const {data: userData, error: userError} = await supabase.auth.getUser();
            if(userError || !userData.user) {
                console.error("Error fetching user:", userError);
                setIsLoading(false);
                return;
            }
            setUser(userData?.user);

            // Fetch profile data
            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userData.user?.id)
                .single();
            
            if (profileError) {
                console.error("Error fetching profile:", profileError);
                toast.error("Error fetching profile data");
            } else {
                setProfile(profileData);
            }

            // Fetch course data with instructor's profile
            const { data: courseData, error: courseError } = await supabase
                .from("courses")
                .select(`
                    *,
                    profiles (full_name)
                `)
                .eq("id", id)
                .single();

            if (courseError) {
                console.error("Error fetching course:", courseError);
                toast.error("Error fetching course data");
            } else {
                setCourse(courseData);
            }

            setIsLoading(false);
        };

        fetchCourse();
    }, [id]);

    console.log("Course data:", course);

    if (!course || isLoading) return <Loading/>;

    const canManageCourse = profile?.role === "instructor" && user?.id === course.instructor_id;
    const studentCanEnroll = profile?.role === "student"&& user?.id !== course.instructor_id;

    const handleDeleteCourse = async () => {
        if(!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;

        const { error } = await supabase
            .from("courses")
            .delete()
            .eq("id", course.id);

        if(error) {
            console.error("Error deleting course:", error);
            toast.error("Failed to delete course.");
        } else {
            toast.success("Course deleted successfully.");
            router.push("/courses");
        }
    }

    return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center pt-24 pb-16 px-4 ">
      {/* Hero Header */}
      <div className="w-full max-w-5xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
          {course.title}
        </h1>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
          Expand your skills and learn new techniques with this in-depth course.
        </p>
      </div>

      {/* Course Content Card */}
      <div className="card w-full max-w-3xl bg-base-100 shadow-2xl p-8 rounded-2xl transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)]">
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-2 text-primary">
              Course Overview
            </h2>
            <p className="text-gray-700 leading-relaxed">{course.description}</p>
          </section>

          <section className="pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">Instructor:</p>
                <p className="font-semibold text-gray-800">
                  {course.profiles?.full_name ? course.profiles?.full_name : "TBA"}
                </p>
              </div>

              {/* Show action buttons based on role */}
              {canManageCourse ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/courses/edit/${course.id}`)}
                    className="btn btn-warning text-white px-6 rounded-xl"
                  >
                    Update
                  </button>
                  <button
                    onClick={handleDeleteCourse}
                    className="btn btn-error text-white px-6 rounded-xl"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                studentCanEnroll && (
                    <button className="btn btn-primary px-8 py-2 rounded-xl text-white text-lg shadow-md hover:scale-105 transition-transform duration-200">
                        Enroll Now
                    </button>
                )
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}