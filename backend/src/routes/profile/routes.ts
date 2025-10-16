import express from 'express'
import { supabase } from '../../supabaseClient';
const router = express.Router();

// Create a new profile
router.post('/', async (req, res) => {
    const { id, name, email, role } = req.body;

    try {
        
    } catch (error) {
        
    }
})




export default router;