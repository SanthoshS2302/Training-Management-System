# 📚 Training Management System

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Tailwind
CSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-BuildTool-646CFF?logo=vite)
![Status](https://img.shields.io/badge/Status-Active-success)

A simple **in-memory Training Management System** built using **React,
Tailwind CSS, Lucide Icons, and React Hot Toast**.

This application helps manage:

-   Subjects
-   Courses
-   Batches
-   Students

> ⚠️ Note: Data is stored in React state (no backend). Data resets on
> page refresh.

------------------------------------------------------------------------

## 🚀 Live Demo

🔗 Add your deployed link here (Netlify / Vercel)

------------------------------------------------------------------------

## 📌 Table of Contents

-   [Tech Stack](#-tech-stack)
-   [Features](#-features)
-   [Data Model](#-data-model)
-   [Data Integrity](#-data-integrity)
-   [Installation](#-installation)

------------------------------------------------------------------------

## 🛠 Tech Stack

  Layer           Technology
  --------------- -----------------
  Frontend        React (Hooks)
  Styling         Tailwind CSS
  Icons           Lucide React
  Notifications   react-hot-toast
  Build Tool      Vite

------------------------------------------------------------------------

## 🚀 Features

### 📘 Subjects

-   Add subject
-   Prevent duplicates (case-insensitive)
-   Prevent deletion if linked to a course

### 🎓 Courses

-   Minimum 2 subjects required
-   Prevent duplicate course names
-   Prevent deletion if linked to batches or students

### 🕒 Batches

-   Assign to a course
-   Validate start and end time
-   Prevent duplicate batch names within same course
-   Prevent deletion if students are enrolled

### 👨‍🎓 Students

-   Enroll in course & batch
-   Prevent duplicate enrollment
-   Prevent time conflicts
-   Validate batch belongs to selected course

------------------------------------------------------------------------

## 🧱 Data Model

### Subject

    { id, name }

### Course

    { id, name, subjectIds[] }

### Batch

    { id, name, courseId, startTime, endTime }

### Student

    { id, name, courseId, batchId }

### 🔗 Relationships

-   Course → Multiple Subjects\
-   Course → Multiple Batches\
-   Batch → Multiple Students

------------------------------------------------------------------------

## 🔐 Data Integrity

-   Duplicate checks (case-insensitive)
-   Referential integrity (cannot delete referenced data)
-   Time conflict validation for students
-   Required field validation

------------------------------------------------------------------------

## ⚙️ Installation

Clone the repository:

    git clone https://github.com/your-username/training-management-system.git
    cd training-management-system

Install dependencies:

    npm install

Start development server:

    npm run dev

------------------------------------------------------------------------

## 👤 Author

**Santhosh S**\
GitHub: https://github.com/SanthoshS2302
