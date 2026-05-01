'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '2020', average: 400, myData: 240 },
  { name: '2021', average: 300, myData: 139 },
  { name: '2022', average: 200, myData: 980 },
  { name: '2023', average: 278, myData: 390 },
];

export const HealthChart = () => {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 mt-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-800">Health Average</h3>
        <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
          {['D', 'W', 'M', 'Y'].map(t => (
            <button key={t} className={`w-8 h-8 rounded-lg text-xs font-bold ${t === 'Y' ? 'bg-[#FDE6E9] text-[#F06292]' : 'text-slate-400'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
            <Line 
              type="monotone" 
              dataKey="average" 
              stroke="#1A1C29" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#1A1C29' }} 
            />
            <Line 
              type="monotone" 
              dataKey="myData" 
              stroke="#F06292" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#F06292' }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#1A1C29] rounded-full" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Average</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#F06292] rounded-full" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">My Data</span>
        </div>
      </div>
    </div>
  );
};
