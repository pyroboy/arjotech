<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import * as THREE from 'three';
  import { onMount } from 'svelte';

  interface Props {
    count?: number;
  }

  let { count = 300 }: Props = $props();

  let pointsRef = $state<THREE.Points | undefined>(undefined);
  let geometry = $state<THREE.BufferGeometry | null>(null);

  onMount(() => {
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 150 : count;

    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const inkColor = new THREE.Color('#ea580c');
    const techColor = new THREE.Color('#06b6d4');

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const c = Math.random() > 0.5 ? inkColor : techColor;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry = geo;
  });

  useTask(() => {
    if (!geometry) return;
    const positions = geometry.attributes.position;
    if (!positions) return;

    for (let i = 0; i < positions.count; i++) {
      let y = positions.getY(i);
      y += 0.003;
      if (y > 10) y = -10;
      positions.setY(i, y);
    }
    positions.needsUpdate = true;
  });
</script>

{#if geometry}
  <T.Points bind:ref={pointsRef}>
    <T is={geometry} />
    <T.PointsMaterial
      size={0.03}
      vertexColors={true}
      transparent={true}
      opacity={0.5}
      sizeAttenuation={true}
      depthWrite={false}
    />
  </T.Points>
{/if}
