import express from 'express';
import { supabase } from '../../supabaseClient';

const router = express.Router();

// Create a new user and profile
router.post("/signup", async (req, res) => {
  const { email, password, full_name, role } = req.body;

  try {
    if (!email || !password || !full_name || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!["student", "instructor"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) return res.status(400).json({ error: authError.message });

    const userId = authData.user?.id;
    if (!userId)
      return res.status(500).json({ error: "Failed to retrieve user ID" });

    // Create profile record in 'profiles' table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: userId, full_name, role }])
      .select();

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return res.status(400).json({ error: profileError.message });
    }
    console.log("Profile created:", profile);

    res.status(201).json({
      message: "Signup successful!",
      user: {
        id: userId,
        email,
        full_name,
        role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;






