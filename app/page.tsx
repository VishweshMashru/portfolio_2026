const explorations = [
  {
    number: "01",
    label: "Software",
    title: "Tiny systems, carefully built.",
    copy: "I like turning loose ideas into useful software — learning the stack, sweating the small decisions, and shipping the thing.",
    mark: "{ }",
    tone: "blue",
  },
  {
    number: "02",
    label: "Hardware",
    title: "Signals into stories.",
    copy: "Circuits, sensors, motors, and physical computing pull me away from the screen and into the wonderfully real world.",
    mark: "~",
    tone: "coral",
  },
  {
    number: "03",
    label: "Mechanisms",
    title: "Motion has a grammar.",
    copy: "Mechanical and electrical engineering help me see how forces, materials, energy, and parts negotiate with each other.",
    mark: "↻",
    tone: "yellow",
  },
  {
    number: "04",
    label: "Visuals",
    title: "Frames, marks, and rhythm.",
    copy: "Drawing and video editing are how I practice composition, pacing, and making an idea feel as clear as it sounds.",
    mark: "◒",
    tone: "cream",
  },
  {
    number: "05",
    label: "Mandarin",
    title: "A new way to notice.",
    copy: "Learning Mandarin keeps me humble, attentive, and comfortable with being a beginner for a very long time.",
    mark: "学",
    tone: "ink",
  },
];

const principles = [
  ["01", "Stay curious longer", "The interesting answer usually appears after the obvious one."],
  ["02", "Make it tangible", "A rough thing you can touch or test beats a perfect idea in your head."],
  ["03", "Cross the wires", "The best work often happens where engineering and creative practice overlap."],
];

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <header className="site-header shell">
          <a className="brand" href="#top" aria-label="Vishwesh Mashruwala, home">
            <span className="brand-mark" aria-hidden="true">VM</span>
            <span className="brand-name">Vishwesh<br />Mashruwala</span>
          </a>

          <nav className="nav" aria-label="Main navigation">
            <a href="#practice">Practice</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>

          <p className="availability"><span aria-hidden="true" />Open to interesting work</p>
        </header>

        <div className="hero-body shell">
          <div className="hero-kicker">
            <span>23</span>
            <span>India</span>
            <span>Independent maker</span>
          </div>

          <h1>
            I make sense of systems — in <em>code, circuits, mechanisms,</em> and motion.
          </h1>

          <div className="hero-lower">
            <p className="hero-intro">
              Software engineer by hobby. Curious about hardware, mechanical and electrical engineering,
              Mandarin, drawing, video, and the creative process.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#practice">Explore my practice <span aria-hidden="true">↘</span></a>
              <a className="button button-quiet" href="#contact">Say hello <span aria-hidden="true">→</span></a>
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

        <div className="hero-shape shape-blue" aria-hidden="true" />
        <div className="hero-shape shape-red" aria-hidden="true" />
        <div className="idea-stamp" aria-hidden="true"><span>Idea</span><b>→ Form</b></div>
      </section>

      <section className="practice shell" id="practice">
        <div className="section-heading">
          <p className="eyebrow">Current threads / 2026</p>
          <h2>One curious mind.<br /><em>More than one lane.</em></h2>
          <p>I don&apos;t see these as separate interests. They are different materials for the same work: understanding how things fit together.</p>
        </div>

        <div className="exploration-grid">
          {explorations.map((item) => (
            <article className={`exploration-card ${item.tone}`} key={item.number}>
              <div className="card-top">
                <span>{item.number} / {item.label}</span>
                <span className="card-mark" aria-hidden="true">{item.mark}</span>
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
              <span className="card-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-grid shell">
          <div className="about-title">
            <p className="eyebrow light">The short version</p>
            <h2>I&apos;m Vishwesh.<br />I learn by <em>making.</em></h2>
          </div>

          <div className="about-copy">
            <p className="lead">I&apos;m a 23-year-old independent software engineer and multidisciplinary learner based in India.</p>
            <p>I&apos;m less interested in job titles than in the act of building: following an idea through code, components, moving parts, sketches, cuts, and revisions until it starts to make sense.</p>
            <p>This site is a living record of that process — what I&apos;m learning, what I&apos;m trying, and what I&apos;m ready to make next.</p>
          </div>

          <div className="orbit" aria-hidden="true">
            <div className="orbit-ring orbit-one" />
            <div className="orbit-ring orbit-two" />
            <span>Think</span>
            <b>Make</b>
            <i>Learn</i>
          </div>
        </div>
      </section>

      <section className="principles shell" aria-labelledby="principles-title">
        <div className="principles-intro">
          <p className="eyebrow">Working principles</p>
          <h2 id="principles-title">How I like to move from <em>maybe</em> to made.</h2>
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
          <p className="eyebrow">Next experiment</p>
          <h2>Have an idea with<br />a little <em>voltage?</em></h2>
          <p className="contact-copy">I&apos;m open to software work, unusual collaborations, and conversations with people who enjoy learning across boundaries.</p>
          <p className="contact-note">Reach out through the channel that brought you here.</p>
          <a className="button button-light" href="#top">Back to the beginning <span aria-hidden="true">↑</span></a>
        </div>
        <div className="contact-sun" aria-hidden="true"><span>Let&apos;s<br />make<br />something.</span></div>
      </section>

      <footer className="footer shell">
        <p>Vishwesh Mashruwala</p>
        <p>Code · Current · Craft · Curiosity</p>
        <p>India · 2026</p>
      </footer>
    </main>
  );
}
