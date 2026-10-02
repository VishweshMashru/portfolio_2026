"use client";

import Image from "next/image";

type ArtModeProps = {
  playing: boolean;
  onToggleTrack: () => void;
  onExit: () => void;
};

export default function ArtMode({ playing, onToggleTrack, onExit }: ArtModeProps) {
  return (
    <main className="art-cover" aria-label="Art Mode">
      <div className="art-cover-portrait art-cover-portrait--left" aria-hidden="true">
        <Image src="/art-cover/portrait-left.png" alt="" fill priority sizes="(max-width: 760px) 112vw, 58vw" />
      </div>
      <div className="art-cover-portrait art-cover-portrait--right" aria-hidden="true">
        <Image src="/art-cover/portrait-right.png" alt="" fill priority sizes="(max-width: 760px) 108vw, 45vw" />
      </div>

      <header className="art-cover-navbar">
        <nav aria-label="Art Mode navigation">
          <div className="art-cover-intro">
            <h1 className="art-cover-wordmark">
              <button type="button" onClick={onExit} aria-label="Return to software portfolio" title="Return to software portfolio (Esc)">
                VishXDXD
              </button>
            </h1>
            <p className="art-cover-tagline">I like making things.</p>
          </div>
          <button className="art-cover-exit" type="button" onClick={onExit} aria-label="Back to profile">
            <span aria-hidden="true">←</span>
            <span className="art-cover-exit-label">Back to profile</span>
            <span className="art-cover-exit-compact" aria-hidden="true">Back</span>
          </button>
        </nav>
      </header>

      <p className="art-cover-notice">
        <span aria-hidden="true" />
        Site under construction
      </p>

      <footer className="art-cover-player">
        <button
          type="button"
          onClick={onToggleTrack}
          aria-label={playing ? "Pause Art Mode music" : "Play Art Mode music"}
          aria-pressed={playing}
          title={playing ? "Pause music" : "Play music"}
        >
          <span className="art-cover-player-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d={playing ? "M6 4h4v16H6zm8 0h4v16h-4z" : "M7 4v16l13-8z"} />
            </svg>
          </span>
          <span className="art-cover-track">
            <span className="art-cover-track-status">{playing ? "Now playing:" : "Paused:"}</span>{" "}
            <span className="art-cover-track-title">You weren’t here I really miss you</span>
          </span>
        </button>
      </footer>
    </main>
  );
}
