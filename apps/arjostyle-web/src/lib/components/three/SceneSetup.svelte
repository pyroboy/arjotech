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
    children?: Snippet;
  }

  let {
    editMode = false,
    cameraPosition = [0, 0.5, 3],
    cameraFov = 45,
    controlsTarget = [0, 0.5, 0],
    isMinimized = false,
    isAnimating = false,
    isContainerResizing = false,
    children,
  }: Props = $props();

  let mounted = $state(false);
  onMount(() => { mounted = true; });
</script>

<div class="relative z-0 w-full h-full overflow-hidden bg-zinc-950">
  {#if mounted}
  <Canvas
    createRenderer={(canvas) => {
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
      });
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
