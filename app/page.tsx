"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const pages = ["Index", "Practice", "About", "Contact"];
const hashes = ["intro", "practice", "about", "contact"];

const disciplines = [
  ["Software", "Interfaces, web products, automations, and small tools."],
  ["Hardware", "Learning through circuits, sensors, and physical prototypes."],
  ["Mechanisms", "Questions about motion, materials, tolerances, and failure."],
  ["Visual craft", "Drawing to think; editing to shape rhythm and explanation."],
  ["Mandarin", "Building vocabulary, listening, reading, and tone awareness."],
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
    if (hashIndex < 0) return;

    const frame = window.requestAnimationFrame(() => setPage(hashIndex));
    return () => window.cancelAnimationFrame(frame);
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
                  <p>Software engineer · multidisciplinary learner</p>
                  <p>India · 23</p>
                </div>

                <div className="hero-object" aria-hidden="true" />

                <div className="intro-copy">
                  <h1>I build to<br /><span>understand.</span></h1>
                  <div className="intro-detail">
                    <p>Software is where I build today. Hardware, mechanisms, drawing, editing, and Mandarin keep expanding how I think.</p>
                    <button type="button" onClick={() => goTo(1)}>See how I learn <span aria-hidden="true">→</span></button>
                  </div>
                </div>
              </div>
            )}

            {page === 1 && (
              <div className="practice-page page-padding">
                <div className="page-heading">
                  <p className="eyebrow">Practice</p>
                  <h2>One question.<br />Many ways to test it.</h2>
                  <p className="page-intro">I choose the medium that gives useful feedback: code for behavior, circuits for sensing, mechanisms for motion, and visual work for explanation.</p>
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
                  <h2>Not five careers.<br />One way of learning.</h2>
                </div>

                <div className="about-copy">
                  <p>I&apos;m 23 and based in India. Software is the medium I can build with now; hardware, mechanical and electrical engineering are the directions I keep moving toward.</p>
                  <p>I don&apos;t pretend these are five finished careers. They are connected ways to investigate a question: model it, prototype it, notice where it fails, and make the next version clearer.</p>
                  <div className="principles" aria-label="Working principles">
                    <span>Build before claiming</span>
                    <span>Follow the failure</span>
                    <span>Explain the result</span>
                  </div>
                </div>
              </div>
            )}

            {page === 3 && (
              <div className="contact-page page-padding">
                <p className="eyebrow">Contact</p>
                <h2>Looking for work<br />I can grow into.</h2>
                <div className="contact-copy">
                  <p>I&apos;m looking for software roles, contract work, and small collaborations where I can contribute now, learn quickly, and stay close to the problem.</p>
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
                      <strong>Start a conversation</strong>
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
