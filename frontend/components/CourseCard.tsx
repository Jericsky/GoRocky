"use client";
import Link from "next/link";

export default function CourseCard({ course }: { course: any }) {
  return (
    <div className="card w-80 bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="card-body">
        <h2 className="card-title text-primary">{course.title}</h2>
        <p className="text-gray-600">{course.description}</p>
        <div className="card-actions justify-end">
          <Link href={`/courses/${course.id}`} className="btn btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}