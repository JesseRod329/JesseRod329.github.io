import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DashboardDataPoint } from '../types';
import { Reveal, SectionHeading } from './Reveal';
import GithubPulse from './GithubPulse';

const DashboardShowcase: React.FC = () => {
  const [data, setData] = useState<DashboardDataPoint[]>([]);

  useEffect(() => {
    const generateData = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      setData(
        months.map((month, index) => ({
          name: month,
          agentsActive: Math.floor(Math.random() * 50) + 20 + index * 5,
          tokensProcessed: Math.floor(Math.random() * 1000000) + 500000 + index * 200000,
          costSavings: Math.floor(Math.random() * 5000) + 1000 + index * 800,
        }))
      );
    };

    generateData();
    const interval = setInterval(generateData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="dashboard" className="py-28 md:py-36 bg-ink-900 border-y border-bone/10 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-signal/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <SectionHeading
          eyebrow="Business Intelligence"
          index="/ 05"
          title={<>The window into your <em className="italic font-light text-signal">AI&rsquo;s soul</em></>}
          description="Agents without observability are a liability. Every system I ship comes with real-time dashboards for agent performance, token spend, and business ROI."
        />

        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6 items-stretch">
          <Reveal>
            <div className="panel p-6 md:p-8 h-full">
              <div className="flex items-center justify-between mb-8 border-b border-bone/10 pb-5">
                <div>
                  <h3 className="font-display text-xl font-semibold text-bone">Live System Metrics</h3>
                  <p className="font-mono text-[11px] text-bone-mute mt-1">real-time agent performance</p>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-live">
                  <span className="w-2 h-2 rounded-full bg-live animate-pulse" />
                  LIVE
                </div>
              </div>

              <div className="h-60 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffb224" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ffb224" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(236,228,211,0.06)" />
                    <XAxis dataKey="name" stroke="#6f6757" fontSize={11} fontFamily="'IBM Plex Mono', monospace" />
                    <YAxis stroke="#6f6757" fontSize={11} fontFamily="'IBM Plex Mono', monospace" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#12100c', borderColor: '#332c20', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}
                      itemStyle={{ color: '#ece4d3' }}
                    />
                    <Area type="monotone" dataKey="tokensProcessed" stroke="#ffb224" strokeWidth={1.5} fillOpacity={1} fill="url(#colorTokens)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bone/[0.03] border border-bone/10 p-5">
                  <p className="font-mono text-[11px] text-bone-mute mb-2">active agents</p>
                  <div className="h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data}>
                        <Bar dataKey="agentsActive" fill="#c97f10" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-bone/[0.03] border border-bone/10 p-5 flex flex-col justify-center">
                  <p className="font-mono text-[11px] text-bone-mute mb-2">proj. cost savings</p>
                  <p className="font-display text-3xl font-semibold text-signal">
                    ${data.length > 0 ? data[data.length - 1].costSavings.toLocaleString() : '0'}
                  </p>
                  <p className="font-mono text-[11px] text-bone-mute mt-2">+12% vs last month</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <GithubPulse />
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default DashboardShowcase;
