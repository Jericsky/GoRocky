import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { supabase } from './supabaseClient';
import authRoutes from './routes/auth/routes';
import courseRoutes from './routes/courses/routes';
import enrollmentRoutes from './routes/enrollments/routes';
import profileRoutes from './routes/profile/routes';
import sessionRoutes from './routes/sessions/routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

// Use the imported routes
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use('/profiles', profileRoutes);
app.use('/sessions', sessionRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the EduBook API');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;