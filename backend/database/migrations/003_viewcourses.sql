-- Allow anyone (even unauthenticated) to view all courses
create policy "Anyone can view courses"
on courses for select
using (true);