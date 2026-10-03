"use client";

import ArtMode from "./ArtMode";
import { useCallback, useEffect, useRef, useState } from "react";

const pages = ["Index", "Practice", "About", "Contact"];
const hashes = ["intro", "practice", "about", "contact"];
// Preserve bookmarks to the retired galleries by opening the new cover.
const artHashes = ["art", "digital-art", "3d-model", "video-editing", "miscellaneous"];
const themePreferenceKey = "vishwesh-portfolio-theme";

function readLocalStorage(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable in private or embedded mobile browsers.
  }
}

const disciplines = [
  { title: "Software", status: "Main", description: "Web interfaces and small software tools." },
  { title: "Hardware", status: "Learning", description: "Electronics, circuits, sensors, and physical computing." },
  { title: "Mechanics", status: "Learning", description: "Motion, mechanisms, materials, and fabrication." },
  { title: "Visual work", status: "Practice", description: "Drawing, video editing, pacing, and composition." },
  { title: "Mandarin", status: "Learning", description: "Vocabulary, listening, pronunciation, and reading." },
];

export default function Home() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const [isArtMode, setIsArtMode] = useState(false);
  const [isTrackPlaying, setIsTrackPlaying] = useState(false);
  const touchStart = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigationLabels = pages;
  const pageCount = navigationLabels.length;

  const goTo = useCallback((nextPage: number) => {
    if (isArtMode) return;
    const target = Math.max(0, Math.min(hashes.length - 1, nextPage));
    setPage((current) => {
      if (target === current) return current;
      setDirection(target > current ? "next" : "previous");
      return target;
    });
    window.history.replaceState(null, "", `#${hashes[target]}`);
  }, [isArtMode]);

  useEffect(() => {
    const currentHash = window.location.hash.slice(1);
    const artHashIndex = artHashes.indexOf(currentHash);
    const siteHashIndex = hashes.indexOf(currentHash);
    const prefersArtMode = readLocalStorage(themePreferenceKey) === "y2k";

    const frame = window.requestAnimationFrame(() => {
      if (artHashIndex >= 0 || (siteHashIndex < 0 && prefersArtMode)) {
        setIsArtMode(true);
        setPage(0);
        writeLocalStorage(themePreferenceKey, "y2k");
        window.history.replaceState(null, "", "#art");
        return;
      }

      setIsArtMode(false);
      if (siteHashIndex >= 0) setPage(siteHashIndex);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const exitArtMode = useCallback(() => {
    setIsArtMode(false);
    setPage(0);
    setDirection("next");
    writeLocalStorage(themePreferenceKey, "daylight");
    window.history.replaceState(null, "", "#intro");
    audioRef.current?.pause();
  }, []);

  const enterArtMode = () => {
    setPage(0);
    setDirection("next");

    setIsArtMode(true);
    writeLocalStorage(themePreferenceKey, "y2k");
    window.history.replaceState(null, "", "#art");

    const track = audioRef.current;
    if (track) {
      track.currentTime = 0;
      track.muted = false;
      track.volume = .48;
      void track.play().catch(() => setIsTrackPlaying(false));
    }
  };

  const toggleTrack = () => {
    const track = audioRef.current;
    if (!track) return;

    if (track.paused) {
      track.volume = .48;
      void track.play().catch(() => setIsTrackPlaying(false));
      return;
    }

    track.pause();
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isArtMode) {
        if (event.key === "Escape") exitArtMode();
        return;
      }
      if (event.key === "ArrowRight" || event.key === "PageDown") goTo(page + 1);
      if (event.key === "ArrowLeft" || event.key === "PageUp") goTo(page - 1);
      if (event.key === "Home") goTo(0);
      if (event.key === "End") goTo(pageCount - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [exitArtMode, goTo, isArtMode, page, pageCount]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStart.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const distance = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
    if (Math.abs(distance) > 55) goTo(page + (distance < 0 ? 1 : -1));
    touchStart.current = null;
  };

  return (
    <div className={isArtMode ? "art-mode" : `portfolio theme-${page}`}>
      <audio
        ref={audioRef}
        src="/art-mode-track.mp3"
        preload="metadata"
        loop
        onPlay={() => setIsTrackPlaying(true)}
        onPause={() => setIsTrackPlaying(false)}
        onError={() => setIsTrackPlaying(false)}
      />

      {isArtMode ? (
        <ArtMode playing={isTrackPlaying} onToggleTrack={toggleTrack} onExit={exitArtMode} />
      ) : (
        <>
          <div className="aura aura-one" aria-hidden="true" />
          <div className="aura aura-two" aria-hidden="true" />

          <div className="artboard">
            <header className="site-header">
              <button className="brand" type="button" onClick={() => goTo(0)} aria-label="Go to introduction">
                Vishwesh Mashruwala
              </button>

              <nav className="nav" aria-label="Portfolio pages">
                {navigationLabels.map((label, index) => (
                  <button type="button" key={label} onClick={() => goTo(index)} aria-current={page === index ? "page" : undefined}>
                    {label}
                  </button>
                ))}
              </nav>

              <div className="header-actions">
                <p className="availability"><span aria-hidden="true" />Open to software work</p>
                <button
                  className="theme-toggle"
                  type="button"
                  onClick={enterArtMode}
                  aria-pressed={isArtMode}
                  aria-label="Open art mode"
                >
                  <span className="theme-toggle-label">Art mode</span>
                  <span className="theme-toggle-track" aria-hidden="true">
                    <span />
                  </span>
                </button>
              </div>
            </header>

            <main
              className="page-stage"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <section key={`site-${page}`} className={`page-view enter-${direction}`} aria-live="polite" aria-label={`${pages[page]} page`}>
                {page === 0 && (
                  <div className="intro-page page-padding">
                    <div className="intro-meta">
                      <p>Software · self-employed</p>
                      <p>India · 23</p>
                    </div>

                    <div className="hero-object" aria-hidden="true" />

                    <div className="intro-copy">
                      <h1>Software. Hardware.<br /><span>Mechanics. Visuals.</span></h1>
                      <div className="intro-detail">
                        <p>I&apos;m Vishwesh, 23, based in India. Software is my main area; the rest are subjects I&apos;m actively learning or practising.</p>
                        <button type="button" onClick={() => goTo(1)}>View areas <span aria-hidden="true">→</span></button>
                      </div>
                    </div>
                  </div>
                )}

                {page === 1 && (
                  <div className="practice-page page-padding">
                    <div className="page-heading">
                      <p className="eyebrow">Practice</p>
                      <h2>Current<br />areas.</h2>
                      <p className="page-intro">These are not equal claims of experience. Software is the main area; the others are interests or ongoing studies.</p>
                    </div>

                    <div className="discipline-list" aria-label="Areas of practice">
                      {disciplines.map(({ title, status, description }) => (
                        <article key={title}>
                          <h3>{title}</h3>
                          <span>{status}</span>
                          <p>{description}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                {page === 2 && (
                  <div className="about-page page-padding">
                    <div className="page-heading">
                      <p className="eyebrow">About</p>
                      <h2>A short<br />background.</h2>
                    </div>

                    <div className="about-copy">
                      <p>I currently work independently and am looking for a software role or contract work. My experience is strongest in software.</p>
                      <p>Hardware, mechanical engineering, and electrical engineering are subjects I&apos;m learning—not claims of expertise. I also draw, edit video, and study Mandarin.</p>
                      <dl className="about-facts">
                        <div><dt>Status</dt><dd>Self-employed</dd></div>
                        <div><dt>Based</dt><dd>India</dd></div>
                        <div><dt>Age</dt><dd>23</dd></div>
                      </dl>
                    </div>
                  </div>
                )}

                {page === 3 && (
                  <div className="contact-page page-padding">
                    <p className="eyebrow">Contact</p>
                    <h2>Available for<br />software work.</h2>
                    <div className="contact-copy">
                      <p>I&apos;m open to full-time software roles, contract work, and small collaborations. Email is best; phone and WhatsApp work too.</p>
                      <div className="contact-methods">
                        <a href="mailto:vishweshmash86@gmail.com">
                          <span>Email</span>
                          <strong>vishweshmash86@gmail.com</strong>
                          <b aria-hidden="true">↗</b>
                        </a>
                        <a href="tel:+919537517519">
                          <span>Phone</span>
                          <strong>+91 95375 17519</strong>
                          <b aria-hidden="true">↗</b>
                        </a>
                        <a href="https://wa.me/919537517519" target="_blank" rel="noreferrer">
                          <span>WhatsApp</span>
                          <strong>Open WhatsApp</strong>
                          <b aria-hidden="true">↗</b>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

              </section>
            </main>

            <footer className="pagination" aria-label="Page navigation">
              <p>{String(page + 1).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}</p>
              <div className="page-dots">
                {navigationLabels.map((label, index) => (
                  <button type="button" key={label} className={page === index ? "active" : ""} onClick={() => goTo(index)} aria-label={`Go to ${label}`} aria-current={page === index ? "page" : undefined} />
                ))}
              </div>
              <div className="page-arrows">
                <button type="button" onClick={() => goTo(page - 1)} disabled={page === 0} aria-label="Previous page">←</button>
                <button type="button" onClick={() => goTo(page + 1)} disabled={page === pageCount - 1} aria-label="Next page">→</button>
              </div>
            </footer>
          </div>
        </>
      )}
    </div>
  );
}
