"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Blender's authored camera, converted from Z-up to glTF's Y-up coordinates.
const cameraPosition = new THREE.Vector3(-8.4168, 14.1008, 10.0662);
const cameraTarget = new THREE.Vector3(0, 1.1, 0);

function disposeModel(root: THREE.Object3D) {
  const materials = new Set<THREE.Material>();
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    (Array.isArray(object.material)
      ? object.material
      : [object.material]
    ).forEach((material) => materials.add(material));
  });
  materials.forEach((material) => material.dispose());
}

export default function JapResScene({ onClose }: { onClose: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      const frame = requestAnimationFrame(() => setStatus("error"));
      return () => cancelAnimationFrame(frame);
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 100);
    camera.position.copy(cameraPosition);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(cameraTarget);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.12;
    controls.minDistance = 9;
    controls.maxDistance = 29;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.update();
    controls.saveState();

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    room.traverse((object) => {
      if (object instanceof THREE.PointLight) object.color.set(0x9b9cdd);
      if (
        object instanceof THREE.Mesh &&
        object.material instanceof THREE.MeshLambertMaterial
      ) {
        object.material.emissive.set(
          object.position.x < -5 ? 0xffbd96 : 0x8986ff,
        );
      }
    });
    const environment = pmrem.fromScene(room, 0.04);
    room.dispose();
    pmrem.dispose();
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.28;
    scene.add(new THREE.HemisphereLight(0x777ac9, 0x342044, 0.45));
    const key = new THREE.DirectionalLight(0xffbd98, 1.7);
    key.position.set(-10, 7, -10);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = key.shadow.camera.bottom = -6;
    key.shadow.camera.right = key.shadow.camera.top = 6;
    key.shadow.bias = -0.0005;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8674ff, 3.5);
    rim.position.set(11, 5.5, 9.5);
    scene.add(rim);
    const blue = new THREE.DirectionalLight(0x79b4ff, 2);
    blue.position.set(4.4, 4.7, -5.5);
    scene.add(blue);
    const interior = new THREE.PointLight(0xff9b62, 30, 5, 2);
    interior.position.set(0, 1.8, 0);
    scene.add(interior);
    const neon = new THREE.PointLight(0xff385e, 8, 3, 2);
    neon.position.set(-2.5, 3.1, 0);
    scene.add(neon);

    let disposed = false;
    let visible = true;
    let frame = 0;
    let model: THREE.Object3D | null = null;
    // Render only while interacting or easing, and stop when off-screen.
    const render = () => {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      const moving = controls.update();
      renderer.render(scene, camera);
      if (moving && !frame) frame = requestAnimationFrame(render);
    };
    const invalidate = () => {
      if (!disposed && visible && !document.hidden && !frame)
        frame = requestAnimationFrame(render);
    };
    controls.addEventListener("change", invalidate);
    resetRef.current = () => {
      controls.reset();
      invalidate();
    };
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      invalidate();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) invalidate();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    observer.observe(host);
    document.addEventListener("visibilitychange", invalidate);
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        ![
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "+",
          "-",
          "=",
          "Home",
        ].includes(event.key)
      )
        return;
      event.preventDefault();
      if (event.key === "Home") {
        resetRef.current?.();
        return;
      }
      const offset = camera.position.clone().sub(controls.target);
      const spherical = new THREE.Spherical().setFromVector3(offset);
      if (event.key === "ArrowLeft") spherical.theta -= 0.13;
      if (event.key === "ArrowRight") spherical.theta += 0.13;
      if (event.key === "ArrowUp") spherical.phi -= 0.1;
      if (event.key === "ArrowDown") spherical.phi += 0.1;
      if (event.key === "+" || event.key === "=") spherical.radius /= 1.1;
      if (event.key === "-") spherical.radius *= 1.1;
      spherical.phi = THREE.MathUtils.clamp(
        spherical.phi,
        0.1,
        controls.maxPolarAngle,
      );
      spherical.radius = THREE.MathUtils.clamp(
        spherical.radius,
        controls.minDistance,
        controls.maxDistance,
      );
      camera.position
        .copy(controls.target)
        .add(new THREE.Vector3().setFromSpherical(spherical));
      controls.update();
      invalidate();
    };
    host.addEventListener("keydown", onKeyDown);
    const onContextLost = (event: Event) => {
      event.preventDefault();
      if (!disposed) setStatus("error");
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    new GLTFLoader().load(
      "/japres.glb",
      (gltf) => {
        if (disposed) {
          disposeModel(gltf.scene);
          return;
        }
        model = gltf.scene;
        model.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });
        scene.add(model);
        setStatus("ready");
        resize();
      },
      undefined,
      () => {
        if (!disposed) setStatus("error");
      },
    );
    resize();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", invalidate);
      host.removeEventListener("keydown", onKeyDown);
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        onContextLost,
      );
      controls.removeEventListener("change", invalidate);
      controls.dispose();
      resetRef.current = null;
      if (model) disposeModel(model);
      key.shadow.map?.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className={`japres-interactive is-${status}`}>
      <div
        className="japres-canvas"
        ref={hostRef}
        tabIndex={0}
        role="group"
        aria-label="JapRes ramen shop. Drag to orbit, pinch or scroll to zoom. Arrow keys rotate, plus and minus zoom, Home resets the view."
      />
      <div className="japres-tools">
        {status === "ready" && (
          <button
            className="icon-button"
            aria-label="Reset JapRes view"
            title="Reset view"
            onClick={() => resetRef.current?.()}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M3 10a9 9 0 1 1 1 7M3 4v6h6" />
            </svg>
          </button>
        )}
        <button
          className="icon-button"
          aria-label="Close JapRes 3D view"
          title="Close 3D view"
          onClick={onClose}
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path d="m6 6 12 12M6 18 18 6" />
          </svg>
        </button>
      </div>
      {status !== "ready" && (
        <p className="japres-status" role="status">
          {status === "loading"
            ? "Loading scene…"
            : "3D unavailable. You can still view the render."}
        </p>
      )}
    </div>
  );
}
