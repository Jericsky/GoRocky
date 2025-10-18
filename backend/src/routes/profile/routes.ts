import express from 'express'
import { supabase } from '../../supabaseClient';
const router = express.Router();

// Get all profiles
router.get('/', async (req, res) => {
    try {
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id, full_name, role, created_at');

        if (error) {
            console.error("Error fetching profiles:", error);
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ profiles });
    } catch (error) {
        console.error("Error fetching profiles:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get profile by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, full_name, role, created_at')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching profile:", error);
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ profile });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update profile
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, role } = req.body;

        const { data: updatedProfile, error } = await supabase
            .from('profiles')
            .update({ full_name, role })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error updating profile:", error);
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: "Profile updated successfully", profile: updatedProfile });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


export default router;