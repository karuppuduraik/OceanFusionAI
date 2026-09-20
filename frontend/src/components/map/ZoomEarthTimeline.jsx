import React from 'react';
import { FiPlay, FiPause, FiChevronUp, FiChevronDown, FiSkipForward } from 'react-icons/fi';

export default function ZoomEarthTimeline({
  frames = [],
  radarFrames = [], // backward compatibility
  currentFrameIndex = 0,
  onSelectFrame,
  isPlaying = false,
  onTogglePlay,
  selectedModel = 'ICON 13 km',
  onSelectModel,
  activeLayer = 'satellite',
  className = '',
}) {
  const models = ['ICON 13 km', 'GFS 22 km', 'ECMWF 9 km'];
  const activeFrames = frames.length > 0 ? frames : radarFrames;

  // Active frame time display
  const activeFrame = activeFrames[currentFrameIndex];
  const now = new Date();

  const displayDate = activeFrame?.formattedDate || '17 Sept';
  const displayHours =
    activeFrame?.hours ||
    (activeFrame?.formattedTime ? activeFrame.formattedTime.split(':')[0] : String(now.getHours()).padStart(2, '0'));
  const displayMinutes =
    activeFrame?.minutes ||
    (activeFrame?.formattedTime ? activeFrame.formattedTime.split(':')[1] : String(now.getMinutes()).padStart(2, '0'));

  const stepNext = () => {
    if (activeFrames.length === 0) return;
    const nextIdx = currentFrameIndex < activeFrames.length - 1 ? currentFrameIndex + 1 : 0;
    onSelectFrame?.(nextIdx);
  };

  const stepPrev = () => {
    if (activeFrames.length === 0) return;
    const prevIdx = currentFrameIndex > 0 ? currentFrameIndex - 1 : activeFrames.length - 1;
    onSelectFrame?.(prevIdx);
  };

  // Hour jump: jump ~1 hour (approx 4 frames of 15m, or 6 frames of 10m)
  const hourStep = Math.max(1, Math.round(activeFrames.length / 3));
  const handleHourUp = () => {
    if (activeFrames.length === 0) return;
    const nextIdx = (currentFrameIndex + hourStep) % activeFrames.length;
    onSelectFrame?.(nextIdx);
  };

  const handleHourDown = () => {
    if (activeFrames.length === 0) return;
    const prevIdx = (currentFrameIndex - hourStep + activeFrames.length) % activeFrames.length;
    onSelectFrame?.(prevIdx);
  };

  const handleMinuteUp = () => stepNext();
  const handleMinuteDown = () => stepPrev();

  return (
    <div className={`flex items-center gap-2 select-none pointer-events-auto ${className}`}>
      {/* Zoom Earth exact timeline controller matching user screenshot:
          [ ▶ ] 17 Sept  ▲ 13 ▼ : ▲ 20 ▼  [ ⏭ ] */}
      <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl px-3.5 py-1.5 flex items-center gap-2.5 sm:gap-3.5 text-white">
        {/* Play/Pause Button */}
        <button
          onClick={onTogglePlay}
          className="w-8 h-8 rounded-xl hover:bg-white/15 flex items-center justify-center transition-all text-white active:scale-95 flex-shrink-0"
          title={isPlaying ? 'Pause Loop' : `Play Live ${activeLayer === 'satellite' ? 'Satellite' : 'Radar'} Loop`}
        >
          {isPlaying ? (
            <FiPause className="w-4 h-4 fill-white text-white" />
          ) : (
            <FiPlay className="w-4 h-4 fill-white text-white ml-0.5" />
          )}
        </button>

        {/* Date Display (e.g. "17 Sept") */}
        <span className="text-xs sm:text-sm font-semibold text-slate-100 tracking-tight whitespace-nowrap px-1">
          {displayDate}
        </span>

        {/* Hours Control with Up & Down Chevrons */}
        <div className="flex flex-col items-center justify-center -space-y-1">
          <button
            onClick={handleHourUp}
            className="text-slate-400 hover:text-white p-0.5 transition-colors leading-none"
            title="Advance 1 Hour"
          >
            <FiChevronUp className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs sm:text-sm font-bold font-mono tracking-wider text-white select-none leading-none py-0.5">
            {displayHours}
          </span>
          <button
            onClick={handleHourDown}
            className="text-slate-400 hover:text-white p-0.5 transition-colors leading-none"
            title="Previous 1 Hour"
          >
            <FiChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Separator Colon */}
        <span className="text-xs sm:text-sm font-bold text-white/80 select-none pb-0.5">
          :
        </span>

        {/* Minutes Control with Up & Down Chevrons */}
        <div className="flex flex-col items-center justify-center -space-y-1">
          <button
            onClick={handleMinuteUp}
            className="text-slate-400 hover:text-white p-0.5 transition-colors leading-none"
            title="Advance 1 Frame"
          >
            <FiChevronUp className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs sm:text-sm font-bold font-mono tracking-wider text-white select-none leading-none py-0.5">
            {displayMinutes}
          </span>
          <button
            onClick={handleMinuteDown}
            className="text-slate-400 hover:text-white p-0.5 transition-colors leading-none"
            title="Previous 1 Frame"
          >
            <FiChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Skip Forward Button */}
        <button
          onClick={stepNext}
          className="w-8 h-8 rounded-xl hover:bg-white/15 flex items-center justify-center transition-all text-white active:scale-95 flex-shrink-0"
          title="Step Forward"
        >
          <FiSkipForward className="w-4 h-4 fill-white text-white" />
        </button>

        {/* Live Pulse Indicator */}
        <div className="hidden md:flex items-center gap-1 pl-2 border-l border-white/15 text-[10px] font-bold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE</span>
        </div>
      </div>
    </div>
  );
}
