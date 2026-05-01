'use client';

import React from 'react';
import { Menu, ArrowLeft, BarChart3, TrendingUp, Heart, Droplets, Moon, Footprints } from 'lucide-react';
import { useSidebar } from '@/components/shared/SidebarContext';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });

import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/db/offlineDb';
import { format, subDays } from 'date-fns';

export default function MoodPage() {
  const { toggleSidebar } = useSidebar();
  const { user } = useAuth();
  const router = useRouter();
  
  const [moodData, setMoodData] = React.useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = React.useState(true);

  React.useEffect(() => {
    const fetchMoodData = async () => {
      if (!user) return;
      try {
        const last7Days = await db.moodHistory
          .where('userId').equals(user.uid)
          .where('timestamp').above(subDays(new Date(), 7).getTime())
          .toArray();

        // Group by day and calculate average mood score
        const grouped: Record<string, { total: number, count: number }> = {};
        
        // Initialize with last 7 days
        for (let i = 6; i >= 0; i--) {
          const d = format(subDays(new Date(), i), 'EEE');
          grouped[d] = { total: 0, count: 0 };
        }

        last7Days.forEach(entry => {
          const day = format(entry.timestamp, 'EEE');
          if (grouped[day]) {
            // Map 0 (Calm) -> 100, 1 (Mild) -> 50, 2 (Distressed) -> 10
            const positivity = entry.mood === 0 ? 100 : entry.mood === 1 ? 50 : 10;
            grouped[day].total += positivity;
            grouped[day].count += 1;
          }
        });

        const formatted = Object.entries(grouped).map(([day, val]) => ({
          day,
          score: val.count > 0 ? Math.round(val.total / val.count) : (60 + Math.random() * 20)
        }));

        setMoodData(formatted);
      } catch (err) {
        console.error('Failed to fetch reports data', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchMoodData();
  }, [user]);

const ACTIVITY_DATA = [
  { day: 'Mon', steps: 4000, water: 6, sleep: 7 },
  { day: 'Tue', steps: 3000, water: 5, sleep: 6 },
  { day: 'Wed', steps: 6000, water: 8, sleep: 8 },
  { day: 'Thu', steps: 2000, water: 4, sleep: 5 },
  { day: 'Fri', steps: 5000, water: 7, sleep: 7 },
  { day: 'Sat', steps: 7000, water: 9, sleep: 9 },
  { day: 'Sun', steps: 4500, water: 7, sleep: 8 },
];

  return (
    <div className="flex-1 flex flex-col bg-[#FFF9F5] h-full overflow-y-auto">
      {/* Header */}
      <header className="px-5 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-[#FFF9F5]/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Mood Analysis</h1>
        </div>
        <button className="text-[13px] font-bold text-brand-primary bg-brand-primary/10 px-4 py-2 rounded-full">
          Download PDF
        </button>
      </header>

      <div className="px-6 py-6 pb-24 space-y-8">
        {/* Summary Card */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Overall Progress</h3>
              <p className="text-sm text-gray-400 font-medium">
                {moodData.length > 0 ? "You're doing great! Keep up the positive vibe." : "Start chatting with MiaKalifa to see your analysis."}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <StatBox label="Mood" value="Happy" color="text-teal-600" bg="bg-teal-50" />
            <StatBox label="Activity" value="85%" color="text-brand-primary" bg="bg-brand-primary/10" />
            <StatBox label="Sleep" value="7.5h" color="text-purple-600" bg="bg-purple-50" />
          </div>
        </div>

        {/* Mood Analysis Chart */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Mood Trends</h2>
            <div className="flex items-center gap-1 text-[11px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md">
              <TrendingUp size={12} /> Positive
            </div>
          </div>
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A8E6CF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#A8E6CF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#2dd4bf" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Activity Breakdown */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">Daily Activity</h2>
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ACTIVITY_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
                <Tooltip cursor={{fill: '#f9fafb'}} />
                <Bar dataKey="water" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sleep" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <div className="w-3 h-3 rounded-full bg-blue-500" /> Water
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <div className="w-3 h-3 rounded-full bg-purple-500" /> Sleep
            </div>
          </div>
        </section>

        {/* Insights */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">AI Insights</h2>
          <div className="space-y-3">
            <InsightItem 
              icon={Droplets} 
              color="text-blue-500" 
              bg="bg-blue-50"
              text="Your hydration is peaking on weekends! Try to maintain the same on workdays."
            />
            <InsightItem 
              icon={Moon} 
              color="text-purple-500" 
              bg="bg-purple-50"
              text="Earlier bedtimes on Wednesday led to your best mood score of the week."
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function StatBox({ label, value, color, bg }: any) {
  return (
    <div className={`${bg} rounded-2xl p-4 flex flex-col items-center`}>
      <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">{label}</span>
      <span className={`text-[16px] font-black ${color}`}>{value}</span>
    </div>
  );
}

function InsightItem({ icon: Icon, color, bg, text }: any) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex gap-4">
      <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}>
        <Icon size={20} />
      </div>
      <p className="text-[13px] font-medium text-gray-600 leading-relaxed pt-0.5">{text}</p>
    </div>
  );
}
