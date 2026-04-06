<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import * as THREE from 'three';

  interface Props {
    geometry: 'icosahedron' | 'octahedron' | 'torus' | 'dodecahedron' | 'ring';
    position?: [number, number, number];
    color?: string;
    opacity?: number;
    size?: number;
    rotationSpeed?: number;
    floatSpeed?: number;
    floatAmplitude?: number;
    mouseX?: number;
    mouseY?: number;
  }

  let {
    geometry = 'icosahedron',
    position = [0, 0, 0],
    color = '#ea580c',
    opacity = 0.3,
    size = 1,
    rotationSpeed = 0.003,
    floatSpeed = 0.5,
    floatAmplitude = 0.3,
    mouseX = 0,
    mouseY = 0
  }: Props = $props();

  let meshRef = $state<THREE.Mesh | null>(null);
  const baseY = position[1];

  useTask((delta) => {
    if (!meshRef) return;
    meshRef.rotation.x += rotationSpeed;
    meshRef.rotation.y += rotationSpeed * 0.7;
    meshRef.rotation.z += rotationSpeed * 0.3;

    const time = performance.now() * 0.001 * floatSpeed;
    meshRef.position.y = baseY + Math.sin(time) * floatAmplitude;

    // Subtle mouse parallax
    meshRef.position.x = position[0] + mouseX * 0.3;
    meshRef.position.z = position[2] + mouseY * 0.2;
  });
</script>

<T.Mesh bind:ref={meshRef} position={position}>
  {#if geometry === 'icosahedron'}
    <T.IcosahedronGeometry args={[size, 0]} />
  {:else if geometry === 'octahedron'}
    <T.OctahedronGeometry args={[size, 0]} />
  {:else if geometry === 'torus'}
    <T.TorusGeometry args={[size, size * 0.04, 8, 32]} />
  {:else if geometry === 'dodecahedron'}
    <T.DodecahedronGeometry args={[size, 0]} />
  {:else if geometry === 'ring'}
    <T.RingGeometry args={[size, size * 1.2, 32]} />
  {/if}
  <T.MeshBasicMaterial
    wireframe={true}
    transparent={true}
    opacity={opacity}
    color={new THREE.Color(color)}
  />
</T.Mesh>
