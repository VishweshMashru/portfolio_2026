"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const pages = ["Intro", "Practice", "About", "Contact"];
const hashes = ["intro", "practice", "about", "contact"];

const disciplines = [
  ["01", "Software", "Web products and small systems."],
  ["02", "Hardware", "Circuits, sensors, and physical computing."],
  ["03", "Mechanisms", "Motion, materials, and how parts interact."],
  ["04", "Visuals", "Drawing, editing, and composition."],
  ["05", "中文", "Learning a language through daily practice."],
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
      <header className="site-header shell">
        <button className="brand" type="button" onClick={() => goTo(0)} aria-label="Go to introduction">
          <span aria-hidden="true">V/M</span>
          <b>Vishwesh Mashruwala</b>
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

        <p className="status"><span aria-hidden="true" />Open to work</p>
      </header>

      <main className="page-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <section
          key={page}
          className={`page-view enter-${direction} shell`}
          aria-live="polite"
          aria-label={`${pages[page]} page`}
        >
          {page === 0 && (
            <div className="intro-page">
              <p className="page-kicker">23 · India · Independent maker</p>
              <h1>
                <span>Software.</span>
                <span>Hardware.</span>
                <em>And the space between.</em>
              </h1>
              <div className="intro-note">
                <p>Vishwesh is a multidisciplinary engineer interested in code, circuits, mechanisms, and visual craft.</p>
                <button type="button" onClick={() => goTo(1)}>View practice <span aria-hidden="true">→</span></button>
              </div>
            </div>
          )}

          {page === 1 && (
            <div className="practice-page">
              <div className="page-title">
                <p className="page-kicker">Practice</p>
                <h2>What I work with.</h2>
              </div>
              <div className="discipline-list">
                {disciplines.map(([number, title, description]) => (
                  <article key={number}>
                    <span>{number}</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </article>
                ))}
              </div>
            </div>
          )}

          {page === 2 && (
            <div className="about-page">
              <div className="page-title">
                <p className="page-kicker">About</p>
                <h2>I learn by <em>making.</em></h2>
              </div>
              <div className="about-copy">
                <p>I&apos;m a 23-year-old independent software engineer based in India. I follow ideas through code, components, moving parts, sketches, and revisions.</p>
                <ul aria-label="Working principles">
                  <li><span>01</span> Stay curious.</li>
                  <li><span>02</span> Make it tangible.</li>
                  <li><span>03</span> Cross disciplines.</li>
                </ul>
              </div>
            </div>
          )}

          {page === 3 && (
            <div className="contact-page">
              <p className="page-kicker">Contact</p>
              <h2>Open to<br /><em>interesting work.</em></h2>
              <div className="contact-note">
                <p>Software roles, unusual collaborations, and thoughtful conversations.</p>
                <p>Reach out through the channel that brought you here.</p>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="pagination shell" aria-label="Page navigation">
        <button type="button" onClick={() => goTo(page - 1)} disabled={page === 0} aria-label="Previous page">←</button>

        <div className="page-dots">
          {pages.map((label, index) => (
            <button
              type="button"
              key={label}
              className={page === index ? "active" : ""}
              onClick={() => goTo(index)}
              aria-label={`Go to ${label}`}
              aria-current={page === index ? "page" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>

        <div className="next-control">
          <span>{pages[page]}</span>
          <button type="button" onClick={() => goTo(page + 1)} disabled={page === pages.length - 1} aria-label="Next page">→</button>
        </div>
      </footer>
    </div>
  );
}
