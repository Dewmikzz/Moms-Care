import React from 'react';

const exams = [
  { 
    date: '21 Jul, 2023', 
    title: 'Hypertensive crisis', 
    status: 'Ongoing treatment', 
    color: 'bg-[#FDE6E9]', 
    textColor: 'text-[#F06292]' 
  },
  { 
    date: '18 Jul, 2023', 
    title: 'Osteoporosis', 
    status: 'Incurable', 
    color: 'bg-[#FFF9E6]', 
    textColor: 'text-[#FBC02D]',
    badge: 'Need analyzes'
  },
  { 
    date: '21 Jul, 2023', 
    title: 'Hypertensive crisis', 
    status: 'Examination', 
    color: 'bg-[#E0F2F1]', 
    textColor: 'text-[#26A69A]' 
  },
];

export const ExaminationsCards = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">Examinations</h3>
        <button className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">See All</button>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {exams.map((exam, idx) => (
          <div 
            key={idx} 
            className={`${exam.color} rounded-[28px] p-6 min-w-[240px] flex flex-col justify-between relative overflow-hidden`}
          >
            {exam.badge && (
              <span className="absolute top-4 right-4 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-700">
                {exam.badge}
              </span>
            )}
            <div className="mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exam.date}</span>
              <h4 className="text-lg font-black text-slate-800 mt-1 leading-tight">{exam.title}</h4>
            </div>
            <p className={`text-xs font-bold ${exam.textColor}`}>{exam.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
