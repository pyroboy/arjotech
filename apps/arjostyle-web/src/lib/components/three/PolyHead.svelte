<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import * as THREE from 'three';
  import { onMount } from 'svelte';

  interface Props {
    scrollProgress?: number;
    mouseX?: number;
    mouseY?: number;
  }

  let {
    scrollProgress = 0,
    mouseX = 0,
    mouseY = 0
  }: Props = $props();

  let group = $state<THREE.Group | undefined>(undefined);
  let brainLight1 = $state<THREE.PointLight | undefined>(undefined);
  let brainLight2 = $state<THREE.PointLight | undefined>(undefined);
  let brainLight3 = $state<THREE.PointLight | undefined>(undefined);
  let brainGeometry = $state<THREE.IcosahedronGeometry | null>(null);
  let neuralLines = $state<THREE.BufferGeometry | null>(null);

  onMount(() => {
    // Brain mesh — organic icosahedron with displaced vertices
    const geo = new THREE.IcosahedronGeometry(1.4, 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setXYZ(
        i,
        pos.getX(i) + (Math.random() - 0.5) * 0.12,
        pos.getY(i) + (Math.random() - 0.5) * 0.12,
        pos.getZ(i) + (Math.random() - 0.5) * 0.12
      );
    }
    geo.computeVertexNormals();
    brainGeometry = geo;

    // Neural connection lines — 50 random connections between brain vertices
    const linePositions: number[] = [];
    for (let i = 0; i < 50; i++) {
      const a = Math.floor(Math.random() * pos.count);
      const b = Math.floor(Math.random() * pos.count);
      linePositions.push(
        pos.getX(a), pos.getY(a), pos.getZ(a),
        pos.getX(b), pos.getY(b), pos.getZ(b)
      );
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    neuralLines = lineGeo;
  });

  let smoothMouseX = 0;
  let smoothMouseY = 0;

  useTask(() => {
    if (!group) return;

    smoothMouseX += (mouseX - smoothMouseX) * 0.03;
    smoothMouseY += (mouseY - smoothMouseY) * 0.03;

    // Scroll tilt — looks down as you scroll
    const scrollTilt = scrollProgress * 0.5;
    group.rotation.x = scrollTilt + smoothMouseY * 0.15;
    group.rotation.y = smoothMouseX * 0.25;

    // Idle breathing
    const time = performance.now() * 0.001;
    group.rotation.z = Math.sin(time * 0.3) * 0.02;

    // Pulsing brain lights
    if (brainLight1) {
      brainLight1.intensity = 2.5 + Math.sin(time * 2.0) * 1.5;
    }
    if (brainLight2) {
      brainLight2.intensity = 1.8 + Math.sin(time * 3.0 + 1) * 1.0;
      brainLight2.position.x = Math.sin(time * 0.8) * 0.4;
      brainLight2.position.z = Math.cos(time * 0.8) * 0.4;
    }
    if (brainLight3) {
      brainLight3.intensity = 1.2 + Math.sin(time * 1.5 + 2) * 0.8;
      brainLight3.position.x = Math.cos(time * 0.6) * 0.5;
      brainLight3.position.z = Math.sin(time * 0.6) * 0.3;
    }

  });
</script>

<T.Group bind:ref={group} position={[0, 0.2, 0]}>
  {#if brainGeometry}
    <!-- Orange glow core -->
    <T.Mesh scale={[0.55, 0.55, 0.55]}>
      <T.IcosahedronGeometry args={[1.4, 0]} />
      <T.MeshStandardMaterial
        transparent={true}
        opacity={0.1}
        color={new THREE.Color('#ea580c')}
        emissive={new THREE.Color('#ea580c')}
        emissiveIntensity={1.0}
      />
    </T.Mesh>

    <!-- Purple glow core -->
    <T.Mesh scale={[0.4, 0.4, 0.4]} position={[0.15, 0.15, 0]}>
      <T.IcosahedronGeometry args={[1.4, 0]} />
      <T.MeshStandardMaterial
        transparent={true}
        opacity={0.08}
        color={new THREE.Color('#8b5cf6')}
        emissive={new THREE.Color('#8b5cf6')}
        emissiveIntensity={0.9}
      />
    </T.Mesh>

    <!-- Neural connection lines -->
    {#if neuralLines}
      <T.LineSegments>
        <T is={neuralLines} />
        <T.LineBasicMaterial
          transparent={true}
          opacity={0.2}
          color={new THREE.Color('#22d3ee')}
        />
      </T.LineSegments>
    {/if}

    <!-- Pulsing brain lights -->
    <T.PointLight
      bind:ref={brainLight1}
      color={new THREE.Color('#06b6d4')}
      intensity={2.5}
      distance={5}
      decay={2}
      position={[0, 0.3, 0]}
    />
    <T.PointLight
      bind:ref={brainLight2}
      color={new THREE.Color('#ea580c')}
      intensity={1.8}
      distance={4}
      decay={2}
      position={[0.4, 0, 0.3]}
    />
    <T.PointLight
      bind:ref={brainLight3}
      color={new THREE.Color('#8b5cf6')}
      intensity={1.2}
      distance={3.5}
      decay={2}
      position={[-0.3, 0.15, -0.3]}
    />
  {/if}

  <!-- Orbiting ring -->
  <T.Mesh rotation.x={Math.PI / 2} position={[0, 0, 0]}>
    <T.TorusGeometry args={[2.0, 0.008, 8, 64]} />
    <T.MeshBasicMaterial
      transparent={true}
      opacity={0.12}
      color={new THREE.Color('#06b6d4')}
    />
  </T.Mesh>

  <!-- Second ring tilted -->
  <T.Mesh rotation.x={1.2} rotation.z={0.4} position={[0, 0.1, 0]}>
    <T.TorusGeometry args={[1.8, 0.006, 8, 64]} />
    <T.MeshBasicMaterial
      transparent={true}
      opacity={0.08}
      color={new THREE.Color('#ea580c')}
    />
  </T.Mesh>
</T.Group>
