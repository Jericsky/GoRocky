-- USERS (Handled by Supabase Auth)
-- Additional profile info
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  role text check (role in ('student', 'instructor')),
  created_at timestamp default now()
);

-- COURSES
create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  instructor_id uuid references profiles(id) on delete cascade,
  created_at timestamp default now()
);

-- ENROLLMENTS
create table enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  student_id uuid references profiles(id) on delete cascade,
  enrolled_at timestamp default now(),
  unique(course_id, student_id)
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table courses enable row level security;
alter table enrollments enable row level security;

-- Simple policies
create policy "Users can view own profile" 
  on profiles for select
  using (auth.uid() = id);

create policy "Instructors can manage their courses"
  on courses for all
  using (auth.uid() = instructor_id);

create policy "Students can enroll themselves"
  on enrollments for insert
  with check (auth.uid() = student_id);

create policy "Users can view their enrollments"
  on enrollments for select
  using (auth.uid() = student_id);
