import NavBar from "@/components/NavBar";

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main className="flex flex-col items-center justify-center min-h-screen p-8 pt-24">
        <h1 className="text-4xl font-bold text-primary mb-4">
          School Course Booking
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-md">
          Browse and enroll in your favorite courses!
        </p>
      </main>
    </>
  );
}
