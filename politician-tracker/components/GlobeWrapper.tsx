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
  return <PoliticianGlobe {...props} />;
}


