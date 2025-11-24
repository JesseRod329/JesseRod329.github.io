import dynamic from 'next/dynamic';

const PoliticianGlobe = dynamic(() => import('./PoliticianGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      <div className="text-cyan-500 font-mono text-xs tracking-widest animate-pulse">
        INITIALIZING SATELLITE UPLINK...
      </div>
    </div>
  )
});

export default function GlobeWrapper(props: any) {
  return (
    <div className="relative w-full h-full group rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      <PoliticianGlobe {...props} />
      
      {/* Vignette & Scanlines Overlay - Ported from Globe App */}
      <div className="pointer-events-none absolute inset-0 z-20 opacity-30 bg-[linear-gradient(rgba(18,16,20,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-radial from-transparent to-black opacity-60" />
      
      {/* Active Status Indicator */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/50 px-2 py-1 rounded-full border border-red-900/30 backdrop-blur-sm">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
        <span className="text-[10px] font-mono text-red-500/80 tracking-wider">REC</span>
      </div>
    </div>
  );
}
