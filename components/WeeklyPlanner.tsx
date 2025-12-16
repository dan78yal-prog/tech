import React, { useState } from 'react';
import { DayOfWeek, ScheduleSlot, LessonPlan, ClassGroup } from '../types';
import { Calendar, Edit3, Wand2, Check, X, BookOpen, Clock, Sparkles, BellRing, Target, Layers, FileText, Home } from 'lucide-react';
import { generateLessonPlan } from '../services/geminiService';

interface WeeklyPlannerProps {
  schedule: ScheduleSlot[];
  classes: ClassGroup[];
  updateSchedule: (newSlot: ScheduleSlot) => void;
}

export const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ schedule, classes, updateSchedule }) => {
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'content'>('details');

  // Logic for Next Lesson Reminder
  const getCurrentDayInArabic = (): string => {
      const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      return days[new Date().getDay()];
  };

  const getUpcomingLesson = () => {
      const currentDay = getCurrentDayInArabic();
      const currentHour = new Date().getHours();
      // Simple heuristic: periods map roughly to hours (starts at 7am)
      let currentPeriod = 0;
      if (currentHour >= 7 && currentHour < 8) currentPeriod = 1;
      else if (currentHour >= 8 && currentHour < 9) currentPeriod = 2;
      else if (currentHour >= 9 && currentHour < 10) currentPeriod = 3;
      else if (currentHour >= 10 && currentHour < 11) currentPeriod = 4;
      else if (currentHour >= 11 && currentHour < 12) currentPeriod = 5;
      else if (currentHour >= 12 && currentHour < 13) currentPeriod = 6;
      else if (currentHour >= 13 && currentHour < 14) currentPeriod = 7;

      // Find current or next lesson today
      return schedule.find(s => s.day === currentDay && s.period >= currentPeriod && s.lessonPlan?.topic);
  };

  const nextLesson = getUpcomingLesson();

  // Edit Form State
  const [formData, setFormData] = useState<{
    subject: string;
    topic: string;
    className: string;
    details: string;
    objectives: string;
    homework: string;
    materials: string;
  }>({ subject: '', topic: '', className: '', details: '', objectives: '', homework: '', materials: '' });

  const handleSlotClick = (slot: ScheduleSlot) => {
    setSelectedSlot(slot);
    setFormData({
      subject: slot.lessonPlan?.subject || '',
      topic: slot.lessonPlan?.topic || '',
      className: slot.className || '',
      details: '',
      objectives: slot.lessonPlan?.objectives.join('\n') || '',
      homework: slot.lessonPlan?.homework || '',
      materials: slot.lessonPlan?.materials || '',
    });
    setIsEditing(true);
    setActiveTab('details');
  };

  const handleSave = () => {
    if (!selectedSlot) return;

    const updatedLesson: LessonPlan = {
      ...selectedSlot.lessonPlan,
      id: selectedSlot.lessonPlan?.id || Math.random().toString(),
      subject: formData.subject,
      topic: formData.topic,
      objectives: formData.objectives.split('\n').filter(Boolean),
      materials: formData.materials,
      content: selectedSlot.lessonPlan?.content || '',
      homework: formData.homework,
      isGenerated: !!selectedSlot.lessonPlan?.isGenerated,
    };

    updateSchedule({
      ...selectedSlot,
      className: formData.className,
      lessonPlan: updatedLesson,
    });
    setIsEditing(false);
  };

  const handleAIGenerate = async () => {
    if (!formData.subject || !formData.topic) {
      alert('الرجاء إدخال المادة والموضوع أولاً');
      return;
    }
    setLoadingAI(true);
    try {
      const plan = await generateLessonPlan(
        formData.subject,
        formData.topic,
        formData.className || 'عام',
        formData.details
      );

      if (plan && selectedSlot) {
        updateSchedule({
          ...selectedSlot,
          className: formData.className,
          lessonPlan: plan,
        });
        // Update local form data to reflect AI generation
        setFormData(prev => ({
            ...prev,
            objectives: plan.objectives.join('\n'),
            materials: plan.materials,
            homework: plan.homework
        }));
        setActiveTab('content'); // Switch to content tab to show result
      }
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء الاتصال بالذكاء الاصطناعي');
    } finally {
      setLoadingAI(false);
    }
  };

  const days = Object.values(DayOfWeek);
  const periods = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="h-full flex flex-col gap-4 md:gap-6 p-4 md:p-6 overflow-y-auto pb-24 lg:pb-6 custom-scrollbar">
      {/* Header and Reminder */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-2 gap-4">
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                <span className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-xl">
                    <Calendar className="w-6 h-6 md:w-8 md:h-8 text-emerald-600 dark:text-emerald-400" />
                </span>
                <span className="gradient-text">الجدول الدراسي</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">نظم جدولك الدراسي من الحصة الأولى للسابعة</p>
        </div>

        {/* Lesson Reminder Card */}
        {nextLesson && (
            <div className="w-full md:w-auto bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border border-amber-200 dark:border-amber-700/50 p-4 rounded-2xl flex items-center gap-4 shadow-sm animate-in slide-in-from-right duration-500">
                <div className="bg-white/50 dark:bg-black/20 p-3 rounded-full animate-pulse">
                    <BellRing className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">تنبيه الدرس القادم</span>
                    <h4 className="font-bold text-slate-800 dark:text-white">{nextLesson.lessonPlan?.subject} - {nextLesson.className}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">الحصة {nextLesson.period} • {nextLesson.lessonPlan?.topic}</p>
                </div>
            </div>
        )}
      </div>

      <div className="flex-1 overflow-x-auto -mx-4 px-4 pb-4 custom-scrollbar">
        {/* Changed grid-cols-7 to grid-cols-6 (1 label + 5 days) to ensure proper fit */}
        <div className="grid grid-cols-6 gap-3 md:gap-4 min-w-[800px] md:min-w-[1000px]">
            {/* Header Row */}
            <div className="bg-slate-800 dark:bg-slate-700 p-3 md:p-4 rounded-2xl font-bold text-center text-white flex items-center justify-center text-sm md:text-base shadow-lg shadow-slate-900/10 sticky right-0 z-20">
                <Clock className="w-4 h-4 me-2 text-emerald-400"/> الحصة
            </div>
            {days.map((day) => (
            <div key={day} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 md:p-4 rounded-2xl font-bold text-center shadow-sm text-sm md:text-base text-slate-700 dark:text-slate-200">
                {day}
            </div>
            ))}

            {/* Schedule Grid - Loops 1 to 7 */}
            {periods.map((period) => (
            <React.Fragment key={period}>
                <div className="bg-slate-100 dark:bg-slate-800/50 p-3 md:p-4 rounded-2xl font-bold text-slate-500 dark:text-slate-400 flex items-center justify-center border border-slate-200 dark:border-slate-700 text-sm md:text-base sticky right-0 z-10 backdrop-blur-sm shadow-sm">
                {period}
                </div>
                {days.map((day) => {
                const slot = schedule.find((s) => s.day === day && s.period === period);
                const hasLesson = slot?.lessonPlan?.topic;
                
                return (
                    <div
                    key={`${day}-${period}`}
                    onClick={() => slot && handleSlotClick(slot)}
                    className={`
                        relative p-2 md:p-3 rounded-2xl cursor-pointer transition-all duration-300 min-h-[90px] md:min-h-[130px] group
                        ${hasLesson 
                            ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-100 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-xl hover:-translate-y-1 hover:shadow-emerald-900/5' 
                            : 'bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }
                    `}
                    >
                    {hasLesson ? (
                        <div className="flex flex-col h-full relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] md:text-xs font-bold bg-white/80 dark:bg-slate-900/80 backdrop-blur text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/50 shadow-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[80%]">
                                    {slot.className || 'عام'}
                                </span>
                                {slot.lessonPlan?.isGenerated && (
                                <div className="bg-purple-100 dark:bg-purple-900/30 p-1 rounded-full">
                                    <Wand2 className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                </div>
                                )}
                            </div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs md:text-sm line-clamp-2 mb-1 leading-snug">{slot.lessonPlan?.subject}</h4>
                            <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug">{slot.lessonPlan?.topic}</p>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:text-emerald-400 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 flex items-center justify-center transition-colors">
                                <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                        </div>
                    )}
                    </div>
                );
                })}
            </React.Fragment>
            ))}
        </div>
      </div>

      {/* Improved Modal for Editing */}
      {isEditing && selectedSlot && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20 dark:border-slate-700">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 p-5 flex justify-between items-center text-white shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              <h3 className="font-bold text-lg md:text-xl flex items-center gap-2 relative z-10">
                <BookOpen className="w-6 h-6 text-emerald-400" />
                تحضير الدرس (الحصة {selectedSlot.period})
              </h3>
              <button onClick={() => setIsEditing(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors relative z-10">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <button 
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'details' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
                >
                    <Target className="w-4 h-4" /> التفاصيل الأساسية
                    {activeTab === 'details' && <div className="absolute bottom-0 w-full h-0.5 bg-emerald-500"></div>}
                </button>
                <button 
                    onClick={() => setActiveTab('content')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'content' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
                >
                    <Layers className="w-4 h-4" /> المحتوى والأدوات
                     {activeTab === 'content' && <div className="absolute bottom-0 w-full h-0.5 bg-emerald-500"></div>}
                </button>
            </div>

            {/* Content Area */}
            <div className="p-5 md:p-8 overflow-y-auto bg-slate-50 dark:bg-slate-800/50 custom-scrollbar flex-1">
                {activeTab === 'details' ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">المادة الدراسية</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow shadow-sm text-slate-900 dark:text-white"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    placeholder="مثال: رياضيات"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الفصل الدراسي</label>
                                <div className="relative">
                                    <select
                                        className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none shadow-sm cursor-pointer text-slate-900 dark:text-white"
                                        value={formData.className}
                                        onChange={(e) => setFormData({...formData, className: e.target.value})}
                                    >
                                        <option value="">اختر الفصل</option>
                                        {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">موضوع الدرس</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow shadow-sm text-slate-900 dark:text-white"
                                value={formData.topic}
                                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                                placeholder="مثال: الجمع والطرح مع إعادة التجميع"
                            />
                        </div>
                        
                        {/* AI Section */}
                        <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 p-5 rounded-2xl border border-violet-100 dark:border-violet-800 shadow-sm relative overflow-hidden group">
                            <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="flex justify-between items-center mb-3 relative z-10">
                                <h4 className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-2 text-base md:text-lg">
                                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-pulse" />
                                    المساعد الذكي
                                </h4>
                                <span className="text-[10px] font-bold bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">AI Powered</span>
                            </div>
                            <p className="text-xs text-purple-700 dark:text-purple-300 mb-3 opacity-80">أدخل تفاصيل بسيطة وسنقوم بكتابة الأهداف والمحتوى والمواد نيابة عنك.</p>
                            <textarea 
                                className="w-full p-3 text-sm bg-white/60 dark:bg-black/30 border border-purple-100 dark:border-purple-800 rounded-xl mb-3 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-700 transition-all resize-none text-slate-900 dark:text-white"
                                placeholder="أي ملاحظات محددة؟ (مثال: ركز على التعلم النشط)"
                                rows={2}
                                value={formData.details}
                                onChange={(e) => setFormData({...formData, details: e.target.value})}
                            />
                            <button 
                                onClick={handleAIGenerate}
                                disabled={loadingAI}
                                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-purple-500/20"
                            >
                                {loadingAI ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>جاري التوليد...</span>
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-4 h-4" /> توليد الخطة كاملة
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {/* Objectives */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-500" /> الأهداف السلوكية (كل هدف في سطر)
                            </label>
                            <textarea
                                className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-900 dark:text-white min-h-[100px]"
                                value={formData.objectives}
                                onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                                placeholder="- أن يعدد الطالب..."
                            />
                        </div>

                        {/* Materials */}
                        <div>
                             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-emerald-500" /> الوسائل والأدوات
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-900 dark:text-white"
                                value={formData.materials}
                                onChange={(e) => setFormData({...formData, materials: e.target.value})}
                                placeholder="سبورة، أقلام، جهاز عرض..."
                            />
                        </div>

                         {/* Content View */}
                         {selectedSlot.lessonPlan?.content && (
                            <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <FileText className="w-3 h-3" /> المحتوى المولد
                                </p>
                                <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">{selectedSlot.lessonPlan.content}</p>
                            </div>
                        )}

                        {/* Homework */}
                        <div>
                             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                <Home className="w-4 h-4 text-emerald-500" /> الواجب المنزلي
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-900 dark:text-white"
                                value={formData.homework}
                                onChange={(e) => setFormData({...formData, homework: e.target.value})}
                                placeholder="حل تمارين ص ٥٠..."
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 shrink-0">
                <button 
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold text-sm transition-colors"
                >
                    إلغاء
                </button>
                <button 
                    onClick={handleSave}
                    className="px-8 py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white rounded-xl font-bold flex items-center gap-2 text-sm shadow-lg shadow-slate-900/20 transition-all active:scale-95"
                >
                    <Check className="w-4 h-4" /> حفظ التغييرات
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};