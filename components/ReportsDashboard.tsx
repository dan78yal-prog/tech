import React from 'react';
import { ClassGroup, ScheduleSlot } from '../types';
import { BarChart3, TrendingUp, Users, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface ReportsDashboardProps {
  classes: ClassGroup[];
  schedule: ScheduleSlot[];
}

export const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ classes, schedule }) => {
  
  // Calculate Stats
  const totalStudents = classes.reduce((acc, curr) => acc + curr.students.length, 0);
  
  // Attendance Calculation (Generic for last recorded dates)
  let totalPresent = 0;
  let totalRecords = 0;
  let absentees: {name: string, class: string}[] = [];

  classes.forEach(c => {
    c.students.forEach(s => {
        const dates = Object.keys(s.attendance);
        dates.forEach(date => {
            totalRecords++;
            if (s.attendance[date] === 'present') totalPresent++;
            if (s.attendance[date] === 'absent') absentees.push({name: s.name, class: c.name});
        });
    });
  });

  const attendanceRate = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;

  // Lesson Plan Progress
  const totalSlots = schedule.length; // Should be 35 (5 days * 7 periods)
  const plannedSlots = schedule.filter(s => s.lessonPlan && s.lessonPlan.topic).length;
  const planningProgress = Math.round((plannedSlots / totalSlots) * 100);

  // Alerts Generation
  const alerts = [];
  if (planningProgress < 50) alerts.push({ type: 'warning', text: 'نسبة تحضير الدروس للأسبوع أقل من 50%' });
  if (absentees.length > 3) alerts.push({ type: 'danger', text: `ارتفاع عدد الغياب (${absentees.length} طلاب مؤخراً)` });
  if (totalStudents === 0) alerts.push({ type: 'info', text: 'لم يتم إضافة طلاب بعد. ابدأ بإضافة الفصول.' });

  return (
    <div className="h-full p-4 md:p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl">
            <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">التقارير والتحليلات</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">نظرة شاملة على الأداء والحضور</p>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
          <div className="space-y-3 mb-4">
              {alerts.map((alert, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border flex items-center gap-3 ${
                      alert.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200' :
                      alert.type === 'danger' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200' :
                      'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
                  }`}>
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <span className="font-bold text-sm">{alert.text}</span>
                  </div>
              ))}
          </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
            title="إجمالي الطلاب" 
            value={totalStudents} 
            icon={<Users className="w-5 h-5 text-white" />} 
            color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard 
            title="نسبة الحضور العامة" 
            value={`${attendanceRate}%`} 
            icon={<CheckCircle className="w-5 h-5 text-white" />} 
            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
            subtext={totalRecords === 0 ? "لا توجد بيانات" : "بناءً على السجلات"}
        />
        <StatCard 
            title="إكمال التحضير" 
            value={`${planningProgress}%`} 
            icon={<Calendar className="w-5 h-5 text-white" />} 
            color="bg-gradient-to-br from-violet-500 to-violet-600"
            subtext={`${plannedSlots} حصة محضرة`}
        />
        <StatCard 
            title="عدد الفصول" 
            value={classes.length} 
            icon={<TrendingUp className="w-5 h-5 text-white" />} 
            color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Lesson Planning Progress Bar */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-500" /> تقدم الجدول الدراسي
              </h3>
              <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                      <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300">
                              تم التحضير
                          </span>
                      </div>
                      <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-emerald-600 dark:text-emerald-400">
                              {planningProgress}%
                          </span>
                      </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-emerald-100 dark:bg-slate-700">
                      <div style={{ width: `${planningProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-1000"></div>
                  </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  لقد قمت بتحضير <span className="font-bold text-slate-800 dark:text-white">{plannedSlots}</span> حصة من أصل <span className="font-bold">{totalSlots}</span> لهذا الأسبوع.
              </p>
          </div>

          {/* Recent Absenteeism List */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" /> حالات الغياب الأخيرة
              </h3>
              {absentees.length > 0 ? (
                  <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                      {absentees.slice(0, 5).map((record, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                              <span className="font-bold text-slate-700 dark:text-red-100">{record.name}</span>
                              <span className="text-xs bg-white dark:bg-slate-900 px-2 py-1 rounded text-slate-500 dark:text-slate-400">{record.class}</span>
                          </div>
                      ))}
                      {absentees.length > 5 && <p className="text-xs text-center text-slate-500">و {absentees.length - 5} آخرين...</p>}
                  </div>
              ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                      <CheckCircle className="w-10 h-10 mb-2 text-emerald-500 opacity-50" />
                      <p className="text-sm">لا توجد حالات غياب مسجلة مؤخراً</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, subtext }: { title: string, value: string | number, icon: React.ReactNode, color: string, subtext?: string }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start justify-between relative overflow-hidden group">
        <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white">{value}</h4>
            {subtext && <p className="text-[10px] text-slate-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl shadow-lg ${color} transform group-hover:scale-110 transition-transform duration-300`}>
            {icon}
        </div>
    </div>
);