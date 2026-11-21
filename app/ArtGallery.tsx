"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useRef, useState, type ReactNode } from "react";
import Icon from "./components/Icon";

const ObjArtwork = dynamic(() => import("./ObjArtwork"), {
  ssr: false,
  loading: () => <p className="obj-artwork-status">Loading model…</p>,
});

const JapResScene = dynamic(() => import("./JapResScene"), {
  ssr: false,
  loading: () => (
    <p className="japres-status" role="status">
      Loading scene…
    </p>
  ),
});

const artworks = [
  {
    id: "japres",
    title: "JapRes",
    category: "scene",
    src: "/japres.png",
    alt: "Vishwesh’s JapRes Blender scene: a neon ramen shop with a red bowl on the roof",
  },
  {
    id: "fubuki",
    title: "Fubuki",
    category: "digital",
    src: "/fubuki.png",
    alt: "Vishwesh’s black-and-white drawing of Fubuki with short dark hair and a high-neck outfit",
  },
  {
    id: "first-blender-scene",
    category: "scene",
    title: "First Blender scene",
    src: "/first-blend.png",
    alt: "Vishwesh’s first Blender scene: a pink tree and small pond on a grassy island",
  },
];

export default function ArtGallery({ soundtrack }: { soundtrack: ReactNode }) {
  const [selected, setSelected] = useState<(typeof artworks)[number] | null>(
    null,
  );
  const [activeScene, setActiveScene] = useState<string | null>(null);
  const sceneTriggers = useRef(new Map<string, HTMLButtonElement>());
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
            loading="lazy"
          />
        </div>
      </button>
    </article>
  );

  const closeScene = (id: string) => {
    setActiveScene(null);
    requestAnimationFrame(() =>
      sceneTriggers.current.get(id)?.focus({ preventScroll: true }),
    );
  };

  const sceneCard = (artwork: (typeof artworks)[number]) => (
    <article
      id={artwork.id}
      key={artwork.id}
      className="discipline-card artwork-card gallery-scene"
    >
      <Image
        src={artwork.src}
        alt={artwork.alt}
        fill
        sizes="(max-width: 700px) 100vw, 540px"
      />
      {activeScene === artwork.id ? (
        artwork.id === "japres" ? (
          <JapResScene onClose={() => closeScene(artwork.id)} />
        ) : (
          <div className="first-scene-interactive">
            <ObjArtwork />
            <div className="japres-tools">
              <button
                className="icon-button"
                aria-label="Close First Blender scene 3D view"
                title="Close 3D view"
                onClick={() => closeScene(artwork.id)}
              >
                <Icon name="close" />
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="japres-actions">
          <button
            ref={(element) => {
              if (element) sceneTriggers.current.set(artwork.id, element);
              else sceneTriggers.current.delete(artwork.id);
            }}
            className="button"
            onClick={() => setActiveScene(artwork.id)}
            aria-label={`Explore ${artwork.title} in 3D`}
          >
            <Icon name="gear" />
            Explore in 3D
          </button>
          <button
            className="icon-button"
            aria-label={`View ${artwork.title} render`}
            title="View render"
            onClick={(event) => {
              opener.current = event.currentTarget;
              setSelected(artwork);
              viewer.current?.showModal();
            }}
          >
            <Icon name="arrow" />
          </button>
        </div>
      )}
    </article>
  );

  return (
    <>
      <section id="art" className="gallery-intro" aria-label="Gallery music">
        <div className="gallery-soundtrack">{soundtrack}</div>
      </section>
      <section
        id="digital-art"
        className="content-section gallery-section"
        aria-label="Digital artwork"
      >
        <div className="discipline-grid">
          {artworks
            .filter((artwork) => artwork.category === "digital")
            .map(artworkCard)}
        </div>
      </section>
      <section
        id="3d-model"
        className="content-section gallery-section"
        aria-label="3D artwork"
      >
        <div className="discipline-grid">
          {artworks
            .filter((artwork) => artwork.category === "scene")
            .map(sceneCard)}
        </div>
      </section>
      <footer className="portfolio-footer">
        <a href="#art">Back to top ↑</a>
      </footer>
      <dialog
        className="artwork-viewer"
        ref={viewer}
        aria-label={selected ? `Artwork: ${selected.title}` : "Artwork viewer"}
        onClick={(event) => {
          if (event.target === event.currentTarget) viewer.current?.close();
        }}
        onClose={() => opener.current?.focus({ preventScroll: true })}
      >
        {selected && (
          <>
            <div className="artwork-viewer-header">
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
