<script lang="ts">
  import { Canvas, T } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import * as THREE from 'three';
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';

  interface Props {
    editMode?: boolean;
    cameraPosition?: [number, number, number];
    cameraFov?: number;
    controlsTarget?: [number, number, number];
    isMinimized?: boolean;
    isAnimating?: boolean;
    isContainerResizing?: boolean;
    onCameraChange?: (azimuth: number, polar: number, distance: number) => void;
    children?: Snippet;
  }

  let {
    editMode = false,
    cameraPosition = [0, -0.56, 1.23],
    cameraFov = 45,
    controlsTarget = [0, -0.56, 0.13],
    isMinimized = false,
    isAnimating = false,
    isContainerResizing = false,
    onCameraChange,
    children,
  }: Props = $props();

  // Spherical helper for computing camera angles from OrbitControls
  const _spherical = new THREE.Spherical();

  let mounted = $state(false);
  let cameraRef = $state<THREE.PerspectiveCamera | null>(null);
  onMount(() => { mounted = true; });

  // Update projection matrix when FOV changes
  $effect(() => {
    if (cameraRef) {
      cameraRef.fov = cameraFov;
      cameraRef.updateProjectionMatrix();
    }
  });
</script>

<div class="relative z-0 w-full h-full overflow-hidden bg-zinc-950">
  {#if mounted}
  <Canvas
    createRenderer={(canvas) => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isMobile, // skip AA on mobile for performance
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap at 2x for 3x phones
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      return renderer;
    }}
  >
    <!-- Camera with OrbitControls as child -->
    <T.PerspectiveCamera
      makeDefault
      position={cameraPosition}
      fov={cameraFov}
      near={0.1}
      far={1000}
      oncreate={(ref) => { cameraRef = ref; }}
    >
      <OrbitControls
        enabled={!isMinimized && !isAnimating && !isContainerResizing}
        enablePan={editMode && !isMinimized}
        enableZoom={!isMinimized}
        enableDamping={true}
        dampingFactor={0.1}
        minDistance={0.5}
        maxDistance={20}
        target={controlsTarget}
        onchange={() => {
          if (onCameraChange && cameraRef) {
            const target = new THREE.Vector3(controlsTarget[0], controlsTarget[1], controlsTarget[2]);
            const offset = cameraRef.position.clone().sub(target);
            _spherical.setFromVector3(offset);
            // Convert: theta = azimuth, phi = polar, r = distance
            onCameraChange(_spherical.theta, _spherical.phi, _spherical.radius);
          }
        }}
      />
    </T.PerspectiveCamera>

    <!-- Lighting -->
    {#if isMinimized}
      <T.AmbientLight intensity={1.0} />
    {:else}
      <T.AmbientLight intensity={0.7} />
      <T.DirectionalLight position={[5, 10, 7.5]} intensity={1.0} />
      <T.DirectionalLight position={[-5, 5, -7.5]} intensity={0.3} />
    {/if}

    <!-- Scene content -->
    {#if children}
      {@render children()}
    {/if}
  </Canvas>
  {:else}
    <div class="flex items-center justify-center h-full">
      <p class="text-zinc-500 text-sm">Loading 3D viewer...</p>
    </div>
  {/if}
</div>
