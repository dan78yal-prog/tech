import React, { useState, useRef } from 'react';
import { ClassGroup, Student } from '../types';
import { Users, UserPlus, Upload, Trash2, Plus, FileText, X, Search } from 'lucide-react';

interface ClassManagerProps {
  classes: ClassGroup[];
  addClass: (name: string) => void;
  deleteClass: (id: string) => void;
  addStudent: (classId: string, name: string) => void;
  importStudents: (classId: string, names: string[]) => void;
  deleteStudent: (classId: string, studentId: string) => void;
}

export const ClassManager: React.FC<ClassManagerProps> = ({ 
  classes, addClass, deleteClass, addStudent, importStudents, deleteStudent 
}) => {
  const [newClassName, setNewClassName] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(classes[0]?.id || null);
  const [newStudentName, setNewStudentName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassName.trim()) {
      addClass(newClassName);
      setNewClassName('');
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim() && selectedClassId) {
      addStudent(selectedClassId, newStudentName);
      setNewStudentName('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedClassId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        // Split by new line, remove empty lines and extra spaces
        const names = text.split(/\r?\n/).map(n => n.trim()).filter(n => n.length > 0);
        if (names.length > 0) {
            importStudents(selectedClassId, names);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      reader.readAsText(file);
    }
  };

  const activeClass = classes.find(c => c.id === selectedClassId);
  
  const filteredStudents = activeClass 
    ? activeClass.students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="h-full p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 mb-2">
        <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">إدارة الفصول والطلاب</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Classes List */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex flex-col h-fit">
            <h3 className="font-bold text-lg mb-4 text-slate-700 dark:text-slate-200 border-b dark:border-slate-700 pb-2">الفصول الدراسية</h3>
            <div className="space-y-2 mb-4">
                {classes.map(cls => (
                    <div 
                        key={cls.id}
                        onClick={() => {
                            setSelectedClassId(cls.id);
                            setSearchQuery(''); // Reset search when switching class
                        }}
                        className={`p-3 rounded-lg flex justify-between items-center cursor-pointer transition-colors ${
                            selectedClassId === cls.id 
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700 border border-transparent'
                        }`}
                    >
                        <span className="font-medium dark:text-slate-200">{cls.name}</span>
                        <div className="flex items-center gap-2">
                             <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full text-slate-600 dark:text-slate-300">{cls.students.length} طالب</span>
                             <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if(confirm('هل أنت متأكد من حذف هذا الفصل؟')) deleteClass(cls.id);
                                }}
                                className="text-red-400 hover:text-red-600 p-1"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <form onSubmit={handleAddClass} className="mt-auto pt-4 border-t dark:border-slate-700">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="اسم الفصل الجديد..."
                        className="flex-1 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                    />
                    <button type="submit" className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>

        {/* Students List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col h-full">
            {activeClass ? (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div>
                            <h3 className="font-bold text-xl text-slate-800 dark:text-white">{activeClass.name}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">قائمة الطلاب ({activeClass.students.length})</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text"
                                    placeholder="بحث عن طالب..."
                                    className="w-full pl-3 pr-9 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                           <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                           >
                                <Upload className="w-4 h-4" />
                                استيراد
                           </button>
                           <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept=".txt,.csv" 
                                onChange={handleFileUpload}
                            />
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 mb-4 border border-slate-100 dark:border-slate-700 flex-1 overflow-y-auto max-h-[500px]">
                        {activeClass.students.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 dark:text-slate-600">
                                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>لا يوجد طلاب في هذا الفصل بعد</p>
                                <p className="text-sm">أضفهم يدوياً أو استورد ملف نصي يحتوي على الأسماء</p>
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 dark:text-slate-600">
                                <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>لا توجد نتائج مطابقة للبحث</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {filteredStudents.map((student, idx) => (
                                    <div key={student.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-center group animate-in fade-in zoom-in duration-200">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                                {activeClass.students.indexOf(student) + 1}
                                            </span>
                                            <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[120px]" title={student.name}>{student.name}</span>
                                        </div>
                                        <button 
                                            onClick={() => deleteStudent(activeClass.id, student.id)}
                                            className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                            title="حذف الطالب"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleAddStudent} className="border-t dark:border-slate-700 pt-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">إضافة طالب يدوياً</label>
                        <div className="flex gap-3">
                            <input 
                                type="text"
                                className="flex-1 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="اسم الطالب الثلاثي..."
                                value={newStudentName}
                                onChange={(e) => setNewStudentName(e.target.value)}
                            />
                            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-transform active:scale-95">
                                <UserPlus className="w-4 h-4" /> إضافة
                            </button>
                        </div>
                    </form>
                </>
            ) : (
                <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                    <p>اختر فصلاً من القائمة لعرض الطلاب</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};