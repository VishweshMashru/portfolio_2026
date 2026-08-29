"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export default function ObjArtwork() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
    camera.position.set(5.2, 3.9, 6.6);
    camera.lookAt(0.2, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const modelRoot = new THREE.Group();
    modelRoot.position.x = 0.28;
    modelRoot.rotation.set(-0.1, -0.58, 0.01);
    scene.add(modelRoot);

    scene.add(new THREE.HemisphereLight(0xfff5e9, 0x34264b, 2.8));

    const keyLight = new THREE.DirectionalLight(0xfff1de, 4.5);
    keyLight.position.set(4, 7, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const blueLight = new THREE.PointLight(0x8e79ff, 13, 20, 2);
    blueLight.position.set(-4, 2, 3);
    scene.add(blueLight);

    const warmLight = new THREE.PointLight(0xff7aa8, 10, 18, 2);
    warmLight.position.set(3, -1, -3);
    scene.add(warmLight);

    let disposed = false;
    let model: THREE.Object3D | null = null;
    let frame = 0;
    let targetRotation = modelRoot.rotation.y;
    let dragging = false;
    let pointerStart = 0;
    let rotationStart = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onModelLoaded = (object: THREE.Group) => {
      if (disposed) return;

      // The Blender file contains a large studio floor used only for the still
      // render. Removing it keeps the web object focused on the authored diorama.
      object.getObjectByName("Plane")?.removeFromParent();

      object.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.castShadow = true;
        child.receiveShadow = true;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          material.transparent = false;
          material.opacity = 1;
          material.needsUpdate = true;
        });
      });

      const bounds = new THREE.Box3().setFromObject(object);
      const center = bounds.getCenter(new THREE.Vector3());
      const size = bounds.getSize(new THREE.Vector3());
      object.position.sub(center);
      const scale = 4.35 / Math.max(size.x, size.y, size.z);
      object.scale.setScalar(scale);
      modelRoot.add(object);
      model = object;
      setStatus("ready");
    };

    const onLoadError = () => {
      if (!disposed) setStatus("error");
    };

    const materialLoader = new MTLLoader();
    materialLoader.setPath("/");
    materialLoader.load(
      "first-study.mtl",
      (materials) => {
        materials.preload();
        const objectLoader = new OBJLoader();
        objectLoader.setMaterials(materials);
        objectLoader.load("/first-study.obj", onModelLoaded, undefined, onLoadError);
      },
      undefined,
      onLoadError,
    );

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      dragging = true;
      pointerStart = event.clientX;
      rotationStart = targetRotation;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.classList.add("is-dragging");
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      targetRotation = rotationStart + (event.clientX - pointerStart) * 0.008;
    };

    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
      renderer.domElement.classList.remove("is-dragging");
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);

    let previousTime = performance.now();
    const animate = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.04);
      previousTime = time;
      if (!reduceMotion && !dragging && model) targetRotation += delta * 0.08;
      modelRoot.rotation.y = THREE.MathUtils.damp(modelRoot.rotation.y, targetRotation, 6, delta);
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      modelRoot.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.geometry.dispose();
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => material.dispose());
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="obj-artwork-shell">
      {status === "error" && <div className="obj-artwork-fallback" aria-hidden="true" />}
      <div
        ref={hostRef}
        className="obj-artwork"
        role="img"
        aria-label="Interactive rendering of Vishwesh's first Blender study"
      />
      <p className={`obj-artwork-status is-${status}`} aria-live="polite">
        {status === "loading" && "Loading model…"}
        {status === "ready" && "Drag to rotate"}
        {status === "error" && "Model unavailable"}
      </p>
    </div>
  );
}
