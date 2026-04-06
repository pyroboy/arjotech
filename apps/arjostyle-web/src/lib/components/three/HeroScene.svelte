<script lang="ts">
  import { Canvas, T } from '@threlte/core';
  import * as THREE from 'three';
  import FloatingGeometry from './FloatingGeometry.svelte';
  import ParticleField from './ParticleField.svelte';
  import MouseFollowLight from './MouseFollowLight.svelte';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let mouseX = $state(0);
  let mouseY = $state(0);
  let visible = $state(true);
  let containerEl: HTMLDivElement;

  onMount(() => {
    function handleMouse(e: MouseEvent) {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    window.addEventListener('mousemove', handleMouse);

    // Pause when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0 }
    );
    if (containerEl) observer.observe(containerEl);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      observer.disconnect();
    };
  });

  const isMobile = browser ? window.innerWidth < 768 : false;

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
        { geometry: 'icosahedron', position: [-2.5, 1.5, -2], color: '#ea580c', opacity: 0.25, size: 1.0, rotationSpeed: 0.002, floatSpeed: 0.4, floatAmplitude: 0.3 },
        { geometry: 'octahedron', position: [2.5, -1, -1], color: '#06b6d4', opacity: 0.2, size: 0.7, rotationSpeed: 0.003, floatSpeed: 0.6, floatAmplitude: 0.2 },
        { geometry: 'torus', position: [0, 0, -3], color: '#ea580c', opacity: 0.12, size: 1.8, rotationSpeed: 0.001, floatSpeed: 0.3, floatAmplitude: 0.15 },
      ]
    : [
        { geometry: 'icosahedron', position: [-3.5, 2, -2], color: '#ea580c', opacity: 0.25, size: 1.2, rotationSpeed: 0.002, floatSpeed: 0.4, floatAmplitude: 0.3 },
        { geometry: 'icosahedron', position: [4, -1.5, -3], color: '#ea580c', opacity: 0.15, size: 0.8, rotationSpeed: 0.003, floatSpeed: 0.5, floatAmplitude: 0.2 },
        { geometry: 'octahedron', position: [2.5, 2.5, -1.5], color: '#06b6d4', opacity: 0.2, size: 0.8, rotationSpeed: 0.004, floatSpeed: 0.6, floatAmplitude: 0.25 },
        { geometry: 'octahedron', position: [-2, -2, -2.5], color: '#06b6d4', opacity: 0.18, size: 0.6, rotationSpeed: 0.003, floatSpeed: 0.35, floatAmplitude: 0.3 },
        { geometry: 'torus', position: [0, 0, -4], color: '#ea580c', opacity: 0.1, size: 2.0, rotationSpeed: 0.001, floatSpeed: 0.3, floatAmplitude: 0.15 },
        { geometry: 'dodecahedron', position: [-4, 0.5, -1], color: '#22d3ee', opacity: 0.15, size: 0.6, rotationSpeed: 0.005, floatSpeed: 0.7, floatAmplitude: 0.2 },
        { geometry: 'ring', position: [3.5, 1, -3.5], color: '#ffffff', opacity: 0.06, size: 1.3, rotationSpeed: 0.002, floatSpeed: 0.25, floatAmplitude: 0.1 },
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
        return renderer;
      }}
    >
      <T.PerspectiveCamera makeDefault position={[0, 0, 5]} fov={60} near={0.1} far={100} />

      <T.AmbientLight intensity={0.15} />

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

      <MouseFollowLight color="#ea580c" intensity={0.6} {mouseX} {mouseY} />
      <MouseFollowLight color="#06b6d4" intensity={0.4} {mouseX} {mouseY} invert={true} />
    </Canvas>
  {/if}
</div>
