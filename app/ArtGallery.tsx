"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useRef, useState, type ReactNode } from "react";
import Icon from "./components/Icon";

const ObjArtwork = dynamic(() => import("./ObjArtwork"), {
  ssr: false,
  loading: () => <p className="obj-artwork-status">Loading model…</p>,
});

const artworks = [
  {
    id: "paint-study",
    title: "Character painting",
    medium: "Digital art · Krita",
    src: "/paint-study.png",
    alt: "Vishwesh’s in-progress character painting in Krita",
  },
  {
    id: "character-sketch",
    title: "Character sketches",
    medium: "Digital art · Krita",
    src: "/digital-sketch.png",
    alt: "Vishwesh’s earlier character drawing study in Krita",
  },
  {
    id: "first-blender-scene",
    title: "First Blender scene",
    medium: "3D · Blender",
    src: "/first-blend.png",
    alt: "Vishwesh’s first Blender scene: a pink tree and small pond on a grassy island",
  },
];

export default function ArtGallery({ soundtrack }: { soundtrack: ReactNode }) {
  const [selected, setSelected] = useState<(typeof artworks)[number] | null>(
    null,
  );
  const [modelActive, setModelActive] = useState(false);
  const viewer = useRef<HTMLDialogElement | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const artworkCard = (artwork: (typeof artworks)[number]) => (
    <article
      className="discipline-card artwork-card"
      id={artwork.id}
      key={artwork.id}
    >
      <button
        className="artwork-open"
        onClick={(event) => {
          opener.current = event.currentTarget;
          setSelected(artwork);
          viewer.current?.showModal();
        }}
        aria-label={`View ${artwork.title}`}
      >
        <div className="artwork-image">
          <Image
            src={artwork.src}
            alt={artwork.alt}
            fill
            sizes="(max-width: 700px) 100vw, 540px"
            priority={artwork.id === "paint-study"}
          />
        </div>
        <div className="discipline-body">
          <p className="eyebrow">{artwork.medium}</p>
          <div className="card-title-row">
            <h3>{artwork.title}</h3>
            <Icon name="arrow" />
          </div>
        </div>
      </button>
    </article>
  );

  return (
    <>
      <section id="art" className="gallery-intro">
        <div>
          <div className="section-heading">
            <p className="eyebrow">VishXDXD · Visual work</p>
            <h1>Art & studies.</h1>
          </div>
          <p className="section-intro">
            Digital drawings, paintings, and 3D experiments.
          </p>
        </div>
        <div className="gallery-soundtrack">{soundtrack}</div>
      </section>
      <section id="digital-art" className="content-section gallery-section">
        <div className="section-heading">
          <p className="eyebrow">Drawing & painting</p>
          <h2>Digital art.</h2>
        </div>
        <div className="discipline-grid">
          {artworks.slice(0, 2).map(artworkCard)}
        </div>
      </section>
      <section id="3d-model" className="content-section">
        <div className="section-heading">
          <p className="eyebrow">3D work</p>
          <h2>Blender studies.</h2>
        </div>
        <div className="discipline-grid">
          {artworkCard(artworks[2])}
          <article className="discipline-card artwork-card">
            <div className="gallery-model">
              {modelActive ? (
                <ObjArtwork />
              ) : (
                <>
                  <Image
                    src="/first-blend.png"
                    alt="Preview of the interactive Blender study"
                    fill
                    sizes="(max-width: 700px) 100vw, 540px"
                  />
                  <button
                    className="button"
                    onClick={() => setModelActive(true)}
                  >
                    <Icon name="gear" />
                    Explore in 3D
                  </button>
                </>
              )}
            </div>
            <div className="discipline-body">
              <p className="eyebrow">Interactive model</p>
              <div className="card-title-row">
                <h3>First Blender study</h3>
              </div>
            </div>
          </article>
        </div>
      </section>
      <footer className="portfolio-footer">
        <a href="#art" className="footer-name">
          VishXDXD<span>© {new Date().getFullYear()}</span>
        </a>
        <span>Digital art · 3D</span>
        <a href="#art">Back to top ↑</a>
      </footer>
      <dialog
        className="artwork-viewer"
        ref={viewer}
        aria-labelledby="artwork-viewer-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) viewer.current?.close();
        }}
        onClose={() => opener.current?.focus({ preventScroll: true })}
      >
        {selected && (
          <>
            <div className="artwork-viewer-header">
              <h2 id="artwork-viewer-title">{selected.title}</h2>
              <button
                className="icon-button"
                aria-label="Close artwork"
                onClick={() => viewer.current?.close()}
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="artwork-viewer-image">
              <Image src={selected.src} alt={selected.alt} fill sizes="95vw" />
            </div>
            <a
              className="button"
              href={selected.src}
              target="_blank"
              rel="noreferrer"
            >
              Open full-size image
              <Icon name="arrow" />
            </a>
          </>
        )}
      </dialog>
    </>
  );
}
