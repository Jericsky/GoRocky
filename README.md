# EduBook - School Course Booking System

![EduBook Logo]

A modern, full-stack course booking and enrollment system built with Next.js, Supabase, and Express.js. EduBook allows students to discover and enroll in courses while providing instructors with tools to create and manage their educational content.

## 🎯 Project Overview

EduBook is a comprehensive learning management system that facilitates course discovery, enrollment, and management. The platform features role-based access control, real-time data synchronization, and a responsive design optimized for both desktop and mobile devices.

### Key Features
- **User Authentication**: Secure login/signup with Supabase Auth
- **Role-Based Access**: Separate experiences for students and instructors
- **Course Management**: Create, edit, and manage courses (instructors)
- **Course Discovery**: Browse and search available courses
- **Enrollment System**: One-click course enrollment for students
- **Profile Management**: Update user profiles and view enrollment history
- **Responsive Design**: Mobile-first design with DaisyUI components

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, DaisyUI
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (Frontend), Railway/Render (Backend)

## 📊 Data Model

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   auth.users    │       │    profiles     │       │    courses      │
│                 │       │                 │       │                 │
│ id (uuid) PK    │◄──────┤ id (uuid) PK    │◄──────┤ id (uuid) PK    │
│ email           │       │ full_name       │       │ title           │
│ password        │       │ role            │       │ description     │
│ created_at      │       │ created_at      │       │ instructor_id   │
└─────────────────┘       └─────────────────┘       │ created_at      │
                              │                      └─────────────────┘
                              │                              │
                              │                      ┌─────────────────┐
                              │                      │  enrollments    │
                              └─────────────────────►│                 │
                                                     │ id (uuid) PK    │
                                                     │ course_id FK    │
                                                     │ student_id FK   │
                                                     │ enrolled_at     │
                                                     └─────────────────┘
```

### Database Schema

**profiles**
- `id` (uuid, PK) - References auth.users(id)
- `full_name` (text) - User's display name
- `role` (text) - Either 'student' or 'instructor'
- `created_at` (timestamp) - Account creation date

**courses**
- `id` (uuid, PK) - Unique course identifier
- `title` (text) - Course name
- `description` (text) - Course description
- `instructor_id` (uuid, FK) - References profiles(id)
- `created_at` (timestamp) - Course creation date

**enrollments**
- `id` (uuid, PK) - Unique enrollment identifier
- `course_id` (uuid, FK) - References courses(id)
- `student_id` (uuid, FK) - References profiles(id)
- `instructor_id` (uuid, FK) - References profiles(id) - Added for easier querying
- `enrolled_at` (timestamp) - Enrollment date
- Unique constraint on (course_id, student_id)

## 🚀 Local Setup Guide

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- Supabase account

### Environment Variables

Create `.env.local` files in both `frontend/` and `backend/` directories:

**Frontend (.env.local)**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend (.env)**
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=8000
```

### Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Run Database Migrations**
   ```bash
   # Navigate to backend directory
   cd backend/database/migrations
   
   # Execute migrations in order:
   # 1. Create tables and RLS policies
   psql -h your-db-host -U postgres -d postgres -f 001_init.sql
   
   # 2. Insert sample data
   psql -h your-db-host -U postgres -d postgres -f 002_seed.sql
   
   # 3. Additional policies (optional)
   psql -h your-db-host -U postgres -d postgres -f 003_viewcourses.sql
   ```

3. **Sample Data**
   The seed file includes:
   - Sample instructor: Alice Instructor (role: instructor)
   - Sample student: Bob Student (role: student)

### Development Server Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/Jericsky/GoRocky
   cd edubook
   ```

2. **Install Dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Run Development Servers**
   
   **Terminal 1 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will be available at http://localhost:3000
   
   **Terminal 2 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   Backend API will be available at http://localhost:8000

4. **Access the Application**
   - Open http://localhost:3000 in your browser
   - Use the sample credentials or create new accounts

## 🎯 Feature Mapping

### Core Requirements Implementation

| Feature | Status | Implementation | Location |
|---------|--------|----------------|----------|
| User Authentication | ✅ | Supabase Auth integration | `/frontend/app/auth/` |
| User Registration | ✅ | Signup form with validation | `/frontend/app/auth/signup/` |
| User Login | ✅ | Login form with error handling | `/frontend/app/auth/login/` |
| Role-Based Access | ✅ | Student/Instructor roles | Database schema + UI logic |
| Course Creation | ✅ | Instructor-only course creation | `/frontend/app/courses/create/` |
| Course Listing | ✅ | Public course browsing | `/frontend/app/courses/` |
| Course Enrollment | ✅ | Student enrollment system | `/frontend/app/courses/[id]/` |
| Profile Management | ✅ | User profile CRUD | `/frontend/app/profile/` |
| Enrollment History | ✅ | Student enrollment tracking | `/frontend/app/enrollments/` |
| Instructor Dashboard | ✅ | Course management for instructors | Multiple components |

### Additional Features

| Feature | Status | Implementation | Notes |
|---------|--------|----------------|-------|
| Responsive Design | ✅ | Mobile-first with DaisyUI | All pages responsive |
| Real-time Updates | ✅ | Supabase real-time subscriptions | Course updates |
| Error Handling | ✅ | Toast notifications | User feedback |
| Loading States | ✅ | Loading components | Better UX |
| Navigation | ✅ | Role-based navigation | NavBar component |

## 🔒 Access Control Notes

### Row Level Security (RLS) Implementation

EduBook implements comprehensive Row Level Security policies in Supabase:

#### Profiles Table
```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Allow all to view public profile info (for instructor display)
CREATE POLICY "Allow all to view public profile info"
ON public.profiles FOR SELECT
USING (true);

-- Users can update their own profile securely
CREATE POLICY "Users can update their own profile safely"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));
```

#### Courses Table
```sql
-- Instructors can manage their own courses
CREATE POLICY "Instructors can manage their courses"
ON courses FOR ALL
USING (auth.uid() = instructor_id);

-- Anyone can view courses (for public browsing)
CREATE POLICY "Allow all to view courses"
ON public.courses FOR SELECT
USING (true);
```

#### Enrollments Table
```sql
-- Students can enroll themselves
CREATE POLICY "Students can enroll themselves"
ON enrollments FOR INSERT
WITH CHECK (auth.uid() = student_id);

-- Users can view their own enrollments
CREATE POLICY "Users can view their enrollments"
ON enrollments FOR SELECT
USING (auth.uid() = student_id);

-- Students can unenroll themselves
CREATE POLICY "Students can unenroll themselves"
ON enrollments FOR DELETE
USING (student_id = auth.uid());

-- Instructors can view enrollments in their courses
CREATE POLICY "Instructors can view enrollments in their courses"
ON enrollments FOR SELECT
USING (EXISTS (SELECT 1 FROM courses WHERE courses.id = enrollments.course_id AND courses.instructor_id = auth.uid()));
```

### Automatic Profile Creation

EduBook includes an automatic profile creation system that ensures every new user gets a proper profile:

```sql
-- Function to create profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    'student'  -- Default role for new users
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger that calls the function after every new auth signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### Security Features
- **Authentication**: JWT-based authentication via Supabase Auth
- **Authorization**: Role-based access control (RBAC)
- **Data Isolation**: Users can only access their own data
- **Automatic Profile Creation**: New users get profiles automatically
- **SQL Injection Protection**: Parameterized queries via Supabase client
- **CORS Configuration**: Proper CORS setup for API endpoints

## 🤖 AI Tools Used

### Development Tools
- **Cursor AI**: Primary IDE with AI-assisted coding
  - Code completion and suggestions
  - Refactoring assistance
  - Bug detection and fixes
  - Component generation

### Specific Usage
1. **Code Generation**: Used Cursor AI to generate boilerplate components and API routes
2. **Database Design**: Claude assisted in designing the RLS policies and schema relationships
3. **UI/UX**: AI tools helped optimize the responsive design and user experience
4. **Documentation**: This README was generated with AI assistance for comprehensive coverage
5. **Error Handling**: AI helped implement robust error handling patterns
6. **TypeScript**: AI assisted with type definitions and interface design

### Benefits Achieved
- Faster development cycles
- Improved code quality and consistency
- Better error handling patterns
- Comprehensive documentation
- Optimized database queries and security policies

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Render)
1. Connect GitHub repository
2. Set environment variables
3. Configure build and start commands
4. Deploy automatically

### Database
- Supabase provides managed PostgreSQL database
- Automatic backups and scaling
- Built-in authentication and real-time features

## 📱 Live Demo

**Demo URL**: go-rocky-ny29.vercel.app

### Test Account Credentials

**Instructor Account:**
- Email: `santoschristianjeric@gmail.com`
- Password: `password123`
- Role: Instructor (can create and manage courses)

**Student Account:**
- Email: `santoschristianjeric5844@gmail.com`
- Password: `password123`
- Role: Student (can browse and enroll in courses)

### Demo Features to Test
1. **Authentication**: Login with test accounts
2. **Course Creation**: Login as instructor and create a course
3. **Course Enrollment**: Login as student and enroll in courses
4. **Profile Management**: Update user profiles
5. **Enrollment History**: View enrolled courses
6. **Responsive Design**: Test on mobile and desktop

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with ❤️ using Next.js, Supabase, and AI-assisted development**
