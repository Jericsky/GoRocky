# Demo Credentials & Live Demo Setup

This document provides test account credentials and instructions for accessing the live demo of EduBook.

## Live Demo Access

**Demo URL**: [To be updated with your Vercel deployment URL]
**Status**: Ready for deployment

## Test Account Credentials

### Instructor Account
- **Email**: `santoschristianjeric@gmail.com`
- **Password**: `password123`
- **Role**: Instructor
- **Permissions**: Can create, edit, and delete courses; view student enrollments

### Student Account
- **Email**: `santoschristianjeric5844@gmail.com`
- **Password**: `password123`
- **Role**: Student
- **Permissions**: Can browse courses, enroll in courses, view enrollment history

## Demo Features to Test

### 1. Authentication Flow
1. **Login Process**:
   - Go to `/auth/login`
   - Use instructor or student credentials
   - Verify successful login and redirect

2. **Registration Process**:
   - Go to `/auth/signup`
   - Create a new account
   - Verify email confirmation (if enabled)

3. **Logout Process**:
   - Click logout in navigation
   - Verify session termination

### 2. Course Management (Instructor)
1. **Create Course**:
   - Login as instructor
   - Go to `/courses/create`
   - Fill out course form
   - Submit and verify course appears in listing

2. **Edit Course**:
   - Go to course detail page
   - Click edit button
   - Modify course information
   - Save changes

3. **Delete Course**:
   - Go to course detail page
   - Click delete button
   - Confirm deletion

4. **View Enrollments**:
   - Go to course detail page
   - View enrolled students
   - Check enrollment statistics

### 3. Course Discovery (Student)
1. **Browse Courses**:
   - Login as student
   - Go to `/courses`
   - Browse available courses
   - Use search/filter functionality

2. **View Course Details**:
   - Click on any course
   - Review course information
   - Check instructor details

3. **Enroll in Course**:
   - Go to course detail page
   - Click enroll button
   - Verify enrollment confirmation

### 4. Profile Management
1. **View Profile**:
   - Go to `/profile`
   - Review user information
   - Check role and permissions

2. **Update Profile**:
   - Edit full name
   - Save changes
   - Verify updates

### 5. Enrollment Management
1. **View Enrollments**:
   - Go to `/enrollments`
   - Review enrolled courses
   - Check enrollment dates

2. **Enrollment History**:
   - Verify enrollment tracking
   - Check course progress (if implemented)

## Demo Data Setup

### Sample Courses (Pre-populated)
The demo includes the following sample courses:

1. **Introduction to Web Development**
   - Instructor: Jeric Santos Pahati
   - Description: Learn HTML, CSS, and JavaScript fundamentals
   - Status: Active

2. **Advanced JavaScript Techniques**
   - Instructor: Jeric Santos Pahati
   - Description: Deep dive into ES6+, asynchronous programming, and modern JavaScript patterns to write cleaner and more.
   - Status: Active

3. **React.js for Beginners**
   - Instructor: Jeric Santos Pahati
   - Description: Master the fundamentals of React.js 
   - Status: Active

4. **Backend Development with Node.js and Express**
   - Instructor: Jeric Santos Pahati
   - Description: Build scalable REST APIs using Node.js and Express
   - Status: Active

### Sample Enrollments
- John Dow is enrolled in "Introduction to Web Development"
- Additional enrollments can be created during demo
- Students can unenroll themselves from courses
- Instructors can view all enrollments for their courses

## Demo Scenarios

### Scenario 1: New Student Experience
1. Register new student account
2. Browse available courses
3. Enroll in multiple courses
4. View enrollment history
5. Update profile information

### Scenario 2: Instructor Experience
1. Login as instructor
2. Create new course
3. View student enrollments
4. Edit course information
5. Monitor course statistics

### Scenario 3: Course Discovery
1. Browse courses without login
2. Login to enroll
3. Complete enrollment process
4. View enrolled courses

### Scenario 4: Enrollment Management
1. Login as student
2. View current enrollments
3. Unenroll from a course
4. Verify enrollment removal
5. Login as instructor and view enrollment changes

## Demo Environment Configuration

### Frontend Configuration
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-demo-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-demo-anon-key
```

### Backend Configuration
```env
SUPABASE_URL=https://your-demo-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-demo-service-role-key
PORT=8000
NODE_ENV=production
```

### Database Configuration
- Demo database with sample data
- RLS policies enabled
- Test users pre-configured
- Sample courses populated

## Demo Limitations

### Free Tier Limitations
- Supabase free tier has usage limits
- Vercel free tier has bandwidth limits
- Some features may be rate-limited

### Demo Data
- Demo data is reset periodically
- User accounts may be cleaned up
- Courses and enrollments are for demonstration only

## Demo Support

### Troubleshooting
1. **Login Issues**:
   - Verify credentials are correct
   - Check if account exists in database
   - Clear browser cache and cookies

2. **Course Issues**:
   - Verify instructor permissions
   - Check course data in database
   - Refresh page and try again

3. **Enrollment Issues**:
   - Verify student role
   - Check enrollment constraints
   - Verify course exists

### Demo Reset
If demo data becomes corrupted:
1. Reset database to initial state
2. Re-run seed scripts
3. Verify test accounts work
4. Check all functionality

## Demo Feedback

### What to Test
- User interface responsiveness
- Feature completeness
- Performance under load
- Cross-browser compatibility
- Mobile device compatibility

### Feedback Collection
- User experience feedback
- Feature suggestions
- Bug reports
- Performance issues
- Security concerns

## Demo Deployment Checklist

### Pre-Deployment
- [ ] All features tested locally
- [ ] Demo data prepared
- [ ] Test accounts configured
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Security policies verified

### Post-Deployment
- [ ] Demo URL accessible
- [ ] All test accounts work
- [ ] Sample data visible
- [ ] All features functional
- [ ] Performance acceptable
- [ ] Security measures active

### Ongoing Maintenance
- [ ] Monitor demo usage
- [ ] Reset data as needed
- [ ] Update demo content
- [ ] Fix any issues
- [ ] Keep demo current

---

## Quick Demo Script

### 5-Minute Demo Flow
1. **Login as Student** (1 minute)
   - Show course browsing
   - Demonstrate enrollment

2. **Login as Instructor** (2 minutes)
   - Create new course
   - Show course management

3. **Show Features** (2 minutes)
   - Profile management
   - Enrollment history
   - Responsive design

### 15-Minute Demo Flow
1. **Authentication** (2 minutes)
   - Registration process
   - Login/logout flow

2. **Student Experience** (5 minutes)
   - Course discovery
   - Enrollment process
   - Profile management

3. **Instructor Experience** (5 minutes)
   - Course creation
   - Student management
   - Course editing

4. **Technical Features** (3 minutes)
   - Real-time updates
   - Security features
   - Mobile responsiveness

This demo setup ensures that all stakeholders can thoroughly test and evaluate the EduBook application's capabilities.
