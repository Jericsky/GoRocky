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


export default router;