import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Lightweight Three.js Ambient Visual Layer for the SeaWINS Gallery.
 * Renders ~28 soft glowing champagne and rose micro-particles that drift gently
 * in depth behind the gallery grid.
 *
 * Performance features:
 * - IntersectionObserver pauses the animation loop when the gallery is off-screen.
 * - Automatically disabled on mobile (<1024px) and prefers-reduced-motion.
 * - Clean disposal of all geometries, materials, textures, and WebGL contexts.
 */
export default function GalleryAtmosphere3D({ containerRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.innerWidth >= 1024;

    // Disabled on mobile and reduced-motion for maximum battery & 60 FPS performance
    if (!isDesktop || prefersReducedMotion) {
      return undefined;
    }

    const scene = new THREE.Scene();
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false, // Atmospheric background doesn't need expensive antialiasing
      powerPreference: 'low-power',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Subtle ambient dust particle count (strictly lightweight)
    const particleCount = 28;
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      speeds[i] = 0.0015 + Math.random() * 0.002;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Circular soft falloff texture
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 32;
    textureCanvas.height = 32;
    const ctx = textureCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(233, 190, 194, 0.9)'); // Soft rose
    grad.addColorStop(0.45, 'rgba(223, 211, 185, 0.45)'); // Champagne gold
    grad.addColorStop(1, 'rgba(223, 211, 185, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const texture = new THREE.CanvasTexture(textureCanvas);

    const material = new THREE.PointsMaterial({
      size: 0.14,
      map: texture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let animationFrameId = null;
    let isVisible = true;
    const clock = new THREE.Clock();

    const render = () => {
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();
      const posArray = geometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += speeds[i];
        if (posArray[i * 3 + 1] > 5) {
          posArray[i * 3 + 1] = -5;
        }
        posArray[i * 3] += Math.sin(elapsedTime * 0.3 + i) * 0.0008;
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    // Pause rendering when gallery section is outside viewport
    const targetElement = containerRef?.current || canvas;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const currentlyVisible = entry.isIntersecting;
        if (currentlyVisible && !isVisible) {
          isVisible = true;
          animationFrameId = requestAnimationFrame(render);
        } else if (!currentlyVisible && isVisible) {
          isVisible = false;
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.01, rootMargin: '100px 0px 100px 0px' }
    );
    observer.observe(targetElement);

    // Initial frame
    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      if (!canvas) return;
      const newWidth = canvas.clientWidth || window.innerWidth;
      const newHeight = canvas.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60"
    />
  );
}
