import React from 'react';
import { Footprints, Target } from 'lucide-react';

export const HealthStats = () => {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
            <Footprints size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Walked</p>
            <p className="text-lg font-black text-slate-800">5476 <span className="text-xs font-bold text-slate-400">steps</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
            <Target size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">My Goal</p>
            <p className="text-lg font-black text-slate-800">8000 <span className="text-xs font-bold text-slate-400">steps</span></p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center relative">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-50"
          />
          <circle
            cx="64"
            cy="64"
            r="58"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={364.4}
            strokeDashoffset={364.4 * (1 - 5476/8000)}
            strokeLinecap="round"
            className="text-[#26A69A]"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xl font-black text-slate-800">2524</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">left</p>
        </div>
      </div>
    </div>
  );
};
