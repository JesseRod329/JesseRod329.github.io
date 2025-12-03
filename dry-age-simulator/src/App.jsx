import React, { useState } from 'react';
import {
  Timer,
  Thermometer,
  Droplets,
  ChefHat,
  Banana,
  RefreshCw,
  Flame
} from 'lucide-react';

export default function DryAgeMeatSimulator() {
  const [days, setDays] = useState(45);
  const [temp, setTemp] = useState(36);
  const [humidity, setHumidity] = useState(82);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Constants
  const apiKey = "AIzaSyCk2BImRJ93plQdzL6zQNCDjpdTYn4BjmY"; // System will provide key

  const generateMeatImage = async () => {
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Determine characteristics based on days
      let characteristics = "";
      if (days < 20) {
        characteristics = "bright red meat, white fat, minimal outer crust, moist surface";
      } else if (days < 45) {
        characteristics = "deep red meat, hardening white fat, developing pellicle crust, slight darkening of edges";
      } else if (days < 90) {
        characteristics = "dark mahogany red meat, condensed marbling, thick dark hard crust, nutty visual texture";
      } else {
        characteristics = "extremely dark vintage beef, heavy black crust, intense funk, very condensed size, heavy marbling concentration";
      }

      const prompt = `A cinematic, hyper-realistic macro food photography shot of a Dry Aged Ribeye Steak resting on a wooden butcher block. 
      The meat has been aged for ${days} days. 
      Visual characteristics: ${characteristics}.
      The lighting is dramatic, warm, and moody, typical of a high-end steakhouse. 
      The texture of the meat and the dry-aged crust should be incredibly detailed, 8k resolution, Michelin star plating style.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instances: [
              { prompt: prompt }
            ],
            parameters: {
              sampleCount: 1,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
        const imageBase64 = data.predictions[0].bytesBase64Encoded;
        setGeneratedImage(`data:image/png;base64,${imageBase64}`);
      } else {
        throw new Error("Failed to generate image data");
      }
    } catch (err) {
      console.error(err);
      setError(`The meat spoiled! (${err.message})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans selection:bg-yellow-500 selection:text-black">

      {/* Navbar / Top Bar */}
      <div className="w-full h-2 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"></div>

      <div className="max-w-6xl mx-auto p-4 md:p-8">

        {/* THE SIGN - Redesigned as requested */}
        <div className="relative mb-12 group perspective-1000">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-yellow-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-black border-4 border-double border-yellow-700 p-8 rounded-lg shadow-2xl text-center overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(#4a0404 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="flex justify-center items-center gap-4 mb-2">
              <Banana className="w-12 h-12 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              <h1 className="text-5xl md:text-7xl font-serif tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-700 drop-shadow-sm font-bold uppercase">
                NANO BANANA
              </h1>
              <Banana className="w-12 h-12 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] transform scale-x-[-1]" />
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-red-800"></div>
              <h2 className="text-red-500 font-mono tracking-[0.4em] uppercase text-sm md:text-base font-bold text-shadow-red">
                Premium Dry Aging Simulation
              </h2>
              <div className="h-px w-16 bg-red-800"></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN - Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 shadow-xl">
              <h3 className="text-xl font-bold text-yellow-500 mb-6 flex items-center gap-2">
                <ChefHat size={20} /> Aging Parameters
              </h3>

              {/* Days Control */}
              <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                  <label className="flex items-center gap-2 text-neutral-400 font-medium">
                    <Timer size={16} /> Duration
                  </label>
                  <span className="text-2xl font-bold text-white font-mono">{days} <span className="text-sm text-neutral-500">days</span></span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="120"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 hover:accent-yellow-400 transition-all"
                />
                <div className="flex justify-between text-xs text-neutral-600 mt-1">
                  <span>14d</span>
                  <span>120d</span>
                </div>
              </div>

              {/* Temp Control */}
              <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                  <label className="flex items-center gap-2 text-neutral-400 font-medium">
                    <Thermometer size={16} /> Temperature
                  </label>
                  <span className="text-2xl font-bold text-blue-400 font-mono">{temp}°F</span>
                </div>
                <input
                  type="range"
                  min="33"
                  max="40"
                  step="0.5"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                />
              </div>

              {/* Humidity Control */}
              <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                  <label className="flex items-center gap-2 text-neutral-400 font-medium">
                    <Droplets size={16} /> Humidity
                  </label>
                  <span className="text-2xl font-bold text-cyan-400 font-mono">{humidity}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="90"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
                />
              </div>

              {/* Stats Box */}
              <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-700/50 mb-6">
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Projected Outcome</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Weight Loss:</span>
                    <span className="text-yellow-500 font-mono">~{Math.round(days * 0.4)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Flavor Profile:</span>
                    <span className="text-white">
                      {days < 30 ? "Mild, Beefy" : days < 60 ? "Nutty, Intense" : "Blue Cheese, Funky"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Texture:</span>
                    <span className="text-white">
                      {days < 30 ? "Tender" : days < 60 ? "Buttery" : "Firm, Waxy"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={generateMeatImage}
                disabled={loading}
                className={`w-full py-4 rounded-lg font-bold text-lg uppercase tracking-wider transition-all transform active:scale-95 flex items-center justify-center gap-2
                  ${loading
                    ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-lg hover:shadow-red-900/50'
                  }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Flame /> Age & Visualize
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN - Output */}
          <div className="lg:col-span-8">
            <div className="bg-black rounded-xl border border-neutral-800 shadow-2xl overflow-hidden min-h-[500px] flex flex-col relative">

              {/* Overlay HUD elements */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <div className="px-3 py-1 bg-black/70 backdrop-blur text-xs font-mono text-yellow-500 border border-yellow-500/30 rounded">
                  CAM-1: DRY_AGE_LOCKER
                </div>
                <div className="px-3 py-1 bg-black/70 backdrop-blur text-xs font-mono text-green-500 border border-green-500/30 rounded flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> LIVE
                </div>
              </div>

              <div className="flex-grow flex items-center justify-center bg-neutral-950 relative">

                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(50,50,50,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(50,50,50,0.5) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                  }}>
                </div>

                {loading && (
                  <div className="flex flex-col items-center justify-center z-20">
                    <div className="relative w-24 h-24 mb-4">
                      <div className="absolute inset-0 border-t-4 border-red-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-4 border-t-4 border-yellow-500 rounded-full animate-spin reverse-spin" style={{ animationDirection: 'reverse' }}></div>
                    </div>
                    <p className="text-yellow-500 font-mono animate-pulse">ACCELERATING TIME...</p>
                    <p className="text-neutral-500 text-sm mt-2 font-mono">Simulating bacterial enzymes</p>
                  </div>
                )}

                {!loading && !generatedImage && !error && (
                  <div className="text-center p-8 opacity-40">
                    <BeefPlaceholder />
                    <p className="text-neutral-400 mt-4 font-mono">AWAITING SUBJECT</p>
                    <p className="text-neutral-600 text-sm">Configure parameters and initiate aging process</p>
                  </div>
                )}

                {error && (
                  <div className="text-center p-8 bg-red-900/20 border border-red-500/50 rounded-lg mx-8">
                    <p className="text-red-400 font-bold mb-2">SIMULATION FAILURE</p>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                {!loading && generatedImage && (
                  <img
                    src={generatedImage}
                    alt="Dry Aged Beef"
                    className="w-full h-full object-cover animate-in fade-in duration-1000"
                  />
                )}
              </div>

              {/* Bottom Info Bar */}
              <div className="bg-neutral-900 border-t border-neutral-800 p-4 flex justify-between items-center text-xs font-mono text-neutral-500">
                <div>MDL: NANO-BANANA-V4</div>
                <div className="flex gap-4">
                  <span>ISO 800</span>
                  <span>f/1.8</span>
                  <span>1/125</span>
                </div>
              </div>
            </div>

            {generatedImage && (
              <div className="mt-4 p-4 bg-yellow-900/20 border-l-4 border-yellow-600 rounded-r text-yellow-100/80 text-sm italic">
                "The {days}-day aging process has resulted in significant moisture loss, concentrating the beef flavor. The enzyme activity has broken down connective tissue, ensuring extreme tenderness."
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple SVG placeholder for the empty state
function BeefPlaceholder() {
  return (
    <svg className="w-32 h-32 mx-auto text-neutral-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 11a7 7 0 0 1-7 7m0 0a7 7 0 0 1-7-7m7 7v4c0 2-3 3-3 3m3-7a6 6 0 0 1-6-6c0-4 4-9 9-9 10 0 14 11 4 15" />
      <path d="M12 18v4" />
      <path d="M7 11c0-4 4-8 8-8" />
    </svg>
  );
}
