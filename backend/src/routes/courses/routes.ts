import { Router } from 'express';
import { supabase } from '../../supabaseClient';
import { protectedRoute } from '../../middleware/protectedRoute';
const router = Router();

// Create Course
router.post('/', protectedRoute, async (req, res) => {
    const { title, description, instructor_id } = req.body;

    try {
        if (!title || !description || !instructor_id) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Insert course into 'courses' table
        const { data: course, error } = await supabase
            .from('courses')
            .insert([{ title, description, instructor_id }])
            .select();

        if (error) {
            console.error("Course creation error:", error);
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
        console.error("Course creation error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get All Courses
router.get('/', async (req, res) => {
    try {
        const { data, error} = await supabase
            .from('courses')
            .select('*, profiles ( id, full_name )'); // Join with profiles to get instructor name

        if(error) return res.status(400).json({ error: error.message });

        res.status(200).json({ courses: data });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Course by ID
router.get('/:id', protectedRoute, async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('courses')
            .select('*, profiles ( full_name )') // Join with profiles to get instructor name
            .eq('id', id)
            .single();
        
        if(error) return res.status(400).json({ error: error.message });

        if(!data) return res.status(404).json({ error: 'Course not found' });

        res.status(200).json({ course: data });
    } catch (error) {
        
    }
});

// Update Course
router.put('/:id', protectedRoute, async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required" });
        }

        // Update course in 'courses' table
        const { data: course, error } = await supabase
            .from('courses')
            .update({ title, description })
            .eq('id', id)
            .select();

        if (error) {
            console.error("Course update error:", error);
            return res.status(400).json({ error: error.message });
        }

        if (!course || course.length === 0) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.status(200).json({ message: "Course updated successfully", course });
    } catch (error) {
        console.error("Course update error:", error);
        res.status(500).json({ error: "Internal server error" });
    } 
});

// Delete Course
router.delete('/:id', protectedRoute, async (req, res) => {
    const { id } = req.params;

    try {
        // Delete course from 'courses' table
        const { data, error } = await supabase
            .from('courses')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error("Course deletion error:", error);
            return res.status(400).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Course deletion error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


export default router;