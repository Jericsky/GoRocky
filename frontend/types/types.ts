export interface Profile {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
}

export type Course = {
  id: string
  title: string
  description: string
  instructor_id: string
  created_at: string

  profiles?: {
    full_name: string;
  };
}

export type Enrollment = {
  id: string
  course_id: string
  student_id: string
  enrolled_at: string

  courses?: Course
  profiles?: Profile
}

export type User = {
  id: string;
  aud: string;
  role: string;
  email: string;
  phone: string;
  is_anonymous: boolean;
  confirmation_sent_at: string | null;
  confirmed_at: string | null;
  created_at: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  updated_at: string | null;

  app_metadata: {
    provider: string;
    providers: string[];
  };

  user_metadata: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
  };

  identities: Array<{
    id?: string;
    identity_data?: Record<string, any>;
    provider?: string;
    last_sign_in_at?: string;
    created_at?: string;
    updated_at?: string;
  }>;
};


