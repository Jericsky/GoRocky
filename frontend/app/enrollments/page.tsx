"use client";
import React from 'react'
import { supabase } from '@/lib/supabaseClient';

import StudentEnrollments from '@/components/StudentEnrollments';
import IntructorEnrollments from '@/components/IntructorEnrollments';

import { useState, useEffect } from 'react';
import { Enrollment, Profile } from '@/types/types';
import toast from 'react-hot-toast';

export default function EnrollmentsPage() {
    const [profile, setProfile] = useState<Profile | null>(null);

    const [instructorEnrollments, setInstructorEnrollments] = useState<Enrollment[]>([]);
    const [studentEnrollments, setStudentEnrollments] = useState<Enrollment[]>([]);

    useEffect(() => {
        const fetchProfileType = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                console.error("Error fetching user:", userError);
                return;
            }

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
                console.log("Profile data:", profileData);
            }

            // Fetch all enrollments for instructor
            if (profileData.role === "instructor") {
                const { data: instructorEnrollments, error: instructorEnrollmentsError } = await supabase
                .from("enrollments")
                .select(`
                    id,
                    enrolled_at,
                    courses (
                        id,
                        title,
                        instructor_id,
                        profiles!courses_instructor_id_fkey ( full_name )
                    ),
                    profiles!enrollments_student_id_fkey (
                        id,
                        full_name
                    )
                `)
                .eq("courses.instructor_id", user.id);

                console.log("Fetched instructor enrollments:", instructorEnrollments);

                if (instructorEnrollmentsError) {
                    console.error("Error fetching instructor enrollments:", instructorEnrollmentsError);
                    toast.error("Error fetching instructor enrollments");
                } else {
                    console.log("Instructor Enrollments data:", instructorEnrollments);
                    setInstructorEnrollments(instructorEnrollments as unknown as Enrollment[]);
                }
            }

            // Fetch student enrollments
            const { data: studentEnrollments, error: studentEnrollmentsError } = await supabase
                .from("enrollments")
                .select(`*, courses ( *, profiles (full_name) )`)
                .eq(profileData.role === 'student' ? 'student_id' : 'instructor_id', user.id);

            if (studentEnrollmentsError) {
                console.error("Error fetching student enrollments:", studentEnrollmentsError);
                toast.error("Error fetching enrollments data");
            } else {
                console.log("Student Enrollments data:", studentEnrollments);
                setStudentEnrollments(studentEnrollments);
            }
        };

        fetchProfileType();
    }, []);

    console.log("Profile role:", profile);

    return (
        <div>
            {profile?.role === 'instructor' ? (
                <IntructorEnrollments instructorEnrollments={instructorEnrollments}/>
            ) : (
                <StudentEnrollments studentEnrollments={studentEnrollments}/>
            )}  
        </div>
    )
}
