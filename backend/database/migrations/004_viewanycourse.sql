-- Allow all authenticated users to SELECT any course
CREATE POLICY "Allow all to view courses"
ON public.courses
FOR SELECT
USING (true);
