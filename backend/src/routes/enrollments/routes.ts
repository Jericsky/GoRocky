import { Router } from 'express';
const router = Router();
import { supabase } from '../../supabaseClient';
import { protectedRoute } from '../../middleware/protectedRoute';

// Enroll in a course
router.post('/', protectedRoute, async (req, res) => {
    const { course_id, student_id } = req.body;

    try {
        if (!student_id || !course_id) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if the enrollment already exists
        const { data: existingEnrollment, error: existingError } = await supabase
            .from('enrollments')
            .select('*, courses( title ), profiles( full_name )')
            .eq('course_id', course_id)
            .eq('student_id', student_id)
            .single();

        if (existingError && existingError.code !== 'PGRST116') {
            console.error("Error checking existing enrollment:", existingError);
            return res.status(400).json({ error: existingError.message });
        }

        if (existingEnrollment) {
            return res.status(400).json({ error: "User is already enrolled in this course" });
        }

        // Insert enrollment into 'enrollments' table
        const { data: enrollment, error } = await supabase
            .from('enrollments')
            .insert([{ course_id, student_id}])
            .select();

        if (error) {
            console.error("Enrollment error:", error);
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({ message: "Enrolled successfully", enrollment });
    } catch (error) {
        console.error("Enrollment error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get enrollments for a student
router.get('/student/:student_id', protectedRoute, async (req, res) => {
    try {
        const { student_id } = req.params;

        const { data: enrollments, error } = await supabase
            .from('enrollments')
            .select('*, courses( title, description ), profiles( full_name )')
            .eq('student_id', student_id);
            
        if (error) {
            console.error("Error fetching enrollments:", error);
            return res.status(400).json({ error: error.message });
        }   

        res.status(200).json({ enrollments });
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get all enrollments
router.get('/', protectedRoute,  async (req, res) => {
    try {
        const { data: enrollments, error } = await supabase
            .from('enrollments')
            .select('*, courses( title ), profiles( full_name )');

        if (error) {
            console.error("Error fetching enrollments:", error);
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ enrollments });
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get all intructor enrollments
router.get('/instructor/:instructor_id', protectedRoute, async (req, res) => {
    try {
        const { instructor_id } = req.params;

        // Fetch courses by this instructor
        const { data: coursesData, error: coursesError } = await supabase
            .from('courses')
            .select('id')
            .eq('instructor_id', instructor_id);

        if (coursesError) {
            console.error("Error fetching courses:", coursesError);
            return res.status(400).json({ error: coursesError.message });
        }

        const courseIds = coursesData?.map(c => c.id) || [];

        // Fetch enrollments for these courses
        const { data: enrollments, error: enrollmentsError } = await supabase
            .from('enrollments')
            .select('*, profiles( full_name ), courses( title )')
            .in('course_id', courseIds);

        if (enrollmentsError) {
            console.error("Error fetching enrollments:", enrollmentsError);
            return res.status(400).json({ error: enrollmentsError.message });
        }

        res.status(200).json({ enrollments });
    } catch (error) {
        console.error("Error fetching instructor enrollments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get enrollment by Course ID 
router.get('/course/:course_id', protectedRoute, async (req, res) => {
    try {
        const { course_id } = req.params;

        const { data: enrollments, error } = await supabase
            .from('enrollments')
            .select('*, profiles( full_name )')
            .eq('course_id', course_id);

        if (error) {
            console.error("Error fetching enrollments by course ID:", error);
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ enrollments });
    } catch (error) {
        console.error("Error fetching enrollments by course ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete an enrollment
router.delete('/:id', protectedRoute, async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('enrollments')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting enrollment:", error);
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: "Enrollment deleted successfully" });
    } catch (error) {
        console.error("Error deleting enrollment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


export default router;