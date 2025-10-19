CREATE POLICY "Allow all to view public profile info"
ON public.profiles
FOR SELECT
USING (true);
