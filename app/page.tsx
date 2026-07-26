"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const pages = ["Index", "Practice", "About", "Contact"];
const hashes = ["intro", "practice", "about", "contact"];
const introSeenKey = "vishwesh-portfolio-intro-seen";

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
  const touchStart = useRef<number | null>(null);
  const introRevealFrame = useRef<number | null>(null);
  const introTimers = useRef<number[]>([]);

  const goTo = useCallback((nextPage: number) => {
    const target = Math.max(0, Math.min(pages.length - 1, nextPage));
    setPage((current) => {
      if (target === current) return current;
      setDirection(target > current ? "next" : "previous");
      return target;
    });
    window.history.replaceState(null, "", `#${hashes[target]}`);
  }, []);

  useEffect(() => {
    const hashIndex = hashes.indexOf(window.location.hash.slice(1));
    if (hashIndex < 0) return;

    const frame = window.requestAnimationFrame(() => setPage(hashIndex));
    return () => window.cancelAnimationFrame(frame);
  }, []);

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
    const leaveTimer = window.setTimeout(() => setIntroPhase("leaving"), 1900);
    const hideTimer = window.setTimeout(() => {
      window.sessionStorage.setItem(introSeenKey, "true");
      setIntroPhase("hidden");
    }, 2520);
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
      if (event.key === "End") goTo(pages.length - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dismissIntro, goTo, introPhase, page]);

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
    <div className={`portfolio theme-${page}`}>
      {introPhase !== "hidden" && (
        <div className={`intro-loader intro-loader--${introPhase}`}>
          <div className="intro-signature" aria-hidden="true" />
          <button type="button" onClick={dismissIntro} aria-label="Skip opening animation">
            Skip
          </button>
        </div>
      )}

      <div className="aura aura-one" aria-hidden="true" />
      <div className="aura aura-two" aria-hidden="true" />

      <div className="artboard">
        <header className="site-header">
          <button className="brand" type="button" onClick={() => goTo(0)} aria-label="Go to introduction">
            Vishwesh Mashruwala
          </button>

          <nav className="nav" aria-label="Portfolio pages">
            {pages.map((label, index) => (
              <button type="button" key={label} onClick={() => goTo(index)} aria-current={page === index ? "page" : undefined}>
                {label}
              </button>
            ))}
          </nav>

          <p className="availability"><span aria-hidden="true" />Open to software work</p>
        </header>

        <main
          className="page-stage"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <section key={page} className={`page-view enter-${direction}`} aria-live="polite" aria-label={`${pages[page]} page`}>
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
          <p>{String(page + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}</p>
          <div className="page-dots">
            {pages.map((label, index) => (
              <button type="button" key={label} className={page === index ? "active" : ""} onClick={() => goTo(index)} aria-label={`Go to ${label}`} aria-current={page === index ? "page" : undefined} />
            ))}
          </div>
          <div className="page-arrows">
            <button type="button" onClick={() => goTo(page - 1)} disabled={page === 0} aria-label="Previous page">←</button>
            <button type="button" onClick={() => goTo(page + 1)} disabled={page === pages.length - 1} aria-label="Next page">→</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
