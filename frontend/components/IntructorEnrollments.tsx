"use client";

import { Enrollment } from "@/types/types";
import React from "react";
import { BookOpen, CalendarDays, User } from "lucide-react";
import Link from "next/link";
import Loading from "./Loading";

export default function InstructorEnrollments({
  instructorEnrollments,
}: {
  instructorEnrollments: Enrollment[];
}) {
  if (!instructorEnrollments || instructorEnrollments.length === 0) return <Loading />;



  return (
    <div className="p-10 mt-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <BookOpen className="w-6 h-6" /> My Students’ Enrollments
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-base-100 shadow-lg rounded-2xl">
        <table className="table table-zebra w-full">
          <thead className="bg-primary text-white">
            <tr>
              <th>#</th>
              <th>Course Title</th>
              <th>Student Name</th>
              
            </tr>
          </thead>
          <tbody>
            {instructorEnrollments.length > 0 ? (
              instructorEnrollments.map((enrollment, index) => (
                <tr key={enrollment.id} className="hover:bg-base-200">
                  <th>{index + 1}</th>
                  <td className="font-semibold text-white-800">
                    {enrollment.courses?.title || "Untitled Course"}
                  </td>
                  <td className="flex items-center gap-2 text-white-700">
                    <User className="w-4 h-4 text-gray-500" />
                    {enrollment.profiles?.full_name || "Unknown Student"}
                  </td>
                  <td className="text-sm text-gray-600 flex items-center gap-1">
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                    {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No students are enrolled in your courses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
