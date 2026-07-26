"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const pages = ["Index", "Practice", "About", "Contact"];
const hashes = ["intro", "practice", "about", "contact"];
const artPages = [
  { title: "3D Art", nav: "3D Art", hash: "art", slug: "3d" },
  { title: "Digital Art", nav: "Digital", hash: "digital-art", slug: "digital" },
  { title: "Video Editing", nav: "Video", hash: "video-editing", slug: "video" },
  { title: "Photos", nav: "Photos", hash: "photos", slug: "photos" },
];
const artHashes = artPages.map(({ hash }) => hash);
const introSeenKey = "vishwesh-portfolio-intro-seen";
const themePreferenceKey = "vishwesh-portfolio-theme";

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
  const [introPhase, setIntroPhase] = useState<"checking" | "active" | "leaving" | "hidden">("checking");
  const [isY2K, setIsY2K] = useState(false);
  const [isTrackPlaying, setIsTrackPlaying] = useState(false);
  const touchStart = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const introRevealFrame = useRef<number | null>(null);
  const introTimers = useRef<number[]>([]);
  const navigationLabels = isY2K ? artPages.map(({ nav }) => nav) : pages;
  const pageCount = navigationLabels.length;

  const goTo = useCallback((nextPage: number) => {
    const target = Math.max(0, Math.min((isY2K ? artHashes : hashes).length - 1, nextPage));
    setPage((current) => {
      if (target === current) return current;
      setDirection(target > current ? "next" : "previous");
      return target;
    });
    window.history.replaceState(null, "", `#${(isY2K ? artHashes : hashes)[target]}`);
  }, [isY2K]);

  useEffect(() => {
    const currentHash = window.location.hash.slice(1);
    const artHashIndex = artHashes.indexOf(currentHash);
    const siteHashIndex = hashes.indexOf(currentHash);
    const prefersArtMode = window.localStorage.getItem(themePreferenceKey) === "y2k";

    const frame = window.requestAnimationFrame(() => {
      if (artHashIndex >= 0 || (siteHashIndex < 0 && prefersArtMode)) {
        setIsY2K(true);
        setPage(artHashIndex >= 0 ? artHashIndex : 0);
        window.localStorage.setItem(themePreferenceKey, "y2k");
        if (artHashIndex < 0) window.history.replaceState(null, "", "#art");
        return;
      }

      setIsY2K(false);
      if (siteHashIndex >= 0) setPage(siteHashIndex);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isY2K;
    setIsY2K(nextTheme);
    setPage(0);
    setDirection("next");
    window.localStorage.setItem(themePreferenceKey, nextTheme ? "y2k" : "daylight");
    window.history.replaceState(null, "", nextTheme ? "#art" : "#intro");

    if (nextTheme && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.muted = false;
      audioRef.current.volume = .48;
      void audioRef.current.play().catch(() => setIsTrackPlaying(false));
    } else {
      audioRef.current?.pause();
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

  const dismissIntro = useCallback(() => {
    if (introRevealFrame.current !== null) window.cancelAnimationFrame(introRevealFrame.current);
    introTimers.current.forEach((timer) => window.clearTimeout(timer));
    introTimers.current = [];
    window.sessionStorage.setItem(introSeenKey, "true");
    setIntroPhase((current) => current === "hidden" ? current : "leaving");
    introTimers.current = [window.setTimeout(() => setIntroPhase("hidden"), 620)];
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasSeenIntro = window.sessionStorage.getItem(introSeenKey) === "true";

    if (prefersReducedMotion || hasSeenIntro) {
      introRevealFrame.current = window.requestAnimationFrame(() => setIntroPhase("hidden"));
      return () => {
        if (introRevealFrame.current !== null) window.cancelAnimationFrame(introRevealFrame.current);
      };
    }

    introRevealFrame.current = window.requestAnimationFrame(() => setIntroPhase("active"));
    const leaveTimer = window.setTimeout(() => setIntroPhase("leaving"), 2250);
    const hideTimer = window.setTimeout(() => {
      window.sessionStorage.setItem(introSeenKey, "true");
      setIntroPhase("hidden");
    }, 2870);
    introTimers.current = [leaveTimer, hideTimer];

    return () => {
      if (introRevealFrame.current !== null) window.cancelAnimationFrame(introRevealFrame.current);
      introTimers.current.forEach((timer) => window.clearTimeout(timer));
      introTimers.current = [];
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (introPhase !== "hidden") {
        if (event.key === "Escape") dismissIntro();
        return;
      }

      if (event.key === "ArrowRight" || event.key === "PageDown") goTo(page + 1);
      if (event.key === "ArrowLeft" || event.key === "PageUp") goTo(page - 1);
      if (event.key === "Home") goTo(0);
      if (event.key === "End") goTo(pageCount - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dismissIntro, goTo, introPhase, page, pageCount]);

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
    <div className={`portfolio theme-${page}${isY2K ? " mode-y2k" : ""}`}>
      <audio
        ref={audioRef}
        src="/art-mode-track.mp3"
        preload="metadata"
        loop
        onPlay={() => setIsTrackPlaying(true)}
        onPause={() => setIsTrackPlaying(false)}
      />

      {introPhase !== "hidden" && (
        <div className={`intro-loader intro-loader--${introPhase}`}>
          <div className="intro-wheel" aria-hidden="true" />
          <button type="button" onClick={dismissIntro} aria-label="Skip opening animation">
            Skip
          </button>
        </div>
      )}

      <div className="aura aura-one" aria-hidden="true" />
      <div className="aura aura-two" aria-hidden="true" />

      <div className="artboard">
        <header className="site-header">
          <button className="brand" type="button" onClick={() => goTo(0)} aria-label={isY2K ? "Go to art canvas" : "Go to introduction"}>
            {isY2K ? "Vishwesh" : "Vishwesh Mashruwala"}
          </button>

          <nav className={`nav${isY2K ? " art-nav" : ""}`} aria-label={isY2K ? "Art sections" : "Portfolio pages"}>
            {navigationLabels.map((label, index) => (
              <button type="button" key={label} onClick={() => goTo(index)} aria-current={page === index ? "page" : undefined}>
                {label}
              </button>
            ))}
          </nav>

          <div className="header-actions">
            {!isY2K && <p className="availability"><span aria-hidden="true" />Open to software work</p>}
            {isY2K && (
              <button
                className={`music-toggle${isTrackPlaying ? " is-playing" : ""}`}
                type="button"
                onClick={toggleTrack}
                aria-pressed={isTrackPlaying}
                aria-label={isTrackPlaying ? "Pause Art Mode music" : "Play Art Mode music"}
              >
                <span className="music-levels" aria-hidden="true"><i /><i /><i /></span>
                <span>{isTrackPlaying ? "Pause" : "Play"}</span>
              </button>
            )}
            <button
              className="theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-pressed={isY2K}
              aria-label={isY2K ? "Return to software portfolio" : "Open art mode"}
            >
              <span className="theme-toggle-label">{isY2K ? "Portfolio" : "Art mode"}</span>
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
          <section key={`${isY2K ? "art" : "site"}-${page}`} className={`page-view enter-${direction}`} aria-live="polite" aria-label={isY2K ? `${artPages[page].title} section` : `${pages[page]} page`}>
            {!isY2K && page === 0 && (
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

            {!isY2K && page === 1 && (
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

            {!isY2K && page === 2 && (
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

            {!isY2K && page === 3 && (
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

            {isY2K && (
              <div className={`art-coming-page art-coming-${artPages[page].slug}`}>
                <p className="art-coming-index">{String(page + 1).padStart(2, "0")} / {String(artPages.length).padStart(2, "0")}</p>
                <div className="art-coming-object" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="art-coming-copy">
                  <h1>{artPages[page].title}</h1>
                  <p>Coming soon.</p>
                </div>
              </div>
            )}
          </section>
        </main>

        <footer className="pagination" aria-label={isY2K ? "Art section navigation" : "Page navigation"}>
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
    </div>
  );
}
