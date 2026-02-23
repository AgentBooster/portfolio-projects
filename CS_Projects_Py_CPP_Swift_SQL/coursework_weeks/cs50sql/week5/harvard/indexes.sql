CREATE INDEX "enrollments_student_id"
ON "enrollments"("student_id");

CREATE INDEX "enrollments_course_id"
ON "enrollments"("course_id");

CREATE INDEX "courses_department_semester_number"
ON "courses"("department", "semester", "number");

CREATE INDEX "courses_title_semester"
ON "courses"("title", "semester");

CREATE INDEX "courses_semester"
ON "courses"("semester");

CREATE INDEX "satisfies_course_id"
ON "satisfies"("course_id");
