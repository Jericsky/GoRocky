# Database Setup Guide for EduBook

This guide provides step-by-step instructions for setting up the EduBook database in Supabase.

## Prerequisites

- Supabase account ([supabase.com](https://supabase.com))
- Basic knowledge of SQL and PostgreSQL

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `edubook-database`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Get Connection Details

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon/public key**: `eyJ...` (starts with eyJ)
   - **service_role key**: `eyJ...` (starts with eyJ, keep this secret!)

## Step 3: Run Database Migrations

### Option A: Using Supabase Dashboard (Recommended)

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy and paste the contents of each migration file in order:

#### Migration 1: Create Tables and Basic RLS Policies
```sql
-- Copy contents of backend/database/migrations/001_init.sql
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
```

4. Click **Run** to execute the query
5. Verify tables were created in **Table Editor**

#### Migration 2: Insert Sample Data
```sql
-- Copy contents of backend/database/migrations/002_seed.sql
-- Note: You'll need to replace these UUIDs with actual user IDs after creating accounts

-- First, create test users through the Auth interface
-- Then update these UUIDs with the actual user IDs
insert into profiles (id, full_name, role)
values
  ('3f0e8590-88ba-45c1-9ef5-d9318dd66f0b', 'Alice Instructor', 'instructor'),
  ('997efc9b-7897-4f5a-bb71-2a07d9153b2b', 'Bob Student', 'student');
```

#### Migration 3: Additional Policies and Features
```sql
-- Copy contents of backend/database/migrations/008_additional_policies.sql
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
```

### Option B: Using psql Command Line

```bash
# Install PostgreSQL client tools
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql-client

# Connect to your database
psql -h db.your-project-ref.supabase.co -U postgres -d postgres

# Run migrations
\i backend/database/migrations/001_init.sql
\i backend/database/migrations/002_seed.sql
\i backend/database/migrations/008_additional_policies.sql
```

## Step 4: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure the following:

### Email Settings
- Enable email confirmations (optional for development)
- Set custom SMTP (optional)

### URL Configuration
- **Site URL**: `http://localhost:3000` (for development)
- **Redirect URLs**: 
  - `http://localhost:3000/auth/callback`
  - `https://your-vercel-app.vercel.app/auth/callback`

### Social Providers (Optional)
- Enable Google, GitHub, etc. if needed

## Step 5: Create Test Users

### Method 1: Using Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Create users with these details:

**Instructor User:**
- Email: `instructor@example.com`
- Password: `password123`
- Email Confirm: ✅ (check this box)

**Student User:**
- Email: `student@example.com`
- Password: `password123`
- Email Confirm: ✅ (check this box)

### Method 2: Using Application Signup
1. Start your frontend application
2. Go to `/auth/signup`
3. Create accounts using the email addresses above

### Method 3: Update Profile Roles
After creating users, update their profiles:

```sql
-- Get the user IDs from the auth.users table
SELECT id, email FROM auth.users;

-- Update profiles with correct roles
UPDATE profiles 
SET role = 'instructor' 
WHERE id = 'instructor-user-id';

UPDATE profiles 
SET role = 'student' 
WHERE id = 'student-user-id';
```

## Step 6: Create Sample Courses

```sql
-- Create sample courses (replace instructor_id with actual instructor user ID)
INSERT INTO courses (title, description, instructor_id)
VALUES 
  ('Introduction to Web Development', 'Learn HTML, CSS, and JavaScript fundamentals', 'instructor-user-id'),
  ('React.js Fundamentals', 'Build modern web applications with React', 'instructor-user-id'),
  ('Database Design', 'Learn to design and optimize databases', 'instructor-user-id'),
  ('Python Programming', 'Master Python programming from basics to advanced', 'instructor-user-id');
```

## Step 7: Test Database Connection

1. Go to **Table Editor** in Supabase dashboard
2. Verify all tables exist:
   - `profiles`
   - `courses` 
   - `enrollments`
3. Check that sample data is present
4. Test RLS policies by trying to view data as different users

## Environment Variables Setup

Create these files with your actual Supabase credentials:

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Backend (.env)
```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=8000
```

## Troubleshooting

### Common Issues

1. **RLS Policies Not Working**
   - Ensure RLS is enabled on all tables
   - Check that policies are correctly written
   - Verify user authentication is working

2. **Foreign Key Constraints**
   - Make sure referenced users exist in auth.users
   - Check that UUIDs match exactly

3. **Permission Denied Errors**
   - Verify service role key is used for backend operations
   - Check that anon key is used for frontend operations

4. **Connection Issues**
   - Verify project URL and keys are correct
   - Check that project is not paused (free tier limitation)

### Useful SQL Queries for Debugging

```sql
-- Check all tables and their row counts
SELECT schemaname, tablename, n_tup_ins as inserts, n_tup_upd as updates, n_tup_del as deletes
FROM pg_stat_user_tables;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies;

-- Check user roles
SELECT id, full_name, role, created_at 
FROM profiles 
ORDER BY created_at DESC;

-- Check courses and their instructors
SELECT c.title, c.description, p.full_name as instructor
FROM courses c
JOIN profiles p ON c.instructor_id = p.id;
```

## Security Best Practices

1. **Never commit secrets**: Use environment variables for all sensitive data
2. **Use RLS**: Always enable Row Level Security on sensitive tables
3. **Limit service role usage**: Only use service role key on backend, never in frontend
4. **Regular backups**: Supabase provides automatic backups, but consider additional backups for production
5. **Monitor usage**: Keep an eye on database usage and performance metrics

## Production Considerations

1. **Database Scaling**: Consider upgrading to Pro plan for production
2. **Connection Pooling**: Use Supabase connection pooling for better performance
3. **Backup Strategy**: Set up additional backup procedures
4. **Monitoring**: Enable database monitoring and alerts
5. **Security**: Review and audit all RLS policies before production deployment

---

For additional support, refer to the [Supabase Documentation](https://supabase.com/docs) or create an issue in the project repository.
