import { supabase } from "@/lib/supabaseClient";
import CourseCard from "@/components/CourseCard";

export default async function CoursesPage() {
    const { data: courses, error } = await supabase.from("courses").select("*");

    if(error) {
        console.error("Error fetching courses:", error);
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <p className="text-red-500">Failed to load courses. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 pt-24 pb-10 px-6">
            <h1 className="text-3xl font-bold text-primary text-center mb-10">
                Explore Our Courses
            </h1>

            <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
                {courses?.map((course) => (
                <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
}   
