import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

// Simple ID generator
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export default function App() {
  // Current active tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // All our data in simple state
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);

  // Form inputs for subjects
  const [subjectName, setSubjectName] = useState('');

  // Form inputs for courses
  const [courseName, setCourseName] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // Form inputs for batches
  const [batchName, setBatchName] = useState('');
  const [batchCourse, setBatchCourse] = useState('');
  const [batchStart, setBatchStart] = useState('');
  const [batchEnd, setBatchEnd] = useState('');

  // Form inputs for students
  const [studentName, setStudentName] = useState('');
  const [studentCourse, setStudentCourse] = useState('');
  const [studentBatch, setStudentBatch] = useState('');

  // ========== SUBJECT FUNCTIONS ==========
  
  function addSubject(e) {
    e.preventDefault();
    
    // Trim and check if empty
    const name = subjectName.trim();
    if (!name) {
      toast.error('Subject name is required');
      return;
    }

    // Check for duplicates (case-insensitive)
    const duplicate = subjects.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
      toast.error('Subject already exists');
      return;
    }

    // Add the subject
    const newSubject = { id: generateId(), name };
    setSubjects([...subjects, newSubject]);
    setSubjectName('');
    toast.success('Subject added!');
  }

  function deleteSubject(id) {
    // Check if subject is used in any course
    const usedInCourse = courses.find(c => c.subjectIds.includes(id));
    if (usedInCourse) {
      toast.error(`Cannot delete: Used in ${usedInCourse.name}`);
      return;
    }

    setSubjects(subjects.filter(s => s.id !== id));
    toast.success('Subject deleted');
  }

  // ========== COURSE FUNCTIONS ==========
  
  function addCourse(e) {
    e.preventDefault();

    const name = courseName.trim();
    if (!name) {
      toast.error('Course name is required');
      return;
    }

    if (selectedSubjects.length < 2) {
      toast.error('Select at least 2 subjects');
      return;
    }

    // Check for duplicates
    const duplicate = courses.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
      toast.error('Course already exists');
      return;
    }

    const newCourse = {
      id: generateId(),
      name,
      subjectIds: selectedSubjects
    };

    setCourses([...courses, newCourse]);
    setCourseName('');
    setSelectedSubjects([]);
    toast.success('Course added!');
  }

  function deleteCourse(id) {
    // Check if used in batches
    const usedInBatch = batches.find(b => b.courseId === id);
    if (usedInBatch) {
      toast.error('Cannot delete: Has batches');
      return;
    }

    // Check if used by students
    const usedByStudent = students.find(s => s.courseId === id);
    if (usedByStudent) {
      toast.error('Cannot delete: Has students');
      return;
    }

    setCourses(courses.filter(c => c.id !== id));
    toast.success('Course deleted');
  }

  function toggleSubject(subjectId) {
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter(id => id !== subjectId));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  }

  // ========== BATCH FUNCTIONS ==========
  
  function addBatch(e) {
    e.preventDefault();

    const name = batchName.trim();
    if (!name || !batchCourse || !batchStart || !batchEnd) {
      toast.error('All fields are required');
      return;
    }

    // Check time validity
    if (batchStart >= batchEnd) {
      toast.error('Start time must be before end time');
      return;
    }

    // Check for duplicate batch name in same course
    const duplicate = batches.find(
      b => b.courseId === batchCourse && b.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      toast.error('Batch name already exists for this course');
      return;
    }

    const newBatch = {
      id: generateId(),
      name,
      courseId: batchCourse,
      startTime: batchStart,
      endTime: batchEnd
    };

    setBatches([...batches, newBatch]);
    setBatchName('');
    setBatchCourse('');
    setBatchStart('');
    setBatchEnd('');
    toast.success('Batch added!');
  }

  function deleteBatch(id) {
    // Check if students are assigned
    const hasStudents = students.find(s => s.batchId === id);
    if (hasStudents) {
      toast.error('Cannot delete: Has students');
      return;
    }

    setBatches(batches.filter(b => b.id !== id));
    toast.success('Batch deleted');
  }

  // ========== STUDENT FUNCTIONS ==========
  
  function addStudent(e) {
    e.preventDefault();

    const name = studentName.trim();
    if (!name || !studentCourse || !studentBatch) {
      toast.error('All fields are required');
      return;
    }

    // Check if batch belongs to selected course
    const batch = batches.find(b => b.id === studentBatch);
    if (!batch || batch.courseId !== studentCourse) {
      toast.error('Batch does not belong to selected course');
      return;
    }

    // Check for duplicate enrollment
    const duplicate = students.find(
      s => s.name.toLowerCase() === name.toLowerCase() &&
           s.courseId === studentCourse &&
           s.batchId === studentBatch
    );
    if (duplicate) {
      toast.error('Student already enrolled in this batch');
      return;
    }

    // Check for time conflicts
    const studentBatches = students
      .filter(s => s.name.toLowerCase() === name.toLowerCase())
      .map(s => batches.find(b => b.id === s.batchId));

    const hasConflict = studentBatches.some(existingBatch => {
      if (!existingBatch) return false;
      return (
        (batch.startTime < existingBatch.endTime && batch.endTime > existingBatch.startTime)
      );
    });

    if (hasConflict) {
      toast.error('Time conflict with another batch');
      return;
    }

    const newStudent = {
      id: generateId(),
      name,
      courseId: studentCourse,
      batchId: studentBatch
    };

    setStudents([...students, newStudent]);
    setStudentName('');
    setStudentCourse('');
    setStudentBatch('');
    toast.success('Student enrolled!');
  }

  function deleteStudent(id) {
    setStudents(students.filter(s => s.id !== id));
    toast.success('Student deleted');
  }

  // Helper to get batches for a course
  function getBatchesForCourse(courseId) {
    return batches.filter(b => b.courseId === courseId);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Training Management</h1>
          <p className="text-gray-600 mt-2">Simple system to manage courses, batches, and students</p>
        </header>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('subjects')}
                className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'subjects'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Subjects
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'courses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Courses
              </button>
              <button
                onClick={() => setActiveTab('batches')}
                className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'batches'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Batches
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'students'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Students
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {/* ========== DASHBOARD TAB ========== */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-600 text-sm">Total Subjects</h3>
                <p className="text-3xl font-bold mt-2">{subjects.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-600 text-sm">Total Courses</h3>
                <p className="text-3xl font-bold mt-2">{courses.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-600 text-sm">Total Batches</h3>
                <p className="text-3xl font-bold mt-2">{batches.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-600 text-sm">Total Students</h3>
                <p className="text-3xl font-bold mt-2">{students.length}</p>
              </div>
            </div>
          )}

          {/* ========== SUBJECTS TAB ========== */}
          {activeTab === 'subjects' && (
            <>
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-bold mb-4">Add Subject</h2>
                <form onSubmit={addSubject} className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject Name
                    </label>
                    <input
                      type="text"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      placeholder="e.g., Mathematics"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">All Subjects ({subjects.length})</h2>
                {subjects.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No subjects yet</p>
                ) : (
                  <div className="space-y-2">
                    {subjects.map(subject => (
                      <div key={subject.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                        <span className="font-medium">{subject.name}</span>
                        <button
                          onClick={() => deleteSubject(subject.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ========== COURSES TAB ========== */}
          {activeTab === 'courses' && (
            <>
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-bold mb-4">Add Course</h2>
                <form onSubmit={addCourse} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Name
                    </label>
                    <input
                      type="text"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      placeholder="e.g., Web Development"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Subjects (min 2 required)
                    </label>
                    <div className="mt-2 border rounded p-4 space-y-2 max-h-40 overflow-y-auto bg-gray-50">
                      {subjects.length === 0 ? (
                        <p className="text-gray-500 text-sm">Add subjects first</p>
                      ) : (
                        subjects.map(subject => (
                          <label key={subject.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedSubjects.includes(subject.id)}
                              onChange={() => toggleSubject(subject.id)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span>{subject.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Selected: {selectedSubjects.length}</p>
                  </div>

                  <button
                    type="submit"
                    disabled={selectedSubjects.length < 2}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    Add Course
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">All Courses ({courses.length})</h2>
                {courses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No courses yet</p>
                ) : (
                  <div className="space-y-3">
                    {courses.map(course => (
                      <div key={course.id} className="border rounded p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{course.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {course.subjectIds.map(subId => {
                                const subject = subjects.find(s => s.id === subId);
                                return subject ? (
                                  <span key={subId} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                    {subject.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteCourse(course.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ========== BATCHES TAB ========== */}
          {activeTab === 'batches' && (
            <>
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-bold mb-4">Add Batch</h2>
                <form onSubmit={addBatch} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Batch Name
                      </label>
                      <input
                        type="text"
                        value={batchName}
                        onChange={(e) => setBatchName(e.target.value)}
                        placeholder="e.g., Morning Batch"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Course
                      </label>
                      <select
                        value={batchCourse}
                        onChange={(e) => setBatchCourse(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Choose course</option>
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>{course.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="datetime-local"
                        value={batchStart}
                        onChange={(e) => setBatchStart(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="datetime-local"
                        value={batchEnd}
                        onChange={(e) => setBatchEnd(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Batch
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">All Batches ({batches.length})</h2>
                {batches.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No batches yet</p>
                ) : (
                  <div className="space-y-3">
                    {batches.map(batch => {
                      const course = courses.find(c => c.id === batch.courseId);
                      return (
                        <div key={batch.id} className="border rounded p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold">{batch.name}</h3>
                              {course && (
                                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm mt-1">
                                  {course.name}
                                </span>
                              )}
                              <p className="text-sm text-gray-600 mt-2">
                                Start: {new Date(batch.startTime).toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                End: {new Date(batch.endTime).toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={() => deleteBatch(batch.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ========== STUDENTS TAB ========== */}
          {activeTab === 'students' && (
            <>
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-bold mb-4">Enroll Student</h2>
                <form onSubmit={addStudent} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g., John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Course
                      </label>
                      <select
                        value={studentCourse}
                        onChange={(e) => {
                          setStudentCourse(e.target.value);
                          setStudentBatch(''); // Reset batch when course changes
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Choose course</option>
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>{course.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Batch
                      </label>
                      <select
                        value={studentBatch}
                        onChange={(e) => setStudentBatch(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={!studentCourse}
                      >
                        <option value="">Choose batch</option>
                        {studentCourse && getBatchesForCourse(studentCourse).map(batch => (
                          <option key={batch.id} value={batch.id}>{batch.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Enroll Student
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">All Students ({students.length})</h2>
                {students.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No students yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Course</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Batch</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(student => {
                          const course = courses.find(c => c.id === student.courseId);
                          const batch = batches.find(b => b.id === student.batchId);
                          return (
                            <tr key={student.id} className="border-t hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium">{student.name}</td>
                              <td className="px-4 py-3">
                                {course ? (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                    {course.name}
                                  </span>
                                ) : 'N/A'}
                              </td>
                              <td className="px-4 py-3">
                                {batch ? (
                                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                                    {batch.name}
                                  </span>
                                ) : 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => deleteStudent(student.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}
