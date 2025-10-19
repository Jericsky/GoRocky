import Link from "next/link";
import { Course } from "@/types/types";

export default function CourseCard({ course }: { course: Course }) {
    console.log("Rendering CourseCard for course:", course);

    return (
        <div className="card w-full sm:w-72 bg-base-100 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="card-body flex flex-col justify-between">
                <div>
                    <h2 className="card-title text-primary mb-2">{course.title}</h2>
                    <p className="text-gray-600 text-sm line-clamp-3">{course.description}</p>

                </div>

                <div className="card-actions justify-end mt-4">
                    <Link href={`/courses/${course.id}`} className="btn btn-primary btn-sm">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
