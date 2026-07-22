const explorations = [
  {
    number: "01",
    label: "Software",
    title: "Tiny systems, carefully built.",
    copy: "Turning loose ideas into useful software, learning the stack, and paying attention to the decisions that make a product feel considered.",
    mark: "{ }",
  },
  {
    number: "02",
    label: "Hardware",
    title: "Signals into stories.",
    copy: "Circuits, sensors, motors, and physical computing bring ideas off the screen and into the real world.",
    mark: "~",
  },
  {
    number: "03",
    label: "Mechanisms",
    title: "Motion has a grammar.",
    copy: "Mechanical and electrical engineering offer another way to understand how forces, materials, energy, and parts relate.",
    mark: "↻",
  },
  {
    number: "04",
    label: "Visual practice",
    title: "Frames, marks, and rhythm.",
    copy: "Drawing and video editing are exercises in composition, pacing, and communicating an idea without overexplaining it.",
    mark: "◒",
  },
  {
    number: "05",
    label: "Mandarin",
    title: "A new way to notice.",
    copy: "Learning Mandarin keeps me attentive, patient, and comfortable with being a beginner for a long time.",
    mark: "学",
  },
];

const principles = [
  ["01", "Stay curious longer", "The interesting answer often appears after the obvious one."],
  ["02", "Make it tangible", "A rough thing you can test is more useful than a perfect idea in your head."],
  ["03", "Cross disciplines", "The best work often happens where engineering and creative practice overlap."],
];

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <header className="site-header shell">
          <a className="brand" href="#top" aria-label="Vishwesh Mashruwala, home">
            <span className="brand-mark" aria-hidden="true">V/M</span>
            <span>Vishwesh Mashruwala</span>
          </a>

          <nav className="nav" aria-label="Main navigation">
            <a href="#practice">Practice</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>

          <p className="availability"><span aria-hidden="true" />Available for interesting work</p>
        </header>

        <div className="hero-body shell">
          <p className="hero-meta">23 · India · Independent maker</p>

          <div className="hero-grid">
            <h1>
              I make sense of systems through <em>code, circuits, mechanisms,</em> and motion.
            </h1>

            <div className="hero-aside">
              <p>
                Software engineer by hobby. Curious about hardware, mechanical and electrical engineering,
                Mandarin, drawing, video, and the creative process.
              </p>
              <div className="hero-actions">
                <a href="#practice">Explore my practice <span aria-hidden="true">↘</span></a>
                <a href="#contact">Say hello <span aria-hidden="true">→</span></a>
              </div>
            </div>
          </div>

          <div className="discipline-strip" aria-label="Areas of practice">
            <span>Software</span>
            <span>Hardware</span>
            <span>Mechanisms</span>
            <span>Visuals</span>
            <span lang="zh">中文</span>
          </div>
        </div>
      </section>

      <section className="practice shell" id="practice">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Current threads / 2026</p>
            <h2>One mind.<br /><em>More than one lane.</em></h2>
          </div>
          <p>I don&apos;t see these as separate interests. They are different materials for the same practice: understanding how things fit together.</p>
        </div>

        <div className="exploration-list">
          {explorations.map((item) => (
            <article className="exploration-row" key={item.number}>
              <p className="row-label"><span>{item.number}</span>{item.label}</p>
              <h3>{item.title}</h3>
              <p className="row-copy">{item.copy}</p>
              <span className="row-mark" aria-hidden="true">{item.mark}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-grid shell">
          <div className="about-title">
            <p className="eyebrow">The short version</p>
            <h2>I&apos;m Vishwesh.<br />I learn by <em>making.</em></h2>
          </div>

          <div className="about-copy">
            <p className="lead">I&apos;m a 23-year-old independent software engineer and multidisciplinary learner based in India.</p>
            <p>I&apos;m less interested in job titles than in the act of building: following an idea through code, components, moving parts, sketches, cuts, and revisions until it starts to make sense.</p>
            <p>This site is a living record of what I&apos;m learning, what I&apos;m trying, and what I&apos;m ready to make next.</p>
          </div>

          <p className="about-note" aria-label="Think, make, learn">
            <span>Think</span><span>Make</span><span>Learn</span>
          </p>
        </div>
      </section>

      <section className="principles shell" aria-labelledby="principles-title">
        <div className="principles-intro">
          <p className="eyebrow">Working principles</p>
          <h2 id="principles-title">From <em>maybe</em><br />to made.</h2>
        </div>

        <ol className="principles-list">
          {principles.map(([number, title, copy]) => (
            <li key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="contact" id="contact">
        <div className="contact-inner shell">
          <p className="eyebrow">A note for the curious</p>
          <div className="contact-grid">
            <h2>Open to ideas that don&apos;t fit neatly in <em>one box.</em></h2>
            <div>
              <p>I&apos;m open to software work, unusual collaborations, and conversations with people who enjoy learning across boundaries.</p>
              <p className="contact-note">Reach out through the channel that brought you here.</p>
              <a href="#top">Back to the beginning <span aria-hidden="true">↑</span></a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <p>Vishwesh Mashruwala</p>
        <p>Code · Current · Craft · Curiosity</p>
        <p>India · 2026</p>
      </footer>
    </main>
  );
}
