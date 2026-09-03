import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Three.js 3D Hero Motion Canvas.
 * Renders an abstract, organic wing/ribbon sculpture with soft feminine curves,
 * subtle continuous harmonic undulation, delicate floating luminous particles,
 * and mouse-responsive desktop parallax.
 */
export default function HeroScene3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xfff8f5, 1.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xe9bec2, 2.6);
    mainLight.position.set(4, 5, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xdfd3b9, 1.8);
    fillLight.position.set(-5, -2, 3);
    scene.add(fillLight);

    const rosePoint = new THREE.PointLight(0xc97b84, 2.0, 15);
    rosePoint.position.set(1, 2, 2);
    scene.add(rosePoint);

    // --- Group for all 3D motion forms ---
    const motionGroup = new THREE.Group();
    scene.add(motionGroup);

    // --- 1. Organic Flowing Wing / Ribbon Curves ---
    const ribbonMaterials = [
      new THREE.MeshStandardMaterial({
        color: 0xc97b84,
        roughness: 0.28,
        metalness: 0.18,
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xdfd3b9,
        roughness: 0.35,
        metalness: 0.15,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xe9bec2,
        roughness: 0.3,
        metalness: 0.12,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
      }),
    ];

    // Define 3 intertwining wing-like 3D spline curves
    const curveConfigs = [
      // Primary upper wing arch
      [
        new THREE.Vector3(-4.5, -1.8, -1.2),
        new THREE.Vector3(-2.2, 0.4, 0.2),
        new THREE.Vector3(0.2, 1.8, 0.8),
        new THREE.Vector3(2.6, 1.2, -0.4),
        new THREE.Vector3(4.8, -0.8, -1.5),
      ],
      // Secondary supporting ribbon
      [
        new THREE.Vector3(-4.0, -0.6, -0.8),
        new THREE.Vector3(-1.8, 1.4, 0.5),
        new THREE.Vector3(0.8, 0.8, 0.2),
        new THREE.Vector3(2.8, -0.4, -0.6),
        new THREE.Vector3(4.2, 0.6, -1.0),
      ],
      // Lower feminine curve
      [
        new THREE.Vector3(-3.5, -2.2, -0.5),
        new THREE.Vector3(-0.8, -1.2, 0.6),
        new THREE.Vector3(1.6, -0.2, 0.9),
        new THREE.Vector3(3.6, -1.6, -0.2),
      ],
    ];

    const tubes = [];
    curveConfigs.forEach((points, idx) => {
      const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
      const tubularSegments = isMobile ? 40 : 80;
      const radius = 0.08 - idx * 0.015;
      const radialSegments = isMobile ? 8 : 16;
      const geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
      const mesh = new THREE.Mesh(geometry, ribbonMaterials[idx % ribbonMaterials.length]);
      motionGroup.add(mesh);
      tubes.push({ mesh, basePoints: points, curve, radius, radialSegments, tubularSegments });
    });

    // --- 2. Ambient Floating Luminous Micro-Particles ---
    const particleCount = isMobile ? 18 : 36;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 11;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      particleScales[i] = Math.random() * 0.6 + 0.4;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Custom circle texture for soft round particles
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(233, 190, 194, 1)');
    grad.addColorStop(0.5, 'rgba(201, 123, 132, 0.6)');
    grad.addColorStop(1, 'rgba(201, 123, 132, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.14,
      map: particleTexture,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    motionGroup.add(particles);

    // --- 3. Interactive Mouse Parallax Tracking ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      if (isMobile) return;
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetX = normX * 0.35;
      targetY = normY * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // --- 4. Animation Loop ---
    let animationFrameId = null;
    let clock = new THREE.Clock();

    const render = () => {
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation (lerp)
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      // Gentle organic continuous motion
      motionGroup.rotation.y = mouseX + Math.sin(elapsedTime * 0.25) * 0.08;
      motionGroup.rotation.x = mouseY + Math.cos(elapsedTime * 0.2) * 0.06;
      motionGroup.position.y = Math.sin(elapsedTime * 0.4) * 0.1;

      // Gentle particle drift
      const positions = particleGeometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        // Slow float upwards
        positions[i * 3 + 1] += 0.003;
        // Wrap around if it goes too high
        if (positions[i * 3 + 1] > 4) {
          positions[i * 3 + 1] = -4;
        }
        // Subtle drift in x
        positions[i * 3] += Math.sin(elapsedTime + i) * 0.001;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    // Render first frame or start loop
    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    // --- 5. Resize Handling ---
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // --- 6. Robust Cleanup ---
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      // Clean up Three.js objects
      tubes.forEach(({ mesh, geometry }) => {
        if (geometry) geometry.dispose();
      });
      ribbonMaterials.forEach((m) => m.dispose());
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-85 transition-opacity duration-1000"
    />
  );
}
