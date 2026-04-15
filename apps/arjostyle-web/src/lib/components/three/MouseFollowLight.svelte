<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import * as THREE from 'three';

  interface Props {
    color?: string;
    intensity?: number;
    mouseX?: number;
    mouseY?: number;
    invert?: boolean;
  }

  let {
    color = '#ea580c',
    intensity = 0.8,
    mouseX = 0,
    mouseY = 0,
    invert = false
  }: Props = $props();

  let lightRef = $state<THREE.PointLight | undefined>(undefined);
  let currentX = 0;
  let currentY = 0;

  useTask(() => {
    if (!lightRef) return;
    const targetX = (invert ? -mouseX : mouseX) * 4;
    const targetY = (invert ? -mouseY : mouseY) * 3;
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;
    lightRef.position.set(currentX, currentY, 3);
  });
</script>

<T.PointLight
  bind:ref={lightRef}
  color={new THREE.Color(color)}
  intensity={intensity}
  distance={15}
  decay={2}
  position={[0, 0, 3]}
/>
