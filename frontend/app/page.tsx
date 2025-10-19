import NavBar from "@/components/NavBar";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-base-200 to-base-100 pt-24 px-6">
        {/* Hero Section */}
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl font-extrabold text-primary mb-6">
            School Course Booking
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Empower your learning journey — explore, enroll, and master new skills
            with courses from passionate instructors.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <button className="btn btn-primary btn-wide text-white">
                🎓 Browse Courses
              </button>
            </Link>
            
          </div>
        </div>

        {/* Illustration Section */}
        <div className="mt-16">
          <img
            src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif"
            alt="Learning illustration"
            className="w-full max-w-lg rounded-2xl shadow-lg"
          />
        </div>
      </main>
    </>
  );
}
