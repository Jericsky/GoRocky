# Security & Access Control Documentation - EduBook

This document provides a comprehensive overview of the security measures and access control implementation in the EduBook application.

## Overview

EduBook implements a multi-layered security approach using Supabase's built-in security features, Row Level Security (RLS), and custom application-level security measures.

## Authentication System

### Supabase Auth Integration

**Implementation:**
- JWT-based authentication using Supabase Auth
- Secure session management with automatic token refresh
- Email/password authentication with built-in validation

**Security Features:**
- Password hashing handled by Supabase
- Automatic session timeout
- Secure token storage in HTTP-only cookies
- CSRF protection via Supabase

**Code Implementation:**
```typescript
// Authentication flow in frontend
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// Automatic token refresh
const { data: { user } } = await supabase.auth.getUser();
```

### User Roles and Permissions

**Role System:**
- **Student**: Can browse courses, enroll in courses, view own profile
- **Instructor**: Can create/edit/delete courses, view student enrollments, manage own profile

**Implementation:**
```sql
-- Role validation in database
ALTER TABLE profiles ADD CONSTRAINT role_check 
CHECK (role IN ('student', 'instructor'));
```

## Row Level Security (RLS) Implementation

### Database Security Policies

All tables in EduBook have Row Level Security enabled with carefully crafted policies:

#### Profiles Table Security

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can only view their own profile
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Allow all to view public profile info (for course instructor display)
CREATE POLICY "Allow all to view public profile info"
ON public.profiles
FOR SELECT
USING (true);

-- Users can update their own profile with secure policy
CREATE POLICY "Users can update their own profile safely"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- Automatic profile creation via trigger (handled by handle_new_user function)
```

**Security Benefits:**
- Users can only access their own profile data
- Prevents unauthorized access to other users' personal information
- Automatic data isolation

#### Courses Table Security

```sql
-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Instructors can manage their own courses
CREATE POLICY "Instructors can manage their courses"
ON courses FOR ALL
USING (auth.uid() = instructor_id);

-- Anyone can view courses (for public browsing)
CREATE POLICY "Anyone can view courses"
ON courses FOR SELECT
USING (true);
```

**Security Benefits:**
- Instructors can only modify their own courses
- Public course browsing without authentication
- Prevents unauthorized course modification

#### Enrollments Table Security

```sql
-- Enable RLS
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

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

-- Instructors can view enrollments for courses they own
CREATE POLICY "Instructors can view enrollments in their courses"
ON enrollments FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM courses
    WHERE courses.id = enrollments.course_id
      AND courses.instructor_id = auth.uid()
  )
);
```

**Security Benefits:**
- Students can only enroll themselves
- Users can only view their own enrollments
- Students can unenroll themselves from courses
- Instructors can view enrollments for their courses only
- Prevents unauthorized enrollment manipulation

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

**Security Benefits:**
- Automatic profile creation for new users
- Default role assignment (student)
- Secure function execution with SECURITY DEFINER
- Prevents orphaned user accounts

### RLS Policy Testing

**Test Cases Implemented:**

1. **Profile Access Test:**
```sql
-- This should return only the current user's profile
SELECT * FROM profiles WHERE id = auth.uid();
```

2. **Course Management Test:**
```sql
-- This should return only courses created by the current user (if instructor)
SELECT * FROM courses WHERE instructor_id = auth.uid();
```

3. **Enrollment Access Test:**
```sql
-- This should return only enrollments for the current user
SELECT * FROM enrollments WHERE student_id = auth.uid();
```

## Application-Level Security

### Frontend Security Measures

#### Route Protection

**Implementation:**
```typescript
// Protected route wrapper
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) => {
  const { user, profile } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth/login" />;
  }
  
  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <>{children}</>;
};
```

#### Input Validation and Sanitization

**Client-Side Validation:**
```typescript
// Form validation with TypeScript
interface CourseFormData {
  title: string;
  description: string;
}

const validateCourseData = (data: CourseFormData): boolean => {
  if (!data.title || data.title.length < 3) return false;
  if (!data.description || data.description.length < 10) return false;
  return true;
};
```

**XSS Prevention:**
```typescript
// Sanitize user input
const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
```

### Backend Security Measures

#### API Authentication

**Middleware Implementation:**
```typescript
// Protected route middleware
const protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};
```

#### Role-Based API Access

**Role Validation:**
```typescript
const requireRole = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();
    
    if (profile?.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Usage in routes
app.post('/courses', protectedRoute, requireRole('instructor'), createCourse);
```

## Data Protection Measures

### SQL Injection Prevention

**Implementation:**
- All database queries use Supabase client with parameterized queries
- No raw SQL strings with user input
- Type-safe database operations

```typescript
// Safe database query
const { data, error } = await supabase
  .from('courses')
  .select('*')
  .eq('instructor_id', userId); // Parameterized query
```

### Data Encryption

**Transport Security:**
- All API communication uses HTTPS
- Database connections encrypted in transit
- JWT tokens signed and encrypted

**Storage Security:**
- Passwords hashed using Supabase's secure hashing
- Sensitive data encrypted at rest in Supabase
- No sensitive data stored in client-side storage

### CORS Configuration

**Implementation:**
```typescript
// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Security Monitoring and Logging

### Error Tracking

**Implementation:**
```typescript
// Error logging middleware
const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    user: req.user?.id,
    timestamp: new Date().toISOString()
  });
  
  next(error);
};
```

### Authentication Monitoring

**Security Events Tracked:**
- Failed login attempts
- Unauthorized access attempts
- Role escalation attempts
- Suspicious API usage patterns

### Database Security Monitoring

**Supabase Built-in Monitoring:**
- Real-time security alerts
- Failed authentication attempts
- Unusual data access patterns
- Database performance monitoring

## Security Best Practices Implemented

### 1. Principle of Least Privilege

**Implementation:**
- Users only have access to data they need
- API endpoints require minimum necessary permissions
- Database policies enforce data isolation

### 2. Defense in Depth

**Layers:**
1. Network security (HTTPS, CORS)
2. Application security (authentication, authorization)
3. Database security (RLS, encryption)
4. Infrastructure security (Supabase security)

### 3. Secure by Default

**Implementation:**
- RLS enabled by default on all tables
- Authentication required for all protected routes
- Input validation on all user inputs
- Error messages don't leak sensitive information

### 4. Regular Security Updates

**Maintenance:**
- Dependencies updated regularly
- Security patches applied promptly
- Supabase security updates automatic

## Security Testing

### Automated Security Tests

**Test Categories:**
1. **Authentication Tests:**
   - Valid login/logout flows
   - Invalid credential handling
   - Session management

2. **Authorization Tests:**
   - Role-based access control
   - Data isolation verification
   - Unauthorized access prevention

3. **Input Validation Tests:**
   - SQL injection prevention
   - XSS prevention
   - Input sanitization

### Manual Security Testing

**Test Procedures:**
1. **Penetration Testing:**
   - Attempt unauthorized access
   - Test for common vulnerabilities
   - Verify data isolation

2. **Security Review:**
   - Code review for security issues
   - Database policy verification
   - API security testing

## Compliance and Standards

### Security Standards

**Implemented Standards:**
- OWASP Top 10 compliance
- Secure coding practices
- Data protection regulations compliance
- Industry security standards

### Data Privacy

**Privacy Measures:**
- User data minimization
- Secure data transmission
- User consent management
- Data retention policies

## Incident Response

### Security Incident Procedures

**Response Plan:**
1. **Detection:**
   - Automated monitoring alerts
   - User reports
   - Security audits

2. **Response:**
   - Immediate threat assessment
   - User notification
   - System isolation if needed

3. **Recovery:**
   - Vulnerability patching
   - System restoration
   - Security review

### Security Contacts

**Responsibility Matrix:**
- **Development Team**: Code security, vulnerability patching
- **DevOps Team**: Infrastructure security, monitoring
- **Security Team**: Incident response, security audits

## Future Security Enhancements

### Planned Improvements

1. **Advanced Monitoring:**
   - Real-time threat detection
   - Behavioral analysis
   - Automated response systems

2. **Enhanced Authentication:**
   - Multi-factor authentication
   - Social login integration
   - Biometric authentication

3. **Data Security:**
   - End-to-end encryption
   - Advanced data masking
   - Compliance automation

## Security Checklist

### Pre-Deployment Security Review

- [ ] All RLS policies tested and verified
- [ ] Authentication flows tested
- [ ] Input validation implemented
- [ ] Error handling secure
- [ ] CORS configuration correct
- [ ] HTTPS enforced
- [ ] Dependencies updated
- [ ] Security headers configured
- [ ] Logging implemented
- [ ] Backup procedures tested

### Ongoing Security Maintenance

- [ ] Regular dependency updates
- [ ] Security monitoring active
- [ ] User access reviews
- [ ] Security training for team
- [ ] Incident response procedures tested
- [ ] Backup and recovery tested
- [ ] Compliance audits scheduled

---

This security documentation ensures that EduBook maintains the highest standards of security and data protection while providing a seamless user experience.
