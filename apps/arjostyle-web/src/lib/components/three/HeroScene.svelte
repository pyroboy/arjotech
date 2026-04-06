<script lang="ts">
  import { Canvas, T } from '@threlte/core';
  import * as THREE from 'three';
  import FloatingGeometry from './FloatingGeometry.svelte';
  import ParticleField from './ParticleField.svelte';
  import MouseFollowLight from './MouseFollowLight.svelte';
  import PolyHead from './PolyHead.svelte';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let mouseX = $state(0);
  let mouseY = $state(0);
  let scrollProgress = $state(0);
  let visible = $state(true);
  let containerEl: HTMLDivElement;

  onMount(() => {
    function handleMouse(e: MouseEvent) {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    function handleScroll() {
      const vh = window.innerHeight;
      scrollProgress = Math.min(window.scrollY / vh, 1);
    }

    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Pause when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0 }
    );
    if (containerEl) observer.observe(containerEl);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  });

  const isMobile = browser ? window.innerWidth < 768 : false;

  // Fewer floating shapes now — the head is the focal point
  const shapes: Array<{
    geometry: 'icosahedron' | 'octahedron' | 'torus' | 'dodecahedron' | 'ring';
    position: [number, number, number];
    color: string;
    opacity: number;
    size: number;
    rotationSpeed: number;
    floatSpeed: number;
    floatAmplitude: number;
  }> = isMobile
    ? [
        { geometry: 'octahedron', position: [-2.5, 1.5, -3], color: '#06b6d4', opacity: 0.12, size: 0.5, rotationSpeed: 0.003, floatSpeed: 0.5, floatAmplitude: 0.2 },
        { geometry: 'octahedron', position: [2.5, -1.5, -3], color: '#ea580c', opacity: 0.1, size: 0.4, rotationSpeed: 0.004, floatSpeed: 0.6, floatAmplitude: 0.15 },
      ]
    : [
        { geometry: 'octahedron', position: [-4.5, 2, -3], color: '#06b6d4', opacity: 0.12, size: 0.6, rotationSpeed: 0.003, floatSpeed: 0.5, floatAmplitude: 0.25 },
        { geometry: 'octahedron', position: [4.5, -1.5, -2.5], color: '#ea580c', opacity: 0.1, size: 0.5, rotationSpeed: 0.004, floatSpeed: 0.6, floatAmplitude: 0.2 },
        { geometry: 'dodecahedron', position: [-3.5, -2, -4], color: '#8b5cf6', opacity: 0.08, size: 0.4, rotationSpeed: 0.005, floatSpeed: 0.7, floatAmplitude: 0.15 },
        { geometry: 'dodecahedron', position: [3.5, 2.5, -3.5], color: '#22d3ee', opacity: 0.08, size: 0.35, rotationSpeed: 0.004, floatSpeed: 0.4, floatAmplitude: 0.2 },
      ];
</script>

<div
  bind:this={containerEl}
  class="absolute inset-0 z-0 opacity-0 animate-[fadeIn_1.5s_ease-out_forwards]"
>
  {#if visible}
    <Canvas
      createRenderer={(canvas) => {
        const renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: !isMobile,
          powerPreference: 'low-power'
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        return renderer;
      }}
    >
      <T.PerspectiveCamera makeDefault position={[0, 0.5, 5.5]} fov={50} near={0.1} far={100} />

      <T.AmbientLight intensity={0.08} />

      <!-- Key light from top-right -->
      <T.DirectionalLight
        position={[3, 4, 2]}
        intensity={0.3}
        color={new THREE.Color('#e0f2fe')}
      />

      <!-- Rim light from behind-left for edge definition -->
      <T.DirectionalLight
        position={[-3, 2, -2]}
        intensity={0.15}
        color={new THREE.Color('#06b6d4')}
      />

      <!-- The polygonal head -->
      <PolyHead {scrollProgress} {mouseX} {mouseY} />

      <!-- Ambient floating shapes (reduced, pushed to edges) -->
      {#each shapes as shape}
        <FloatingGeometry
          geometry={shape.geometry}
          position={shape.position}
          color={shape.color}
          opacity={shape.opacity}
          size={shape.size}
          rotationSpeed={shape.rotationSpeed}
          floatSpeed={shape.floatSpeed}
          floatAmplitude={shape.floatAmplitude}
          {mouseX}
          {mouseY}
        />
      {/each}

      <ParticleField />

      <MouseFollowLight color="#ea580c" intensity={0.4} {mouseX} {mouseY} />
      <MouseFollowLight color="#06b6d4" intensity={0.3} {mouseX} {mouseY} invert={true} />
    </Canvas>
  {/if}
</div>
