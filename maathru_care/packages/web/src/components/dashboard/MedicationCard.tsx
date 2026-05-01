import React from 'react';

export const MedicationCard = () => {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 mt-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-slate-800">Notifications</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">26 Aug 2024</span>
      </div>

      {/* Medication Item */}
      <div className="bg-[#E0F2F1]/50 rounded-[24px] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#26A69A] rounded-full" />
            <h4 className="font-bold text-slate-800">Amlodipine</h4>
          </div>
          <span className="text-sm font-bold text-[#26A69A]">10mg</span>
        </div>
        <div className="flex gap-2 mb-3">
          {['MON', 'WED', 'FRI', 'SUN'].map(day => (
            <span key={day} className="text-[9px] font-black text-indigo-400 tracking-tighter bg-white px-2 py-1 rounded-md">{day}</span>
          ))}
        </div>
        <p className="text-xs text-slate-500 font-medium">2 times in a day after food</p>
      </div>

      {/* Doctor Card */}
      <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Doctor" 
            className="w-12 h-12 rounded-xl bg-slate-100"
            alt="Doctor"
          />
          <div>
            <h4 className="text-sm font-bold text-slate-800">Dr. Benjamin Fedrel</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Neurologist</p>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
            <p className="text-sm font-bold text-slate-800">26 Aug 2024</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time</p>
            <p className="text-sm font-bold text-slate-800">04:30 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};
