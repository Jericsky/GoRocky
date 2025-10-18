import express from 'express';
import { supabase } from '../../supabaseClient';
import jwt from 'jsonwebtoken';
import { generateToken } from '../../middleware/utils';

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
    // Generate JWT token and set it in HTTP-only cookie
    generateToken(userId, res);
    res.status(201).json({
      message: "Signup successful! Please verify your email before logging in.",
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

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Authenticate user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) return res.status(400).json({ error: authError.message });

    if (!authData.user) {
      return res.status(400).json({ error: "Invalid login credentials" });
    }

    // Fetch user profile from 'profiles' table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return res.status(400).json({ error: profileError.message });
    }

    // Generate JWT token and set it in HTTP-only cookie
    const token = generateToken(authData.user.id, res);
    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: profile.full_name,
        role: profile.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout user
router.post("/logout", async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return res.status(400).json({ error: error.message });
    
    res.cookie('jwt', '', { maxAge: 0 }); // Clear the cookie

    res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;






