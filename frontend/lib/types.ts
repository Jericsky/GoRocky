// lib/types.ts
export type UserProfile = {
  id: string
  full_name: string
  email: string
  role: 'student' | 'instructor'
  created_at: string
}

export type Course = {
  id: string
  title: string
  description: string
  instructor_id: string
  created_at: string
}

export type Enrollment = {
  id: string
  course_id: string
  student_id: string
  enrolled_at: string
}
