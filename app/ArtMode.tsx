"use client";

import { useRef, type CSSProperties } from "react";

type ArtModeProps = {
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleTrack: () => void;
};

function timestamp(seconds: number) {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}

export default function ArtMode({
  playing,
  currentTime,
  duration,
  volume,
  onSeek,
  onVolumeChange,
  onToggleTrack,
}: ArtModeProps) {
  const lastVolume = useRef(0.48);
  const progress =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  return (
    <div className="art-player" aria-label="Art Mode music player">
      <div className="art-track-info">
        <div className="art-track-copy">
          <p className="art-track-title">You weren’t here I really miss you</p>
        </div>
        <button
          className="button primary art-play"
          type="button"
          onClick={onToggleTrack}
          aria-label={playing ? "Pause Art Mode music" : "Play Art Mode music"}
          aria-pressed={playing}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d={playing ? "M6 4h4v16H6zm8 0h4v16h-4z" : "M8 4v16l12-8z"} />
          </svg>
        </button>
      </div>
      <div className="art-timeline">
        <span>{timestamp(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 1}
          step="0.1"
          value={Math.min(currentTime, duration || 0)}
          disabled={!duration}
          onChange={(event) => onSeek(Number(event.target.value))}
          aria-label="Seek music"
          aria-valuetext={`${timestamp(currentTime)} of ${timestamp(duration)}`}
          style={{ "--range-progress": `${progress}%` } as CSSProperties}
        />
        <span>{timestamp(duration)}</span>
      </div>
      <div className="art-volume">
        <button
          type="button"
          aria-label={volume > 0 ? "Mute music" : "Unmute music"}
          onClick={() => {
            if (volume > 0) {
              lastVolume.current = volume;
              onVolumeChange(0);
            } else {
              onVolumeChange(lastVolume.current);
            }
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="19"
            height="19"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M11 5 6 9H3v6h3l5 4V5Z" />
            {volume > 0 ? (
              <>
                <path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" />
              </>
            ) : (
              <path d="m16 9 6 6m0-6-6 6" />
            )}
          </svg>
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) => onVolumeChange(Number(event.target.value))}
          aria-label="Music volume"
          aria-valuetext={`${Math.round(volume * 100)} percent`}
          style={{ "--range-progress": `${volume * 100}%` } as CSSProperties}
        />
      </div>
    </div>
  );
}
