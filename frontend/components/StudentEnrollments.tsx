"use client";

import { Enrollment } from "@/types/types";
import React from "react";
import { BookOpen, CalendarDays, User, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import Loading from "./Loading";

export default function StudentEnrollments({
  studentEnrollments,
}: {
  studentEnrollments: Enrollment[];
}) {
  if(!studentEnrollments || studentEnrollments.length === 0) return <Loading/>
    

  // Handle unenroll (delete enrollment)
  const handleUnenroll = async (enrollmentId: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to unenroll from this course?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("enrollments")
      .delete()
      .eq("id", enrollmentId);

    if (error) {
      console.error("Error unenrolling:", error);
      toast.error("Failed to unenroll. Please try again.");
    } else {
      toast.success("Successfully unenrolled from course!");
      // Optional: reload the page or use a state update to remove it from UI
      window.location.reload();
    }
  };

  return (
    <div className="p-6 mt-20">
      <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
        <BookOpen className="w-6 h-6" /> My Enrollments
      </h2>

      <div className="overflow-x-auto bg-base-100 shadow-lg rounded-2xl">
        <table className="table table-zebra w-full">
          <thead className="bg-primary text-white">
            <tr>
              <th>#</th>
              <th>Course Title</th>
              <th>Instructor</th>
              <th>Enrolled On</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {studentEnrollments.length > 0 ? (
              studentEnrollments.map((enrollment, index) => (
                <tr key={enrollment.id} className="hover:bg-base-200">
                  <th>{index + 1}</th>
                  <td className="font-semibold text-gray-800">
                    {enrollment.courses?.title || "Untitled Course"}
                  </td>
                  <td className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4 text-gray-500" />
                    {enrollment.courses?.profiles?.full_name || "Unknown Instructor"}
                  </td>
                  <td className="text-sm text-gray-600 flex items-center gap-1">
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                    {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </td>
                  <td>
                    <span className="badge badge-success badge-outline">
                      Active
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleUnenroll(enrollment.id)}
                      className="btn btn-error btn-sm text-white flex items-center gap-1 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                      Unenroll
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  You’re not enrolled in any courses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
