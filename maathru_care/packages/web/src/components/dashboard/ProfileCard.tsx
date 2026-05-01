import React from 'react';

export const ProfileCard = () => {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-[28px] overflow-hidden mb-4 ring-8 ring-slate-50">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan" 
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Ivan Jackson</h2>
        <p className="text-sm text-slate-400 font-medium">24 years, California</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-50">
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Blood</p>
          <p className="text-lg font-black text-slate-800">A+</p>
        </div>
        <div className="text-center border-x border-slate-50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Height</p>
          <p className="text-lg font-black text-slate-800">170<span className="text-xs font-bold text-slate-400 ml-0.5">cm</span></p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Weight</p>
          <p className="text-lg font-black text-slate-800">60<span className="text-xs font-bold text-slate-400 ml-0.5">kg</span></p>
        </div>
      </div>
    </div>
  );
};
