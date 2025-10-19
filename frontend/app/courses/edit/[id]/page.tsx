"use client";

import { Course, Profile } from "@/types/types";
import { User as LocalUser } from "@/types/types";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";

export default function EditCoursePage() {
    const { id } = useParams();
    const router = useRouter();

    // Map Supabase User to Local User type
    const mapSupabaseUserToLocal = (user: SupabaseUser): LocalUser => ({
        id: user.id,
        aud: user.aud,
        role: user.role ?? 'authenticated',
        email: user.email ?? '',
        phone: user.phone ?? '',
        is_anonymous: user.is_anonymous ?? false,
        confirmation_sent_at: user.confirmation_sent_at ?? null,
        confirmed_at: user.confirmed_at ?? null,
        created_at: user.created_at,
        email_confirmed_at: user.email_confirmed_at ?? null,
        last_sign_in_at: user.last_sign_in_at ?? null,
        updated_at: user.updated_at ?? null,
        app_metadata: {
            provider: user.app_metadata?.provider ?? 'email',
            providers: user.app_metadata?.providers ?? ['email'],
        },
        user_metadata: {
            email: user.user_metadata?.email ?? '',
            email_verified: user.user_metadata?.email_verified ?? false,
            phone_verified: user.user_metadata?.phone_verified ?? false,
            sub: user.user_metadata?.sub ?? '',
        },
        identities: user.identities ?? [],
    });

    const [course, setCourse] = useState<Course | null>(null);
    const [user, setUser] = useState<LocalUser | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    useEffect(() => {
        const fetchCourseAndUser = async () => {
            setIsLoading(true);

            // Fetch current user
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData.user) {
                console.error("Error fetching user:", userError);
                setIsLoading(false);
                return;
            }
            setUser(mapSupabaseUserToLocal(userData.user));

            // Fetch course data
            const { data: courseData, error: courseError } = await supabase
                .from("courses")
                .select("*")
                .eq("id", id)
                .single();

            if (courseError || !courseData) {
                console.error("Error fetching course:", courseError);
                setIsLoading(false);
                return;
            }

            setCourse(courseData);
            setTitle(courseData.title);
            setDescription(courseData.description);

            setIsLoading(false);
        };

        fetchCourseAndUser();
    }, [id]);

    const handleUpdateCourse = async () => {
        if (!course) return;

        const { data, error } = await supabase
            .from("courses")
            .update({ title, description })
            .eq("id", course.id);

        if (error) {
            console.error("Error updating course:", error);
            return;
        }

        toast.success("Course updated successfully!");
        router.push(`/courses/${course.id}`);
    };

    if (isLoading) {
        return <Loading/>
    }

    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center pt-24 pb-16 px-4">
            <div className="w-full max-w-3xl card bg-base-100 shadow-2xl p-8 rounded-2xl">
                <h1 className="text-3xl font-bold mb-6 text-primary">Edit Course</h1>

                <div className="flex flex-col gap-4">
                    <label className="font-semibold text-gray-700">Title</label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <label className="font-semibold text-gray-700">Description</label>
                    <textarea
                        className="textarea textarea-bordered w-full h-32"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleUpdateCourse}
                            className="btn btn-primary flex-1"
                        >
                            Update Course
                        </button>
                        <button
                            onClick={() => router.push(`/courses/${course?.id}`)}
                            className="btn btn-outline flex-1"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
