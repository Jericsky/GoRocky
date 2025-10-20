-- Additional RLS policies and features
-- Allow authenticated users to update their own profile
create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id);

-- Drop existing policy if needed
drop policy if exists "Users can update their own profile safely" on public.profiles;

-- Create secure update policy
create policy "Users can update their own profile safely"
on public.profiles
for update
using (auth.uid() = id)
with check (
  auth.uid() = id
  and role = (select role from public.profiles where id = auth.uid())
);

-- Allow all authenticated users to SELECT any course
CREATE POLICY "Allow all to view courses"
ON public.courses
FOR SELECT
USING (true);

-- Allow all to view public profile info
CREATE POLICY "Allow all to view public profile info"
ON public.profiles
FOR SELECT
USING (true);

-- Student can delete their own enrollment
CREATE POLICY "Students can unenroll themselves"
ON enrollments
FOR DELETE
USING (student_id = auth.uid());

-- Instructors can view enrollments for courses they own
CREATE POLICY "Instructors can view enrollments in their courses"
ON enrollments
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM courses
    WHERE courses.id = enrollments.course_id
      AND courses.instructor_id = auth.uid()
  )
);

-- Add instructor_id column to enrollments for easier querying
ALTER TABLE enrollments
ADD COLUMN instructor_id uuid;

-- Function to create profile for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    'student'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger that calls the function after every new auth signup
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
