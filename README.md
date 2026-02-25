Training Management System

A simple in-memory Training Management System built using React + Tailwind CSS + Lucide Icons + React Hot Toast.

This application allows management of:

Subjects

Courses

Batches

Students

All data is handled using React state (no backend).

🚀 Live Demo

👉 Add your deployed link here (Netlify / Vercel)

🛠 Tech Stack
Layer	            Technology
Frontend	        React (Functional Components + Hooks)
Styling 	        Tailwind CSS
Icons	            Lucide React
Notifications   	react-hot-toast
Build Tool      	Vite

🚀 Features
Subjects

Add subject

Prevent duplicates

Prevent deletion if used in course

Courses

Minimum 2 subjects required

Prevent duplicate courses

Prevent deletion if used in batch or by students

Batches

Assign to course

Validate start & end time

Prevent duplicate batch names per course

Prevent deletion if students exist

Students

Enroll in course & batch

Prevent duplicate enrollment

Prevent time conflicts

Validate batch belongs to selected course

🧱 Data Model

Subject

{ id, name }

Course

{ id, name, subjectIds[] }

Batch

{ id, name, courseId, startTime, endTime }

Student

{ id, name, courseId, batchId }

Relationships:

Course → Multiple Subjects

Course → Multiple Batches

Batch → Multiple Students

🔐 Data Integrity

Duplicate checks (case-insensitive)

Referential integrity (cannot delete referenced data)

Time conflict validation for students

Required field validation

Clone the repository:

git clone https://github.com/your-username/training-management-system.git
cd training-management-system

Install dependencies:

npm install

Start development server:

npm run dev