import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { ClassManager } from './components/ClassManager';
import { StudentTracker } from './components/StudentTracker';
import { TaskManager } from './components/TaskManager';
import { ReportsDashboard } from './components/ReportsDashboard';
import { ViewMode, ScheduleSlot, ClassGroup, Student, Task } from './types';
import { INITIAL_CLASSES, INITIAL_SCHEDULE } from './constants';
import { Moon, Sun } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('schedule');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // App State
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(INITIAL_SCHEDULE);
  const [classes, setClasses] = useState<ClassGroup[]>(INITIAL_CLASSES);
  const [tasks, setTasks] = useState<Task[]>([
      { id: '1', text: 'تحضير درس الرياضيات ليوم الأحد', completed: false, priority: 'high' },
      { id: '2', text: 'رصد درجات الاختبار الشهري', completed: true, priority: 'medium' }
  ]);

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- Schedule Handlers ---
  const handleUpdateSchedule = (updatedSlot: ScheduleSlot) => {
    setSchedule(prev => prev.map(slot => 
        (slot.day === updatedSlot.day && slot.period === updatedSlot.period) 
        ? updatedSlot 
        : slot
    ));
  };

  // --- Class Handlers ---
  const handleAddClass = (name: string) => {
    const newClass: ClassGroup = {
        id: Math.random().toString(36).substring(2),
        name,
        students: []
    };
    setClasses([...classes, newClass]);
  };

  const handleDeleteClass = (id: string) => {
      setClasses(classes.filter(c => c.id !== id));
  };

  // --- Student Handlers ---
  const handleAddStudent = (classId: string, name: string) => {
      setClasses(classes.map(c => {
          if (c.id === classId) {
              return {
                  ...c,
                  students: [...c.students, {
                      id: Math.random().toString(36).substring(2),
                      name,
                      notes: '',
                      attendance: {},
                      participationScore: 10
                  }]
              };
          }
          return c;
      }));
  };

  const handleImportStudents = (classId: string, names: string[]) => {
    setClasses(classes.map(c => {
        if (c.id === classId) {
            const newStudents: Student[] = names.map(name => ({
                id: Math.random().toString(36).substring(2) + Math.random(),
                name,
                notes: '',
                attendance: {},
                participationScore: 10
            }));
            return {
                ...c,
                students: [...c.students, ...newStudents]
            };
        }
        return c;
    }));
  };

  const handleDeleteStudent = (classId: string, studentId: string) => {
      setClasses(classes.map(c => {
          if (c.id === classId) {
              return {
                  ...c,
                  students: c.students.filter(s => s.id !== studentId)
              };
          }
          return c;
      }));
  };

  const handleUpdateStudent = (classId: string, updatedStudent: Student) => {
      setClasses(classes.map(c => {
          if (c.id === classId) {
              return {
                  ...c,
                  students: c.students.map(s => s.id === updatedStudent.id ? updatedStudent : s)
              };
          }
          return c;
      }));
  };

  // --- Task Handlers ---
  const handleAddTask = (text: string, priority: 'high' | 'medium' | 'low', date?: string) => {
      const newTask: Task = {
          id: Math.random().toString(36).substring(2),
          text,
          completed: false,
          priority,
          dueDate: date
      };
      setTasks([...tasks, newTask]);
  };

  const handleToggleTask = (id: string) => {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: string) => {
      setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="flex h-[100dvh] bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden flex-col lg:flex-row transition-colors duration-300">
      {/* Mobile Header */}
      <div className="lg:hidden h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0 z-30 sticky top-0 shadow-sm">
        <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 transform rotate-3">
                <span className="text-white font-bold text-lg">م</span>
            </div>
            <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">معلم AI</span>
        </div>
        <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      {/* Main Content */}
      <main className="flex-1 h-full overflow-hidden relative flex flex-col">
        {/* Banner Section - Updated Image */}
        <div className="h-32 md:h-48 relative w-full shrink-0 overflow-hidden group">
            <img 
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop" 
                alt="Modern Classroom Banner" 
                className="w-full h-full object-cover object-center opacity-90 dark:opacity-60 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent"></div>
            
            {/* Desktop Dark Mode Toggle (Absolute positioned on Banner) */}
            <div className="absolute top-4 left-4 hidden lg:block">
                <button 
                    onClick={() => setIsDarkMode(!isDarkMode)} 
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md text-slate-800 dark:text-white shadow-lg transition-all hover:scale-105 border border-white/20"
                >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span className="text-sm font-bold">{isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
                </button>
            </div>
        </div>

        <div className="flex-1 container mx-auto max-w-7xl lg:p-0 animate-in fade-in duration-500 slide-in-from-bottom-2 overflow-hidden flex flex-col -mt-8 relative z-10">
            <div className="flex-1 h-full overflow-hidden">
                 {currentView === 'schedule' && (
                    <WeeklyPlanner 
                        schedule={schedule} 
                        classes={classes}
                        updateSchedule={handleUpdateSchedule} 
                    />
                )}
                {currentView === 'classes' && (
                    <ClassManager 
                        classes={classes}
                        addClass={handleAddClass}
                        deleteClass={handleDeleteClass}
                        addStudent={handleAddStudent}
                        importStudents={handleImportStudents}
                        deleteStudent={handleDeleteStudent}
                    />
                )}
                {currentView === 'tracker' && (
                    <StudentTracker 
                        classes={classes}
                        updateStudent={handleUpdateStudent}
                    />
                )}
                {currentView === 'tasks' && (
                    <TaskManager 
                        tasks={tasks}
                        addTask={handleAddTask}
                        toggleTask={handleToggleTask}
                        deleteTask={handleDeleteTask}
                    />
                )}
                {currentView === 'reports' && (
                    <ReportsDashboard 
                        classes={classes}
                        schedule={schedule}
                    />
                )}
            </div>
        </div>
      </main>
    </div>
  );
}

export default App;