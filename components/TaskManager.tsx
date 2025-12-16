import React, { useState } from 'react';
import { Task } from '../types';
import { CheckSquare, Plus, Trash2, Calendar as CalendarIcon, Flag, Circle, CheckCircle2 } from 'lucide-react';

interface TaskManagerProps {
  tasks: Task[];
  addTask: (text: string, priority: 'high' | 'medium' | 'low', date?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ tasks, addTask, toggleTask, deleteTask }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newDate, setNewDate] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText, newPriority, newDate);
      setNewTaskText('');
      setNewDate('');
      setNewPriority('medium');
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'medium': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'low': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
      default: return 'text-slate-500';
    }
  };

  const getPriorityLabel = (p: string) => {
    switch (p) {
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'low': return 'منخفضة';
      default: return '';
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
      // Sort by completion (incomplete first) then by priority (high to low)
      if (a.completed === b.completed) {
          const pMap = { high: 3, medium: 2, low: 1 };
          return pMap[b.priority] - pMap[a.priority];
      }
      return a.completed ? 1 : -1;
  });

  return (
    <div className="h-full p-4 md:p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-xl">
            <CheckSquare className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">قائمة المهام</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">نظم أولوياتك وتابع إنجازاتك اليومية</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Add Task Form */}
        <div className="lg:col-span-1 h-fit">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 sticky top-0">
                <h3 className="font-bold text-lg mb-4 text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-emerald-500" /> إضافة مهمة جديدة
                </h3>
                <form onSubmit={handleAdd} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">عنوان المهمة</label>
                        <input 
                            type="text" 
                            className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                            placeholder="ما الذي تريد إنجازه؟"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">الأولوية</label>
                            <select 
                                className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:text-white"
                                value={newPriority}
                                onChange={(e) => setNewPriority(e.target.value as any)}
                            >
                                <option value="high">عالية 🔴</option>
                                <option value="medium">متوسطة 🟠</option>
                                <option value="low">منخفضة 🟢</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">التاريخ (اختياري)</label>
                             <input 
                                type="date" 
                                className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:text-white"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                             />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> إضافة للقائمة
                    </button>
                </form>
            </div>
        </div>

        {/* Tasks List */}
        <div className="lg:col-span-2 space-y-3">
            {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white/50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 dark:text-slate-500">
                    <CheckSquare className="w-16 h-16 mb-4 opacity-50" />
                    <p className="font-bold text-lg">لا توجد مهام حالياً</p>
                    <p className="text-sm">ابدأ بإضافة مهامك لليوم</p>
                </div>
            ) : (
                sortedTasks.map(task => (
                    <div 
                        key={task.id} 
                        className={`group flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                            task.completed 
                            ? 'bg-slate-50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 opacity-75' 
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                    >
                        <button 
                            onClick={() => toggleTask(task.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                task.completed 
                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 text-transparent'
                            }`}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                        </button>

                        <div className="flex-1">
                            <h4 className={`font-bold text-base transition-all ${
                                task.completed 
                                ? 'text-slate-400 line-through decoration-slate-400' 
                                : 'text-slate-800 dark:text-white'
                            }`}>
                                {task.text}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                                    <Flag className="w-3 h-3" /> {getPriorityLabel(task.priority)}
                                </span>
                                {task.dueDate && (
                                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        <CalendarIcon className="w-3 h-3" /> {task.dueDate}
                                    </span>
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};