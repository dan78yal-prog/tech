import React from 'react';
import { LayoutDashboard, Users, BookOpen, Settings, CheckSquare, BarChart3 } from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'schedule', label: 'الجدول', icon: LayoutDashboard },
    { id: 'tracker', label: 'المتابعة', icon: BookOpen },
    { id: 'classes', label: 'الفصول', icon: Users },
    { id: 'tasks', label: 'المهام', icon: CheckSquare },
    { id: 'reports', label: 'التقارير', icon: BarChart3 },
  ];

  return (
    <>
    {/* Desktop Sidebar */}
    <div className="hidden lg:flex w-64 bg-slate-900 dark:bg-slate-950 text-white flex-col transition-all duration-300 shadow-2xl z-20 h-full relative overflow-hidden border-e border-slate-800">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="h-24 flex items-center px-6 border-b border-slate-800/50 backdrop-blur-sm shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 transform transition-transform hover:rotate-6 duration-300">
             <span className="text-xl font-bold text-white">م</span>
        </div>
        <div className="ms-3 flex flex-col">
            <span className="font-bold text-lg tracking-wide text-white">معلم AI</span>
            <span className="text-[10px] text-slate-400">الإصدار 2.5</span>
        </div>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewMode)}
              className={`w-full flex items-center justify-start p-3 rounded-xl transition-all duration-300 group relative overflow-hidden
                ${isActive 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30 translate-x-2' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white hover:translate-x-1'
                }
              `}
            >
              <Icon className={`w-5 h-5 relative z-10 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className={`ms-3 font-medium relative z-10 transition-transform duration-300 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-0.5'}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50 shrink-0">
        <button className="w-full flex items-center justify-start p-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300 group hover:translate-x-1">
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-700 ease-in-out" />
            <span className="ms-3 text-sm font-medium group-hover:translate-x-0.5 transition-transform duration-300">الإعدادات</span>
        </button>
      </div>
    </div>

    {/* Mobile Bottom Navigation - Fixed Grid Layout */}
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] pb-safe">
        <div className="grid grid-cols-5 h-16 w-full max-w-md mx-auto">
            {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
                <button
                key={item.id}
                onClick={() => setView(item.id as ViewMode)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 active:scale-90 group
                    ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}
                `}
                >
                <div className={`relative p-1 rounded-xl transition-all duration-300 ${isActive ? 'bg-emerald-50 dark:bg-emerald-900/20 -translate-y-1.5 shadow-sm' : 'group-hover:-translate-y-1'}`}>
                    <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'stroke-[2.5px] scale-110' : 'stroke-2 group-hover:scale-110'}`} />
                </div>
                <span className={`text-[9px] font-medium transition-opacity duration-300 ${isActive ? 'opacity-100 font-bold translate-y-0.5' : 'opacity-80'}`}>
                    {item.label}
                </span>
                </button>
            );
            })}
        </div>
    </div>
    </>
  );
};