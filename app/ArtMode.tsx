"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";

type ArtModeProps = {
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleTrack: () => void;
  onExit: () => void;
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
  onExit,
}: ArtModeProps) {
  const lastVolume = useRef(0.48);
  const progress =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  return (
    <main className="art-cover" aria-label="Art Mode">
      <div className="art-atmosphere" aria-hidden="true">
        <div className="art-sun" />
        <div className="art-horizon" />
      </div>
      <header className="art-nav">
        <span className="art-brand">
          VishXDXD<span aria-hidden="true">✳</span>
        </span>
        <span className="art-mode-label">
          <i aria-hidden="true" /> Art mode
        </span>
        <button
          className="art-back"
          type="button"
          onClick={onExit}
          aria-label="Back to profile"
        >
          <span aria-hidden="true">↖</span> Back to profile <kbd>esc</kbd>
        </button>
      </header>

      <section className="art-scene" aria-labelledby="art-title">
        <div className="art-intro">
          <p className="art-eyebrow">Vishwesh / the visual side</p>
          <h1 id="art-title">
            I like
            <br />
            <em>making</em> things.
          </h1>
          <div className="art-intro-bottom">
            <span className="art-spark" aria-hidden="true">
              ✧
            </span>
            <p>
              A little space for art.
              <br />
              <span>Stay a while. Listen along.</span>
            </p>
          </div>
          <p className="art-notice">
            <span aria-hidden="true" /> Art space under construction
          </p>
        </div>

        <div
          className="art-composition"
          aria-label="Art Mode portrait composition"
          role="img"
        >
          <div className="art-orbit" aria-hidden="true" />
          <div className="art-photo art-photo-back" aria-hidden="true">
            <div className="art-photo-image">
              <Image
                src="/art-cover/portrait-left.png"
                alt=""
                fill
                priority
                sizes="(max-width: 700px) 45vw, 290px"
              />
            </div>
            <span className="art-photo-caption">a moment, held.</span>
          </div>
          <div className="art-photo art-photo-front" aria-hidden="true">
            <div className="art-photo-image">
              <Image
                src="/art-cover/portrait-right.png"
                alt=""
                fill
                priority
                sizes="(max-width: 700px) 50vw, 340px"
              />
            </div>
            <span className="art-photo-caption">
              somewhere in a daydream <span>✧</span>
            </span>
          </div>
          <span className="art-composition-star" aria-hidden="true">
            ✳
          </span>
          <span className="art-composition-note" aria-hidden="true">
            a softer frequency
          </span>
        </div>
      </section>

      <footer className="art-listening-area">
        <div className="art-player" aria-label="Art Mode music player">
          <div className="art-track-info">
            <div
              className={`art-disc ${playing ? "is-playing" : ""}`}
              aria-hidden="true"
            >
              <span />
            </div>
            <div className="art-track-copy">
              <p className="art-player-status">
                <span
                  className={`art-equalizer ${playing ? "is-playing" : ""}`}
                  aria-hidden="true"
                >
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                {playing ? "Now playing" : "Paused"}
                <span className="art-loop-label"> / on repeat</span>
              </p>
              <p className="art-track-title">
                You weren’t here I really miss you
              </p>
            </div>
            <button
              className="art-play"
              type="button"
              onClick={onToggleTrack}
              aria-label={
                playing ? "Pause Art Mode music" : "Play Art Mode music"
              }
              aria-pressed={playing}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d={playing ? "M6 4h4v16H6zm8 0h4v16h-4z" : "M8 4v16l12-8z"}
                />
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
              style={
                { "--range-progress": `${volume * 100}%` } as CSSProperties
              }
            />
          </div>
        </div>
        <div className="art-footnote">
          <span>Art & a little atmosphere.</span>
          <span>
            Surat, India <span aria-hidden="true">↗</span>
          </span>
        </div>
      </footer>
    </main>
  );
}
