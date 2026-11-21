"use client";

import Image from "next/image";
import ArtMode from "./ArtMode";
import ArtGallery from "./ArtGallery";
import Icon, { type IconName } from "./components/Icon";
import { useCallback, useEffect, useRef, useState } from "react";

// Keep the original Art Mode preference and all retired gallery bookmarks.
const artHashes = [
  "art",
  "japres",
  "digital-art",
  "3d-model",
  "video-editing",
  "miscellaneous",
  "fubuki",
  "paint-study",
  "character-sketch",
  "first-blender-scene",
];
const themePreferenceKey = "vishwesh-portfolio-theme";
const colorPreferenceKey = "vishwesh-portfolio-color";
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
    /* Private or embedded browser. */
  }
}

const disciplines: {
  title: string;
  status: string;
  description: string;
  icon: IconName;
}[] = [
  {
    title: "Software",
    status: "Main",
    description: "Web interfaces and small software tools.",
    icon: "code",
  },
  {
    title: "Hardware",
    status: "Learning",
    description: "Electronics, circuits, sensors, and physical computing.",
    icon: "chip",
  },
  {
    title: "Mechanics",
    status: "Learning",
    description: "Motion, mechanisms, materials, and fabrication.",
    icon: "gear",
  },
  {
    title: "Visual work",
    status: "Practice",
    description: "Drawing, video editing, pacing, and composition.",
    icon: "pen",
  },
  {
    title: "Mandarin",
    status: "Learning",
    description: "Vocabulary, listening, pronunciation, and reading.",
    icon: "language",
  },
];
const searchItems = [
  {
    label: "Introduction",
    description: "Vishwesh Mashruwala · Surat, India",
    hash: "intro",
  },
  ...disciplines.map((item) => ({
    label: item.title,
    description: item.description,
    hash: `practice-${item.title.toLowerCase().replaceAll(" ", "-")}`,
  })),
  {
    label: "About",
    description: "Self-employed · 23 · Background",
    hash: "about",
  },
  {
    label: "Art mode",
    description: "VishXDXD · I like making things.",
    hash: "art",
  },
  {
    label: "Contact",
    description: "Email · Phone · WhatsApp",
    hash: "contact",
  },
];

function LocalClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="local-clock">
      <span>SURAT, INDIA · IST</span>
      <time aria-label="Current time in Surat, India">
        {time || "--:--:--"}
      </time>
    </div>
  );
}
function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{label}</p>
      <h2>{title}</h2>
    </div>
  );
}

export default function Home() {
  const [isArtMode, setIsArtMode] = useState(false);
  const [isTrackPlaying, setIsTrackPlaying] = useState(false);
  const [trackTime, setTrackTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [trackVolume, setTrackVolume] = useState(0.48);
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const searchInput = useRef<HTMLInputElement | null>(null);
  const searchTrigger = useRef<HTMLButtonElement | null>(null);
  const artTrigger = useRef<HTMLButtonElement | null>(null);
  const artActive = useRef(false);

  const setMode = useCallback((art: boolean) => {
    artActive.current = art;
    setIsArtMode(art);
    if (!art) audioRef.current?.pause();
  }, []);

  useEffect(() => {
    const syncHash = (initial = false) => {
      const hash = window.location.hash.slice(1);
      const profileLink =
        ["intro", "practice", "about", "contact"].includes(hash) ||
        hash.startsWith("practice-");
      const art =
        !profileLink &&
        (artHashes.includes(hash) ||
          (initial
            ? readLocalStorage(themePreferenceKey) === "y2k"
            : artActive.current));
      setMode(art);
      if (art) {
        writeLocalStorage(themePreferenceKey, "y2k");
        if (!hash || ["video-editing", "miscellaneous"].includes(hash))
          window.history.replaceState(null, "", "#art");
      }
      if (hash)
        requestAnimationFrame(() =>
          document.getElementById(hash)?.scrollIntoView(),
        );
    };
    const frame = requestAnimationFrame(() => {
      syncHash(true);
      const duration = audioRef.current?.duration;
      if (duration && Number.isFinite(duration)) setTrackDuration(duration);
      setDark(readLocalStorage(colorPreferenceKey) === "dark");
    });
    const onHashChange = () => syncHash();
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onHashChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onHashChange);
    };
  }, [setMode]);

  const exitArtMode = useCallback(() => {
    setMode(false);
    writeLocalStorage(themePreferenceKey, "daylight");
    window.history.replaceState(null, "", "#intro");
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      artTrigger.current?.focus({ preventScroll: true });
    });
  }, [setMode]);

  const enterArtMode = () => {
    dialogRef.current?.close();
    if (artActive.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setMode(true);
    writeLocalStorage(themePreferenceKey, "y2k");
    window.history.replaceState(null, "", "#art");
    window.scrollTo({ top: 0, behavior: "instant" });
    const track = audioRef.current;
    if (track) {
      if (Number.isFinite(track.duration)) setTrackDuration(track.duration);
      track.currentTime = 0;
      track.muted = false;
      track.volume = 0.48;
      setTrackVolume(0.48);
      setTrackTime(0);
      void track
        .play()
        .then(() => {
          if (!artActive.current) track.pause();
        })
        .catch(() => setIsTrackPlaying(false));
    }
  };
  const toggleTrack = () => {
    const track = audioRef.current;
    if (!track) return;
    if (track.paused) {
      track.volume = trackVolume;
      void track
        .play()
        .then(() => {
          if (!artActive.current) track.pause();
        })
        .catch(() => setIsTrackPlaying(false));
    } else track.pause();
  };
  const openSearch = useCallback(() => {
    setQuery("");
    dialogRef.current?.showModal();
    searchInput.current?.focus();
  }, []);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        isArtMode &&
        event.key === "Escape" &&
        !document.querySelector("dialog[open]")
      ) {
        exitArtMode();
        return;
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [exitArtMode, isArtMode, openSearch]);
  const gallerySearchItems = [
    {
      label: "JapRes",
      description: "Neon ramen shop · Blender scene · interactive 3D",
      hash: "japres",
    },
    {
      label: "Fubuki",
      description: "Black-and-white digital drawing",
      hash: "fubuki",
    },
    {
      label: "Digital art",
      description: "Character drawings and paintings",
      hash: "digital-art",
    },
    {
      label: "Character painting",
      description: "Digital painting study",
      hash: "paint-study",
    },
    {
      label: "Character sketches",
      description: "Earlier character drawing study",
      hash: "character-sketch",
    },
    {
      label: "Blender studies",
      description: "First Blender scene and interactive model",
      hash: "3d-model",
    },
  ];
  const results = (isArtMode ? gallerySearchItems : searchItems).filter(
    (item) =>
      `${item.label} ${item.description}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );

  return (
    <div
      className={isArtMode ? "portfolio art-mode" : "portfolio"}
      data-theme={dark ? "dark" : "light"}
    >
      <audio
        ref={audioRef}
        src="/art-mode-track.mp3"
        preload="metadata"
        loop
        onPlay={() => setIsTrackPlaying(true)}
        onPause={() => setIsTrackPlaying(false)}
        onError={() => setIsTrackPlaying(false)}
        onTimeUpdate={(event) => setTrackTime(event.currentTarget.currentTime)}
        onDurationChange={(event) => {
          const duration = event.currentTarget.duration;
          setTrackDuration(Number.isFinite(duration) ? duration : 0);
        }}
      />
      <a href={isArtMode ? "#art" : "#intro"} className="skip-link">
        Skip to content
      </a>
      <header className="floating-nav">
        <nav aria-label="Portfolio navigation">
          <a
            className="nav-monogram"
            href={isArtMode ? "#art" : "#intro"}
            aria-label={
              isArtMode
                ? "Art gallery introduction"
                : "Vishwesh Mashruwala — introduction"
            }
          >
            vm<span>.</span>
          </a>
          <a href={isArtMode ? "#digital-art" : "#practice"}>
            {isArtMode ? "Digital" : "Practice"}
          </a>
          <a className="nav-about" href={isArtMode ? "#3d-model" : "#about"}>
            {isArtMode ? "3D" : "About"}
          </a>
          <button
            ref={artTrigger}
            className="art-toggle"
            type="button"
            onClick={isArtMode ? exitArtMode : enterArtMode}
            aria-label={isArtMode ? "Back to profile" : "Open art mode"}
            aria-pressed={isArtMode}
          >
            <Icon name="pen" />
            <span>Art mode</span>
          </button>
          <span className="nav-divider" />
          <button
            ref={searchTrigger}
            className="icon-button"
            type="button"
            onClick={openSearch}
            aria-label="Search portfolio"
            title="Search (⌘/Ctrl K)"
          >
            <Icon name="search" />
          </button>
          <button
            className="icon-button theme-button"
            type="button"
            onClick={() => {
              setDark(!dark);
              writeLocalStorage(colorPreferenceKey, !dark ? "dark" : "light");
            }}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          >
            <Icon name={dark ? "moon" : "sun"} />
          </button>
        </nav>
      </header>
      <main
        className="portfolio-container"
        aria-label={isArtMode ? "Art Mode" : "Portfolio"}
      >
        {isArtMode ? (
          <ArtGallery
            soundtrack={
              <ArtMode
                playing={isTrackPlaying}
                currentTime={trackTime}
                duration={trackDuration}
                volume={trackVolume}
                onSeek={(time) => {
                  if (audioRef.current && Number.isFinite(time)) {
                    audioRef.current.currentTime = time;
                    setTrackTime(time);
                  }
                }}
                onVolumeChange={(volume) => {
                  if (audioRef.current) audioRef.current.volume = volume;
                  setTrackVolume(volume);
                }}
                onToggleTrack={toggleTrack}
              />
            }
          />
        ) : (
          <>
            <section id="intro" className="intro-section">
              <div className="hero-banner">
                <Image
                  src="/hero-vm-glass.png"
                  alt="Blue glass VM monogram, Vishwesh’s original portfolio artwork"
                  fill
                  priority
                  sizes="(max-width: 1200px) 100vw, 1120px"
                />
                <span className="banner-note">
                  A space for the things I make & learn.
                </span>
                <LocalClock />
              </div>
              <div className="hero-body">
                <div className="identity-row">
                  <div className="profile-monogram" aria-hidden="true">
                    vm<span>.</span>
                  </div>
                  <div>
                    <p className="identity-meta">Software · self-employed</p>
                    <h1>
                      Hi, I’m Vishwesh<span> — I like making things.</span>
                    </h1>
                  </div>
                </div>
                <p className="hero-disciplines">
                  Software. Hardware.
                  <br className="mobile-break" />{" "}
                  <span>Mechanics. Visuals.</span>
                </p>
                <p className="hero-description">
                  I&apos;m Vishwesh, 23, based in Surat, India. Software is my
                  main area; the rest are subjects I&apos;m actively learning or
                  practising.
                </p>
                <div className="hero-actions">
                  <a className="button primary" href="#practice">
                    <Icon name="code" />
                    View areas
                    <Icon name="arrow" />
                  </a>
                  <a className="button" href="#contact">
                    <Icon name="mail" />
                    Get in touch
                  </a>
                </div>
                <div className="contact-icons">
                  <a
                    href="mailto:vishweshmash86@gmail.com"
                    aria-label="Email Vishwesh"
                  >
                    <Icon name="mail" />
                  </a>
                  <a href="tel:+919537517519" aria-label="Call Vishwesh">
                    <Icon name="phone" />
                  </a>
                  <a
                    href="https://wa.me/919537517519"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp Vishwesh"
                  >
                    <Icon name="chat" />
                  </a>
                </div>
                <div className="facts-grid">
                  <div>
                    <Icon name="code" />
                    <strong>Software</strong>
                    <span>Main area</span>
                  </div>
                  <div>
                    <Icon name="briefcase" />
                    <strong>Independent</strong>
                    <span>Self-employed</span>
                  </div>
                  <div>
                    <Icon name="person" />
                    <strong>23</strong>
                    <span>Years old</span>
                  </div>
                  <div>
                    <Icon name="pin" />
                    <strong>Surat, India</strong>
                    <span>Based in</span>
                  </div>
                </div>
              </div>
            </section>
            <section id="practice" className="content-section">
              <SectionHeading label="Practice" title="Current areas." />
              <p className="section-intro">
                These are not equal claims of experience. Software is the main
                area; the others are interests or ongoing studies.
              </p>
              <div className="discipline-grid" aria-label="Areas of practice">
                {disciplines.map((item, index) => (
                  <article
                    id={`practice-${item.title.toLowerCase().replaceAll(" ", "-")}`}
                    className={`discipline-card discipline-${index}`}
                    key={item.title}
                  >
                    <div className="discipline-visual" aria-hidden="true">
                      {index === 0 ? (
                        <div className="code-window">
                          <div className="window-bar">
                            <i />
                            <i />
                            <i />
                          </div>
                          <div className="code-lines">
                            <span>&lt;ideas&gt;</span>
                            <b>make something.</b>
                            <b>learn something.</b>
                            <span>&lt;/ideas&gt;</span>
                          </div>
                          <Icon name="code" />
                        </div>
                      ) : index === 3 ? (
                        <Image
                          src="/digital-sketch.png"
                          alt=""
                          fill
                          sizes="(max-width: 700px) 100vw, 540px"
                        />
                      ) : index === 4 ? (
                        <span className="mandarin-glyph">学</span>
                      ) : (
                        <div className="technical-art">
                          <span />
                          <span />
                          <Icon name={item.icon} />
                        </div>
                      )}
                      <span className="visual-index">
                        0{index + 1} / {item.title.toUpperCase()}
                      </span>
                    </div>
                    <div className="discipline-body">
                      <div className="card-title-row">
                        <h3>{item.title}</h3>
                        <span
                          className={`practice-status ${item.status === "Main" ? "main-status" : ""}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p>{item.description}</p>
                      {item.title === "Visual work" && (
                        <button
                          type="button"
                          className="text-button"
                          onClick={isArtMode ? exitArtMode : enterArtMode}
                        >
                          {isArtMode ? "Switch to profile" : "Enter Art mode"}
                          <Icon name="arrow" />
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section id="about" className="content-section">
              <SectionHeading label="About" title="A short background." />
              <div className="about-layout">
                <div className="signature-card">
                  <span className="eyebrow">A little about me</span>
                  <Image
                    src="/name-signature.png"
                    alt="Vishwesh Mashruwala, handwritten signature artwork"
                    width={600}
                    height={279}
                  />
                  <span>Surat, India</span>
                </div>
                <div className="about-copy">
                  <h3>Vishwesh Mashruwala</h3>
                  <p>
                    I currently work independently and am looking for a software
                    role or contract work. My experience is strongest in
                    software.
                  </p>
                  <p>
                    Hardware, mechanical engineering, and electrical engineering
                    are subjects I&apos;m learning—not claims of expertise. I
                    also draw, edit video, and study Mandarin.
                  </p>
                  <dl className="about-facts">
                    <div>
                      <dt>Status</dt>
                      <dd>Self-employed</dd>
                    </div>
                    <div>
                      <dt>Based</dt>
                      <dd>Surat, India</dd>
                    </div>
                    <div>
                      <dt>Age</dt>
                      <dd>23</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </section>
            <section
              className="content-section art-invitation"
              aria-labelledby="art-invitation-title"
            >
              <div>
                <p className="eyebrow">The other side</p>
                <h2 id="art-invitation-title">I like making things.</h2>
                <p>Drawing, video editing, pacing, and composition.</p>
                <button className="button" onClick={enterArtMode} type="button">
                  <Icon name="pen" />
                  Enter Art mode
                  <Icon name="arrow" />
                </button>
              </div>
              <div className="art-invitation-image" aria-hidden="true">
                <Image
                  src="/art-cover/portrait-right.png"
                  alt=""
                  fill
                  sizes="(max-width: 700px) 50vw, 360px"
                />
              </div>
            </section>
            <section id="contact" className="content-section contact-section">
              <SectionHeading label="Contact" title="Let’s talk." />
              <div className="contact-layout">
                <p>
                  I&apos;m open to full-time software roles, contract work, and
                  small collaborations. Email is best; phone and WhatsApp work
                  too.
                </p>
                <div className="contact-methods">
                  <a href="mailto:vishweshmash86@gmail.com">
                    <Icon name="mail" />
                    <div>
                      <span>Email</span>
                      <strong>vishweshmash86@gmail.com</strong>
                    </div>
                    <Icon name="arrow" />
                  </a>
                  <a href="tel:+919537517519">
                    <Icon name="phone" />
                    <div>
                      <span>Phone</span>
                      <strong>+91 95375 17519</strong>
                    </div>
                    <Icon name="arrow" />
                  </a>
                  <a
                    href="https://wa.me/919537517519"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon name="chat" />
                    <div>
                      <span>WhatsApp</span>
                      <strong>Open WhatsApp</strong>
                    </div>
                    <Icon name="arrow" />
                  </a>
                </div>
              </div>
            </section>
            <footer className="portfolio-footer">
              <a href="#intro" className="footer-name">
                Vishwesh Mashruwala<span>© {new Date().getFullYear()}</span>
              </a>
              <span>Software. Hardware. Mechanics. Visuals.</span>
              <a href="#intro">Back to top ↑</a>
            </footer>
          </>
        )}
      </main>
      <dialog
        className="search-dialog"
        ref={dialogRef}
        aria-labelledby="search-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        onClose={() => searchTrigger.current?.focus({ preventScroll: true })}
      >
        <div className="search-panel">
          <div className="search-header">
            <h2 id="search-title">
              {isArtMode ? "Explore the artwork" : "Explore the portfolio"}
            </h2>
            <button
              className="icon-button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close search"
            >
              <Icon name="close" />
            </button>
          </div>
          <div className="search-field">
            <Icon name="search" />
            <input
              ref={searchInput}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search portfolio content"
              placeholder={
                isArtMode
                  ? "Search drawings, paintings, 3D…"
                  : "Search areas, about, art…"
              }
            />
          </div>
          <div className="search-results">
            {results.length ? (
              results.map((item) =>
                item.hash === "art" ? (
                  <button key={item.hash} onClick={enterArtMode}>
                    <div>
                      <strong>{item.label}</strong>
                      {!isArtMode && <span>{item.description}</span>}
                    </div>
                    <Icon name="arrow" />
                  </button>
                ) : (
                  <a
                    key={item.hash}
                    href={`#${item.hash}`}
                    onClick={() => dialogRef.current?.close()}
                  >
                    <div>
                      <strong>{item.label}</strong>
                      {!isArtMode && <span>{item.description}</span>}
                    </div>
                    <Icon name="arrow" />
                  </a>
                ),
              )
            ) : (
              <p className="no-results">
                No matches. Try an area of practice, art, or contact.
              </p>
            )}
          </div>
          <div className="search-footer">
            Browse with Tab · Enter to select · Esc to close
          </div>
        </div>
      </dialog>
    </div>
  );
}
