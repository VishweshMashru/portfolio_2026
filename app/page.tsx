"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

const ObjArtwork = dynamic(() => import("./ObjArtwork"), {
  ssr: false,
  loading: () => (
    <div className="obj-artwork-shell">
      <p className="obj-artwork-status is-loading">Loading model…</p>
    </div>
  ),
});

const pages = ["Index", "Practice", "About", "Contact"];
const hashes = ["intro", "practice", "about", "contact"];
const artPages = [
  {
    title: "3D objects",
    nav: "Objects",
    hash: "art",
    slug: "3d",
    kicker: "Object study 001",
    note: "An early Blender scene, rebuilt as a small object you can turn in the browser.",
    details: ["First Bloom", "Blender + Three.js", "2026"],
  },
  {
    title: "Digital sketches",
    nav: "Drawings",
    hash: "digital-art",
    slug: "digital",
    kicker: "Drawing study 001",
    note: "Loose character studies kept inside the drawing desk—interface, empty space, and all.",
    details: ["Character studies", "Krita", "In progress"],
  },
  {
    title: "Motion loops",
    nav: "Motion",
    hash: "video-editing",
    slug: "video",
    kicker: "Motion study 001",
    note: "A quick timing exercise: one drawn wheel, a short loop, and a little controlled chaos.",
    details: ["Wheel study", "Procreate", "2.7 sec loop"],
  },
  {
    title: "Photo diary",
    nav: "Photos",
    hash: "photos",
    slug: "photos",
    kicker: "Personal archive",
    note: "A quiet shelf for photographs and visual notes. The first roll is still being selected.",
    details: ["Everyday frames", "Personal", "Opening soon"],
  },
];
const artHashes = artPages.map(({ hash }) => hash);
const themePreferenceKey = "vishwesh-portfolio-theme";
const artTransitionExitMs = 620;

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
  const [artTransitionPhase, setArtTransitionPhase] = useState<"hidden" | "playing" | "leaving">("hidden");
  const [isY2K, setIsY2K] = useState(false);
  const [isTrackPlaying, setIsTrackPlaying] = useState(false);
  const touchStart = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const artTransitionVideoRef = useRef<HTMLVideoElement | null>(null);
  const artTransitionActiveRef = useRef(false);
  const artTransitionTimer = useRef<number | null>(null);
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
    const prefersArtMode = readLocalStorage(themePreferenceKey) === "y2k";

    const frame = window.requestAnimationFrame(() => {
      if (artHashIndex >= 0 || (siteHashIndex < 0 && prefersArtMode)) {
        setIsY2K(true);
        setPage(artHashIndex >= 0 ? artHashIndex : 0);
        writeLocalStorage(themePreferenceKey, "y2k");
        if (artHashIndex < 0) window.history.replaceState(null, "", "#art");
        return;
      }

      setIsY2K(false);
      if (siteHashIndex >= 0) setPage(siteHashIndex);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const finishArtTransition = useCallback(() => {
    if (!artTransitionActiveRef.current) return;
    artTransitionActiveRef.current = false;
    artTransitionVideoRef.current?.pause();
    setArtTransitionPhase("leaving");

    const track = audioRef.current;
    if (track) {
      track.muted = false;
      track.volume = .48;
      if (track.paused) void track.play().catch(() => setIsTrackPlaying(false));
    }

    if (artTransitionTimer.current !== null) window.clearTimeout(artTransitionTimer.current);
    artTransitionTimer.current = window.setTimeout(() => {
      setArtTransitionPhase("hidden");
      artTransitionTimer.current = null;
    }, artTransitionExitMs);
  }, []);

  const toggleTheme = () => {
    setPage(0);
    setDirection("next");

    if (isY2K) {
      artTransitionActiveRef.current = false;
      artTransitionVideoRef.current?.pause();
      setArtTransitionPhase("hidden");
      setIsY2K(false);
      writeLocalStorage(themePreferenceKey, "daylight");
      window.history.replaceState(null, "", "#intro");
      audioRef.current?.pause();
      return;
    }

    setIsY2K(true);
    writeLocalStorage(themePreferenceKey, "y2k");
    window.history.replaceState(null, "", "#art");

    const track = audioRef.current;
    if (track) {
      track.currentTime = 0;
      track.muted = false;
      track.volume = 0;
      void track.play().catch(() => setIsTrackPlaying(false));
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (track) track.volume = .48;
      return;
    }

    const video = artTransitionVideoRef.current;
    if (!video) {
      if (track) track.volume = .48;
      return;
    }

    artTransitionActiveRef.current = true;
    setArtTransitionPhase("playing");
    video.currentTime = 0;
    video.muted = false;
    video.volume = 1;
    void video.play().catch(finishArtTransition);
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
    return () => {
      if (artTransitionTimer.current !== null) window.clearTimeout(artTransitionTimer.current);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (artTransitionPhase !== "hidden") {
        if (event.key === "Escape") finishArtTransition();
        return;
      }

      if (event.key === "ArrowRight" || event.key === "PageDown") goTo(page + 1);
      if (event.key === "ArrowLeft" || event.key === "PageUp") goTo(page - 1);
      if (event.key === "Home") goTo(0);
      if (event.key === "End") goTo(pageCount - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [artTransitionPhase, finishArtTransition, goTo, page, pageCount]);

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

      <div className={`art-transition art-transition--${artTransitionPhase}`} aria-hidden={artTransitionPhase === "hidden"}>
        <video
          ref={artTransitionVideoRef}
          className="art-transition-video"
          src="/mahoragawheel.mp4"
          playsInline
          preload="auto"
          disablePictureInPicture
          onEnded={finishArtTransition}
          onError={finishArtTransition}
        />
        {artTransitionPhase !== "hidden" && (
          <button className="art-transition-skip" type="button" onClick={finishArtTransition}>
            Skip to Art mode
          </button>
        )}
      </div>

      <div className="aura aura-one" aria-hidden="true" />
      <div className="aura aura-two" aria-hidden="true" />

      <div className="artboard">
        <header className="site-header">
          <button className="brand" type="button" onClick={() => goTo(0)} aria-label={isY2K ? "Go to art canvas" : "Go to introduction"}>
            {isY2K ? "Vishwesh / personal work" : "Vishwesh Mashruwala"}
          </button>

          <nav className={`nav${isY2K ? " art-nav" : ""}`} aria-label={isY2K ? "Art sections" : "Portfolio pages"}>
            {navigationLabels.map((label, index) => (
              <button type="button" key={label} onClick={() => goTo(index)} aria-current={page === index ? "page" : undefined}>
                {isY2K && <span className="nav-number" aria-hidden="true">0{index + 1}</span>}
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
              <div
                className={`art-gallery art-gallery--${artPages[page].slug}`}
                data-index={String(page + 1).padStart(2, "0")}
              >
                <div className="art-gallery-meta">
                  <span>Vishwesh Mashruwala · studio index</span>
                  <span>{String(page + 1).padStart(2, "0")} / {String(artPages.length).padStart(2, "0")}</span>
                </div>

                <aside className="art-story">
                  <p className="art-kicker">{artPages[page].kicker}</p>
                  <h1>{artPages[page].title}</h1>
                  <p className="art-note">{artPages[page].note}</p>
                  <ul className="art-details" aria-label="Artwork details">
                    {artPages[page].details.map((detail) => <li key={detail}>{detail}</li>)}
                  </ul>
                </aside>

                {page === 0 && (
                  <div className="art-media art-media--3d">
                    <div className="art-model-stage">
                      <ObjArtwork />
                      <p className="art-model-label"><span aria-hidden="true" /> Interactive object</p>
                    </div>
                    <figure className="art-render-card">
                      <div className="art-render-image">
                        <Image
                          src="/first-blend.png"
                          alt="Final render of Vishwesh's first Blender scene"
                          fill
                          priority
                          sizes="(max-width: 580px) 34vw, 17vw"
                        />
                      </div>
                      <figcaption><span>Final render</span><span>01</span></figcaption>
                    </figure>
                    <p className="art-media-note">drag the scene to rotate</p>
                  </div>
                )}

                {page === 1 && (
                  <div className="art-media art-media--digital">
                    <figure className="art-drawing-window">
                      <div className="art-drawing-image">
                        <Image
                          src="/digital-sketch.png"
                          alt="Vishwesh's character drawing studies open in Krita"
                          fill
                          priority
                          sizes="(max-width: 580px) 106vw, 62vw"
                        />
                      </div>
                      <figcaption><span>Working file · gi.kra</span><span>4000 × 4000</span></figcaption>
                    </figure>
                    <figure className="art-drawing-detail">
                      <Image
                        src="/digital-sketch.png"
                        alt="Detail of a character face study"
                        fill
                        sizes="(max-width: 580px) 30vw, 15vw"
                      />
                      <figcaption>detail / 01</figcaption>
                    </figure>
                  </div>
                )}

                {page === 2 && (
                  <div className="art-media art-media--video">
                    <figure className="art-video-window">
                      <div className="art-video-screen">
                        <video
                          src="/mahoragawheel.mp4"
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          onCanPlay={(event) => void event.currentTarget.play()}
                          aria-label="A rough spinning wheel animation made by Vishwesh"
                        />
                        <span className="art-video-live">Looping</span>
                      </div>
                      <figcaption><span>Motion test · 24 fps</span><span>00:03</span></figcaption>
                    </figure>
                    <p className="art-video-type" aria-hidden="true">spin<br />study</p>
                  </div>
                )}

                {page === 3 && (
                  <div className="art-media art-media--photos" aria-label="Photo diary opening soon">
                    <div className="art-photo-slot">
                      <div className="art-photo-phone" aria-hidden="true" />
                      <p><span>Roll 001</span> still developing</p>
                    </div>
                    <div className="art-photo-message">
                      <span>0 images</span>
                      <p>Nothing rushed.<br />The photographs arrive when they are ready.</p>
                    </div>
                  </div>
                )}
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
