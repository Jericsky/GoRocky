
-- Student can delete their own enrollment
CREATE POLICY "Students can unenroll themselves"
ON enrollments
FOR DELETE
USING (student_id = auth.uid());