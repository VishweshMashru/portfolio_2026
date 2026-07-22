"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const pages = ["Index", "Practice", "About", "Contact"];
const hashes = ["intro", "practice", "about", "contact"];

const disciplines = ["Software", "Hardware", "Mechanisms", "Visual craft", "中文"];

export default function Home() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const touchStart = useRef<number | null>(null);

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
    if (hashIndex > -1) setPage(hashIndex);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "PageDown") goTo(page + 1);
      if (event.key === "ArrowLeft" || event.key === "PageUp") goTo(page - 1);
      if (event.key === "Home") goTo(0);
      if (event.key === "End") goTo(pages.length - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, page]);

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
      <div className="aura aura-one" aria-hidden="true" />
      <div className="aura aura-two" aria-hidden="true" />

      <div className="artboard">
        <div className="construction-grid" aria-hidden="true" />

        <header className="site-header">
          <button className="brand" type="button" onClick={() => goTo(0)} aria-label="Go to introduction">
            <strong>VISHWESH.M</strong>
            <span>Build &amp; explore</span>
          </button>

          <nav className="nav" aria-label="Portfolio pages">
            {pages.map((label, index) => (
              <button
                type="button"
                key={label}
                onClick={() => goTo(index)}
                aria-current={page === index ? "page" : undefined}
              >
                {label}
              </button>
            ))}
          </nav>

          <p className="availability"><span aria-hidden="true" /> Available</p>
        </header>

        <main className="page-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <section
            key={page}
            className={`page-view enter-${direction}`}
            aria-live="polite"
            aria-label={`${pages[page]} page`}
          >
            {page === 0 && (
              <div className="intro-page">
                <div className="intro-topline micro-copy">
                  <p><span>Practice</span>Software × hardware</p>
                  <p><span>Method</span>Learn by making.</p>
                  <p className="intro-bio">I&apos;m Vishwesh, an independent engineer interested in code, circuits, mechanisms, and visual craft.</p>
                </div>

                <div className="hero-object" aria-hidden="true">
                  <img src="/hero-vm-glass.png" alt="" />
                </div>

                <div className="identity-stamp" aria-hidden="true">VM</div>
                <div className="age-stamp" aria-label="23 years old">23</div>

                <div className="intro-statement">
                  <h1>I BUILD<br />DIGITAL &amp; PHYSICAL<br />SYSTEMS</h1>
                </div>

                <div className="intro-footer micro-copy">
                  <p>INDIA · IST</p>
                  <button type="button" onClick={() => goTo(1)}>VIEW PRACTICE <span aria-hidden="true">↘</span></button>
                  <p>CURIOUS BY DEFAULT</p>
                </div>
              </div>
            )}

            {page === 1 && (
              <div className="practice-page">
                <div className="page-label micro-copy">
                  <p>CREATIVE ENGINEERING</p>
                  <p>01 / PRACTICE</p>
                </div>

                <div className="optical-study" aria-hidden="true">
                  <span />
                </div>

                <h2>ENGINEERING ACROSS<br />DIGITAL &amp; PHYSICAL<br />SYSTEMS</h2>

                <div className="discipline-strip" aria-label="Areas of practice">
                  {disciplines.map((discipline, index) => (
                    <p key={discipline}><span>0{index + 1}</span>{discipline}</p>
                  ))}
                </div>
              </div>
            )}

            {page === 2 && (
              <div className="about-page">
                <div className="page-label micro-copy">
                  <p>ABOUT THE PRACTICE</p>
                  <p>02 / ABOUT</p>
                </div>

                <div className="about-intro">
                  <p>I&apos;m a 23-year-old independent software engineer in India. My interests move freely between software, hardware, mechanical and electrical engineering, drawing, editing, and Mandarin.</p>
                </div>

                <h2>LEARNING IS<br />PART OF<br />THE WORK.</h2>

                <div className="about-principles micro-copy">
                  <p><span>01</span>QUESTION</p>
                  <p><span>02</span>MAKE</p>
                  <p><span>03</span>REVISE</p>
                </div>
              </div>
            )}

            {page === 3 && (
              <div className="contact-page">
                <div className="page-label micro-copy">
                  <p>OPEN TO INTERESTING WORK</p>
                  <p>03 / CONTACT</p>
                </div>

                <p className="contact-intro">Software roles, unusual collaborations, and thoughtful conversations.</p>
                <h2>LET&apos;S MAKE<br />SOMETHING<br /><em>REAL.</em></h2>

                <div className="contact-action">
                  <p>Reach out through the channel that brought you here.</p>
                  <button type="button" onClick={() => goTo(0)}>BACK TO START <span aria-hidden="true">↖</span></button>
                </div>
              </div>
            )}
          </section>
        </main>

        <footer className="pagination" aria-label="Page navigation">
          <p>{String(page + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}</p>

          <div className="page-dots">
            {pages.map((label, index) => (
              <button
                type="button"
                key={label}
                className={page === index ? "active" : ""}
                onClick={() => goTo(index)}
                aria-label={`Go to ${label}`}
                aria-current={page === index ? "page" : undefined}
              />
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
