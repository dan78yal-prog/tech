import React, { useState } from 'react';
import { ClassGroup, Student } from '../types';
import { ClipboardList, Star, AlertCircle, CheckCircle, Clock, Save, MoreHorizontal, Trophy, Users, Search, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface StudentTrackerProps {
  classes: ClassGroup[];
  updateStudent: (classId: string, student: Student) => void;
}

export const StudentTracker: React.FC<StudentTrackerProps> = ({ classes, updateStudent }) => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(classes[0]?.id || null);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeClass = classes.find(c => c.id === selectedClassId);

  // Filter students
  const filteredStudents = activeClass 
    ? activeClass.students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleAttendance = (student: Student, status: 'present' | 'absent' | 'late' | 'excused') => {
    if (!activeClass) return;
    const updatedStudent = {
        ...student,
        attendance: {
            ...student.attendance,
            [currentDate]: status
        }
    };
    updateStudent(activeClass.id, updatedStudent);
  };

  const handleScore = (student: Student, delta: number) => {
      if (!activeClass) return;
      const newScore = Math.min(10, Math.max(0, student.participationScore + delta));
      const updatedStudent = { ...student, participationScore: newScore };
      updateStudent(activeClass.id, updatedStudent);
  };

  const handleNoteChange = (student: Student, note: string) => {
      if (!activeClass) return;
      updateStudent(activeClass.id, { ...student, notes: note });
  };

  const getScoreColor = (score: number) => {
      if (score >= 8) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
      if (score >= 5) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  const changeDate = (days: number) => {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + days);
      setCurrentDate(date.toISOString().split('T')[0]);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 overflow-y-auto pb-24 lg:pb-6 custom-scrollbar">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 rounded-xl shadow-lg shadow-emerald-500/30">
                    <Trophy className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">المتابعة والتقييم</h2>
                    {/* Date Navigation */}
                    <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => changeDate(-1)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-slate-500 dark:text-slate-400" />
                        </button>
                        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm flex items-center gap-1 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                            <CalendarIcon className="w-3 h-3" />
                            {currentDate}
                        </p>
                         <button onClick={() => changeDate(1)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-slate-500 dark:text-slate-400" />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Student Search Bar in Tracker */}
            <div className="relative w-full md:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="ابحث عن طالب..."
                    className="w-full pl-3 pr-9 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
            {classes.map(c => (
                <button
                    key={c.id}
                    onClick={() => {
                        setSelectedClassId(c.id);
                        setSearchQuery('');
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 transform whitespace-nowrap border ${
                        selectedClassId === c.id 
                        ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-slate-800 dark:border-white shadow-lg scale-105' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                >
                    {c.name}
                </button>
            ))}
        </div>
      </div>

      {activeClass ? (
        <div className="bg-transparent md:bg-white/80 md:dark:bg-slate-900/80 md:backdrop-blur-sm md:rounded-2xl md:shadow-sm md:border md:border-slate-200 md:dark:border-slate-800 overflow-hidden">
            {/* Desktop Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-slate-50/80 dark:bg-slate-800/80 p-5 border-b border-slate-100 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 text-sm">
                <div className="col-span-3">الطالب</div>
                <div className="col-span-4 text-center">التحضير ({currentDate})</div>
                <div className="col-span-2 text-center">النقاط (10)</div>
                <div className="col-span-3">ملاحظات</div>
            </div>
            
            <div className="space-y-3 md:space-y-0 md:divide-y md:divide-slate-100 dark:divide-slate-800 min-h-[300px]">
                {filteredStudents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-600">
                        <Search className="w-8 h-8 mb-2 opacity-50" />
                        <p>لا توجد نتائج</p>
                    </div>
                ) : (
                    filteredStudents.map((student, idx) => {
                    const status = student.attendance[currentDate];
                    return (
                        <div key={student.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm md:shadow-none md:border-0 md:rounded-none md:p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                            {/* Name Section */}
                            <div className="col-span-1 md:col-span-3 flex items-center justify-between md:justify-start gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 border border-white dark:border-slate-600 shadow-sm flex items-center justify-center text-sm md:text-xs font-bold text-slate-700 dark:text-slate-200 shrink-0">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base truncate">{student.name}</span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden md:inline-block">رقم {idx + 1}</span>
                                    </div>
                                </div>
                                <div className={`md:hidden flex items-center justify-center w-8 h-8 rounded-full border text-sm font-bold ${getScoreColor(student.participationScore)}`}>
                                    {student.participationScore}
                                </div>
                            </div>
                            
                            {/* Attendance Section */}
                            <div className="col-span-1 md:col-span-4 flex justify-between md:justify-center gap-2 bg-slate-50/50 dark:bg-slate-900/50 p-1.5 rounded-xl md:bg-transparent md:p-0">
                                <button 
                                    onClick={() => handleAttendance(student, 'present')}
                                    className={`flex-1 md:flex-none flex items-center justify-center gap-1 p-2 md:p-2 rounded-lg md:rounded-full transition-all duration-200 active:scale-90 ${
                                        status === 'present' 
                                        ? 'bg-green-500 text-white shadow-md shadow-green-500/20' 
                                        : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="md:hidden text-xs font-bold">حاضر</span>
                                </button>
                                <button 
                                    onClick={() => handleAttendance(student, 'late')}
                                    className={`flex-1 md:flex-none flex items-center justify-center gap-1 p-2 md:p-2 rounded-lg md:rounded-full transition-all duration-200 active:scale-90 ${
                                        status === 'late' 
                                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' 
                                        : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <Clock className="w-5 h-5" />
                                    <span className="md:hidden text-xs font-bold">تأخر</span>
                                </button>
                                <button 
                                    onClick={() => handleAttendance(student, 'absent')}
                                    className={`flex-1 md:flex-none flex items-center justify-center gap-1 p-2 md:p-2 rounded-lg md:rounded-full transition-all duration-200 active:scale-90 ${
                                        status === 'absent' 
                                        ? 'bg-red-500 text-white shadow-md shadow-red-500/20' 
                                        : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="md:hidden text-xs font-bold">غائب</span>
                                </button>
                            </div>

                            {/* Score Section (Desktop) */}
                            <div className="hidden md:flex col-span-2 items-center justify-center gap-3">
                                <button onClick={() => handleScore(student, -1)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-bold transition-all active:scale-90">-</button>
                                <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-bold text-lg shadow-sm transition-colors duration-300 ${getScoreColor(student.participationScore)}`}>
                                    {student.participationScore}
                                </div>
                                <button onClick={() => handleScore(student, 1)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition-all active:scale-90">+</button>
                            </div>
                            
                            {/* Score Section (Mobile) */}
                            <div className="flex md:hidden items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl shadow-sm">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                    نقاط المشاركة
                                </span>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handleScore(student, -1)} className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shadow-sm active:scale-90 transition-all font-bold text-lg">-</button>
                                    <button onClick={() => handleScore(student, 1)} className="w-9 h-9 rounded-xl bg-slate-800 dark:bg-slate-600 text-white flex items-center justify-center shadow-lg active:scale-90 transition-all font-bold text-lg">+</button>
                                </div>
                            </div>

                            {/* Notes Section */}
                            <div className="col-span-1 md:col-span-3">
                                <input 
                                    type="text" 
                                    className="w-full text-sm bg-slate-50/50 dark:bg-slate-900/50 md:bg-transparent rounded-lg md:rounded-none px-3 py-2 md:px-0 md:py-1 border border-slate-100 dark:border-slate-800 md:border-transparent md:border-b md:border-slate-200 md:dark:border-slate-700 focus:border-emerald-500 focus:ring-0 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-800 dark:text-slate-200"
                                    placeholder="اكتب ملاحظة..."
                                    value={student.notes}
                                    onChange={(e) => handleNoteChange(student, e.target.value)}
                                />
                            </div>
                        </div>
                    );
                }))}
            </div>
        </div>
      ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl m-4 bg-white/50 dark:bg-slate-800/20">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-3">
                  <Users className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="font-medium">يرجى اختيار فصل دراسي</p>
          </div>
      )}
    </div>
  );
};