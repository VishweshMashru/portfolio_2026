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
            <strong>VISHWESH</strong>
            <span>MASHRUWALA / 23</span>
          </button>

          <nav className="nav" aria-label="Portfolio pages">
            {pages.map((label, index) => (
              <button type="button" key={label} onClick={() => goTo(index)} aria-current={page === index ? "page" : undefined}>
                <span>0{index}</span>{label}
              </button>
            ))}
          </nav>

          <p className="availability"><span aria-hidden="true" />Open to work</p>
        </header>

        <main className="page-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <section key={page} className={`page-view enter-${direction}`} aria-live="polite" aria-label={`${pages[page]} page`}>
            {page === 0 && (
              <div className="intro-page">
                <div className="intro-context meta-type">
                  <p><span>Practice</span>Code, circuits, motion, image.</p>
                  <p><span>Based</span>India · IST</p>
                </div>

                <div className="hero-object" aria-hidden="true">
                  <img src="/hero-vm-glass.png" alt="" />
                </div>

                <div className="intro-nameplate">
                  <p>INDEPENDENT ENGINEER</p>
                  <p>SOFTWARE × HARDWARE</p>
                </div>

                <h1 className="hero-title">
                  <span>I BUILD</span>
                  <span>DIGITAL <em>&amp;</em> PHYSICAL</span>
                  <span>THINGS.</span>
                </h1>

                <button className="round-next" type="button" onClick={() => goTo(1)} aria-label="View practice">
                  <span>VIEW<br />PRACTICE</span><b aria-hidden="true">↘</b>
                </button>
              </div>
            )}

            {page === 1 && (
              <div className="practice-page">
                <div className="page-label meta-type">
                  <p>01 / PRACTICE</p>
                  <p>FIVE CONNECTED FIELDS</p>
                </div>

                <div className="optical-study" aria-hidden="true"><span /></div>

                <h2 className="thin-title">
                  <span>ENGINEERING</span>
                  <span>ACROSS</span>
                  <span>MEDIUMS.</span>
                </h2>

                <div className="discipline-rail" aria-label="Areas of practice">
                  {disciplines.map((discipline, index) => (
                    <p key={discipline}><span>0{index + 1}</span>{discipline}</p>
                  ))}
                </div>
              </div>
            )}

            {page === 2 && (
              <div className="about-page">
                <div className="page-label meta-type">
                  <p>02 / ABOUT</p>
                  <p>NO SINGLE DISCIPLINE</p>
                </div>

                <h2 className="heavy-title">
                  <span>CURIOUS</span>
                  <span>BY</span>
                  <span>DEFAULT.</span>
                </h2>

                <article className="about-card">
                  <p className="card-number">23 / INDIA</p>
                  <p>I&apos;m an independent software engineer who follows ideas into hardware, mechanical and electrical systems, drawing, editing, and Mandarin.</p>
                </article>

                <div className="learning-loop" aria-label="Working process: question, make, revise">
                  <span>QUESTION</span><i aria-hidden="true">→</i><span>MAKE</span><i aria-hidden="true">→</i><span>REVISE</span>
                </div>
              </div>
            )}

            {page === 3 && (
              <div className="contact-page">
                <div className="page-label meta-type">
                  <p>03 / CONTACT</p>
                  <p>AVAILABLE FOR INTERESTING WORK</p>
                </div>

                <h2 className="contact-title">
                  <span>LET&apos;S BUILD</span>
                  <span>SOMETHING</span>
                  <span>REAL.</span>
                </h2>

                <div className="chrome-orb" aria-hidden="true"><span>VM</span></div>

                <article className="contact-card">
                  <p>Software roles, unusual collaborations, and thoughtful conversations.</p>
                  <p>Reach out through the channel that brought you here.</p>
                  <button type="button" onClick={() => goTo(0)}>BACK TO INDEX <span aria-hidden="true">↖</span></button>
                </article>
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
