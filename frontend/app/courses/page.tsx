"use client";

import { supabase } from "@/lib/supabaseClient";
import CourseCard from "@/components/CourseCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Course } from "@/types/types";

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [role, setRole] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
        // ✅ Fetch courses
        const { data: coursesData, error: coursesError } = await supabase.from("courses").select("*");
        if (coursesError) console.error("Error fetching courses:", coursesError);
        setCourses(coursesData || []);

        // ✅ Fetch user role
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return;

        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (!profileError) setRole(profileData.role);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchUserRole = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                console.error("Error fetching user:", userError);
                return;
            }

            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            if (profileError) {
                console.error("Error fetching profile:", profileError);
            } else {
                setRole(profileData.role);
            }
        };

        fetchUserRole();    
    }, []);

    return (
        <div className="min-h-screen bg-base-200 pt-24 pb-10 px-6">
            <div className="max-w-7xl mx-auto mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-primary text-center sm:text-left">
                Explore Our Courses
                </h1>

                {/* ✅ Show button if instructor */}
                {role === "instructor" && (
                <button
                    onClick={() => router.push("/courses/create")}
                    className="btn btn-primary"
                >
                    + Create Course
                </button>
                )}
            </div>

            <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
                {courses?.map((course) => (
                <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
}   
