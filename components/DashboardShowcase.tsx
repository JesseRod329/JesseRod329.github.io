import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DashboardDataPoint } from '../types';

const DashboardShowcase: React.FC = () => {
  const [data, setData] = useState<DashboardDataPoint[]>([]);

  // Simulate real-time data updates
  useEffect(() => {
    const generateData = () => {
      const newData: DashboardDataPoint[] = [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      months.forEach((month, index) => {
        newData.push({
          name: month,
          agentsActive: Math.floor(Math.random() * 50) + 20 + (index * 5),
          tokensProcessed: Math.floor(Math.random() * 1000000) + 500000 + (index * 200000),
          costSavings: Math.floor(Math.random() * 5000) + 1000 + (index * 800)
        });
      });
      setData(newData);
    };

    generateData();
    const interval = setInterval(generateData, 5000); // Update every 5s to show liveliness
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="dashboard" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1">
             <div className="glass-panel rounded-xl border border-white/10 p-6 shadow-2xl">
               <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                 <div>
                   <h3 className="text-lg font-bold">Live System Metrics</h3>
                   <p className="text-xs text-gray-400">Real-time Agent Performance</p>
                 </div>
                 <div className="flex gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-xs text-green-500 font-mono">LIVE</span>
                 </div>
               </div>

               <div className="h-64 w-full mb-8">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={data}>
                     <defs>
                       <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                     <XAxis dataKey="name" stroke="#666" fontSize={12} />
                     <YAxis stroke="#666" fontSize={12} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#121214', borderColor: '#333' }}
                        itemStyle={{ color: '#fff' }}
                     />
                     <Area type="monotone" dataKey="tokensProcessed" stroke="#00f3ff" fillOpacity={1} fill="url(#colorTokens)" />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Active Agents</p>
                    <div className="h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                          <Bar dataKey="agentsActive" fill="#bc13fe" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                 </div>
                 <div className="bg-white/5 p-4 rounded-lg flex flex-col justify-center">
                    <p className="text-xs text-gray-400 mb-1">Proj. Cost Savings</p>
                    <p className="text-2xl font-mono font-bold text-neon-green">
                      ${data.length > 0 ? data[data.length - 1].costSavings.toLocaleString() : '0'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">+12% vs last month</p>
                 </div>
               </div>
             </div>
          </div>

          <div className="order-1 lg:order-2">
             <div className="inline-block mb-4 px-3 py-1 rounded-full bg-neon-green/10 text-neon-green text-xs font-mono font-bold">
               BUSINESS INTELLIGENCE
             </div>
             <h2 className="text-3xl md:text-5xl font-bold mb-6">
               Data-Driven <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-400">Dashboards</span>
             </h2>
             <p className="text-gray-400 text-lg mb-8 leading-relaxed">
               I don't just build backends; I build the window into your AI's soul. My expertise includes creating comprehensive, real-time dashboards that allow stakeholders to monitor agent performance, token usage, and business ROI instantly.
             </p>
             <ul className="space-y-4">
               {[
                 'Real-time WebSocket data streaming',
                 'Custom Recharts & D3 visualizations',
                 'Role-based access control (RBAC) views',
                 'Exportable reporting modules'
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-gray-300">
                   <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                   {item}
                 </li>
               ))}
             </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DashboardShowcase;