import { motion } from 'motion/react';
import { FlaskConical, Droplet, Sliders, TrendingUp, Info } from 'lucide-react';
import { SystemState } from '../types';

interface QualityTabProps {
  state: SystemState;
  onChangeState: (updater: (prev: SystemState) => SystemState) => void;
}

export default function QualityTab({ state, onChangeState }: QualityTabProps) {
  const { ph, turbidity, tds, chlorine } = state.quality;

  // Determine health indicator
  const phOutOfRange = ph.value < 6.5 || ph.value > 8.5;
  const turbidityViolation = turbidity.value >= turbidity.maxSafe;
  const isHealthy = !phOutOfRange && !turbidityViolation;

  // Calculate svg arc for circular progress of turbidity: 2 * PI * r = 2 * PI * 45 = 283 rounded.
  // percentage = (turbidity.value / maxSafe) * 100
  const maxSafeLimit = 5.0;
  const percentage = Math.min((turbidity.value / maxSafeLimit) * 100, 100);
  const strokeDashoffset = 283 - (283 * percentage) / 100;

  const handleAdjustPh = (val: number) => {
    onChangeState((prev) => ({
      ...prev,
      quality: {
        ...prev.quality,
        ph: { ...prev.quality.ph, value: parseFloat(val.toFixed(1)) }
      }
    }));
  };

  const handleAdjustTurbidity = (val: number) => {
    onChangeState((prev) => ({
      ...prev,
      quality: {
        ...prev.quality,
        turbidity: { ...prev.quality.turbidity, value: parseFloat(val.toFixed(1)) }
      }
    }));
  };

  const handleAdjustTds = (val: number) => {
    onChangeState((prev) => ({
      ...prev,
      quality: {
        ...prev.quality,
        tds: { ...prev.quality.tds, value: val }
      }
    }));
  };

  const handleAdjustChlorine = (val: number) => {
    onChangeState((prev) => ({
      ...prev,
      quality: {
        ...prev.quality,
        chlorine: { ...prev.quality.chlorine, value: parseFloat(val.toFixed(1)) }
      }
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6"
    >
      {/* Header and status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
        <div>
          <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-1">Zone 4 Main Artery</p>
          <h2 className="font-headline text-3xl font-light text-on-surfaces uppercase tracking-wide">Water Quality</h2>
        </div>

        {/* Status indicator */}
        <div className={`inline-flex items-center gap-2 glass border rounded-full px-4 py-2 self-start md:self-auto shadow-sm shadow-cyan-500/5 ${
          isHealthy ? 'border-cyan-500/30' : 'border-error-container'
        }`}>
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isHealthy ? 'bg-cyan-400' : 'bg-error'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${
              isHealthy ? 'bg-cyan-500' : 'bg-error'
            }`}></span>
          </span>
          <span className={`font-mono text-xs font-bold uppercase tracking-wider ${isHealthy ? 'text-cyan-400' : 'text-error'}`}>
            {isHealthy ? 'Safe for Consumption' : 'Quality Warnings Active'}
          </span>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* pH Card (Large) */}
        <div className="col-span-1 md:col-span-8 glass rounded-2xl p-6 flex flex-col relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/15 transition-colors duration-500"></div>

          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-cyan-500" />
              <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">pH Level (Real-time)</h3>
            </div>
            <Info className="h-4 w-4 text-outline-variant" />
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mt-auto relative z-10">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-5xl font-light tracking-tighter text-on-surfaces">{ph.value}</span>
                <span className="font-mono text-xs text-cyan-500 font-bold">pH</span>
              </div>
              <p className={`font-mono text-xs mt-2 flex items-center gap-1 font-semibold uppercase tracking-wider ${phOutOfRange ? 'text-error' : 'text-cyan-400'}`}>
                <TrendingUp className="h-4 w-4" />
                {phOutOfRange ? 'Outside Optimal (6.5 - 8.5)' : '+0.1 vs avg'}
              </p>
            </div>

            {/* Sparkline Representer */}
            <div className="w-full md:w-2/3 h-32 relative">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
                <defs>
                  <linearGradient id="gradient-ph" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path
                  className="sparkline-path"
                  d="M0,80 L40,75 L200,40 L280,30 L320,35 L360,20 L400,25"
                  fill="none"
                  stroke="#0891b2"
                  strokeWidth="3"
                ></path>
                <path
                  d="M0,80 L40,75 L200,40 L280,30 L320,35 L360,20 L400,25 L400,100 L0,100 Z"
                  fill="url(#gradient-ph)"
                  opacity="0.5"
                ></path>
                {/* Horizontal reference bands */}
                <line stroke="rgba(255,255,255,0.08)" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="400" y1="30" y2="30"></line>
                <line stroke="rgba(255,255,255,0.08)" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="400" y1="80" y2="80"></line>
              </svg>
              <div className="absolute bottom-0 left-0 w-full flex justify-between px-1 text-[10px] font-mono text-outline">
                <span>24H_AGO</span>
                <span>NOW</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-outline-variant relative z-10">
            <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block mb-1">Interactive Diagnostic Slider</span>
            <input
              type="range"
              min="5.0"
              max="9.5"
              step="0.1"
              value={ph.value}
              onChange={(e) => handleAdjustPh(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg cursor-pointer accent-cyan-500"
            />
          </div>
        </div>

        {/* Turbidity Circular Card */}
        <div className="col-span-1 md:col-span-4 glass rounded-2xl p-6 flex flex-col items-center justify-center relative hover:border-cyan-500/40 transition-all">
          <div className="absolute top-4 left-4 flex items-center gap-1">
            <Droplet className="h-4 w-4 text-cyan-500" />
            <h3 className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Turbidity</h3>
          </div>

          <div className="relative w-32 h-32 mt-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="45" stroke="rgba(255,255,255,0.05)" strokeWidth="8"></circle>
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="45"
                stroke={turbidityViolation ? '#f43f5e' : '#06b6d4'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline text-3xl font-light text-on-surfaces">{turbidity.value}</span>
              <span className="font-mono text-[10px] text-cyan-550 uppercase font-bold">NTU</span>
            </div>
          </div>

          <p className={`font-mono text-[10px] mt-4 uppercase tracking-wider ${turbidityViolation ? 'text-error' : 'text-cyan-400'} text-center`}>
            {turbidityViolation ? `Warning: Exceeds safe limit (< ${turbidity.maxSafe})` : `Within safe range (< ${turbidity.maxSafe})`}
          </p>

          <div className="w-full mt-4 pt-2 border-t border-outline-variant">
            <input
              type="range"
              min="0.1"
              max="10.0"
              step="0.1"
              value={turbidity.value}
              onChange={(e) => handleAdjustTurbidity(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg cursor-pointer accent-cyan-500"
            />
          </div>
        </div>

        {/* TDS Progress Card */}
        <div className="col-span-1 md:col-span-6 glass rounded-2xl p-4 flex flex-col gap-2 hover:border-cyan-500/40 transition-all">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">TDS Level</h3>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-headline text-3xl font-light text-on-surfaces">{tds.value}</span>
                <span className="font-mono text-[10px] text-cyan-500 uppercase font-bold">ppm</span>
              </div>
            </div>

            {/* mini progress details */}
            <div className="w-1/2">
              <div className="flex justify-between font-mono text-[9px] text-on-surface-variant mb-1 uppercase tracking-widest">
                <span>Optimal</span>
                <span>Warning</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((tds.value / 500) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-outline-variant">
            <input
              type="range"
              min="50"
              max="600"
              value={tds.value}
              onChange={(e) => handleAdjustTds(parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg cursor-pointer accent-cyan-500"
            />
          </div>
        </div>

        {/* Chlorine Levels progress */}
        <div className="col-span-1 md:col-span-6 glass rounded-2xl p-4 flex flex-col gap-2 hover:border-cyan-500/40 transition-all">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Chlorine (Residual)</h3>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-headline text-3xl font-light text-on-surfaces">{chlorine.value}</span>
                <span className="font-mono text-[10px] text-cyan-500 uppercase font-bold">mg/L</span>
              </div>
            </div>

            <div className="w-1/2">
              <div className="flex justify-between font-mono text-[9px] text-on-surface-variant mb-1 uppercase tracking-widest">
                <span>Min (0.2)</span>
                <span>Max (2.0)</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((chlorine.value / 2.5) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-outline-variant">
            <input
              type="range"
              min="0.1"
              max="2.5"
              step="0.1"
              value={chlorine.value}
              onChange={(e) => handleAdjustChlorine(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg cursor-pointer accent-cyan-500"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
