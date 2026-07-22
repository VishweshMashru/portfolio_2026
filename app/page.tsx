"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const pages = ["Index", "Practice", "About", "Contact"];
const hashes = ["intro", "practice", "about", "contact"];

const disciplines = [
  ["Software", "Web products and small systems."],
  ["Hardware", "Circuits, sensors, and physical computing."],
  ["Mechanisms", "Motion, materials, and how parts interact."],
  ["Visual craft", "Drawing, editing, and composition."],
  ["Mandarin", "A language I am learning every day."],
];

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

          <p className="availability"><span aria-hidden="true" />Available</p>
        </header>

        <main className="page-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <section key={page} className={`page-view enter-${direction}`} aria-live="polite" aria-label={`${pages[page]} page`}>
            {page === 0 && (
              <div className="intro-page page-padding">
                <div className="intro-meta">
                  <p>Independent software engineer</p>
                  <p>India · 23</p>
                </div>

                <div className="hero-object" aria-hidden="true">
                  <img src="/hero-vm-glass.png" alt="" />
                </div>

                <div className="intro-copy">
                  <h1>Software, hardware<br /><span>&amp; everything between.</span></h1>
                  <p>I like following ideas through code, circuits, mechanisms, drawings, and edits.</p>
                  <button type="button" onClick={() => goTo(1)}>Explore my practice <span aria-hidden="true">→</span></button>
                </div>
              </div>
            )}

            {page === 1 && (
              <div className="practice-page page-padding">
                <div className="page-heading">
                  <p className="eyebrow">Practice</p>
                  <h2>Ideas rarely stay<br />in one medium.</h2>
                  <p className="page-intro">My work moves between digital and physical systems, with visual thinking connecting both.</p>
                </div>

                <div className="discipline-list" aria-label="Areas of practice">
                  {disciplines.map(([title, description], index) => (
                    <article key={title}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <h3>{title}</h3>
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
                  <h2>Curiosity is the<br />common thread.</h2>
                </div>

                <div className="about-copy">
                  <p>I&apos;m a 23-year-old independent software engineer based in India. I&apos;m interested in hardware, mechanical and electrical engineering, drawing, video editing, creative processes, and Mandarin.</p>
                  <p>I learn best when an idea becomes something I can test, change, and understand with my hands.</p>
                  <div className="principles" aria-label="Working principles">
                    <span>Stay curious</span>
                    <span>Make it tangible</span>
                    <span>Keep learning</span>
                  </div>
                </div>
              </div>
            )}

            {page === 3 && (
              <div className="contact-page page-padding">
                <p className="eyebrow">Contact</p>
                <h2>Open to<br />interesting work.</h2>
                <div className="contact-copy">
                  <p>Software roles, unusual collaborations, and thoughtful conversations are all welcome.</p>
                  <p>Reach out through the channel that brought you here.</p>
                  <button type="button" onClick={() => goTo(0)}>Back to index <span aria-hidden="true">↖</span></button>
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
