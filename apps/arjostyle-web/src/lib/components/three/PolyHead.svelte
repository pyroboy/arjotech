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

  let headGroup = $state<THREE.Group | null>(null);
  let brainLight1 = $state<THREE.PointLight | null>(null);
  let brainLight2 = $state<THREE.PointLight | null>(null);
  let brainLight3 = $state<THREE.PointLight | null>(null);
  let brainMesh = $state<THREE.Mesh | null>(null);

  // Build the head geometry — elongated icosahedron
  let headGeometry = $state<THREE.IcosahedronGeometry | null>(null);
  let brainGeometry = $state<THREE.IcosahedronGeometry | null>(null);

  // Neural network lines
  let neuralLines = $state<THREE.BufferGeometry | null>(null);

  onMount(() => {
    // Head shell — elongated icosahedron
    const headGeo = new THREE.IcosahedronGeometry(1.6, 2);
    // Elongate vertically to be head-shaped (taller than wide)
    const headPos = headGeo.attributes.position;
    for (let i = 0; i < headPos.count; i++) {
      const y = headPos.getY(i);
      const x = headPos.getX(i);
      const z = headPos.getZ(i);
      // Stretch top, narrow chin
      if (y > 0) {
        headPos.setY(i, y * 1.15);
      } else {
        // Taper the chin
        const chinFactor = 1 + y * 0.2; // narrows as y goes more negative
        headPos.setX(i, x * Math.max(0.65, chinFactor));
        headPos.setZ(i, z * Math.max(0.65, chinFactor));
        headPos.setY(i, y * 0.9);
      }
    }
    headGeo.computeVertexNormals();
    headGeometry = headGeo;

    // Brain inner mesh — smaller icosahedron in upper half
    const brainGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const brainPos = brainGeo.attributes.position;
    for (let i = 0; i < brainPos.count; i++) {
      // Slight random displacement for organic feel
      const x = brainPos.getX(i) + (Math.random() - 0.5) * 0.08;
      const y = brainPos.getY(i) + (Math.random() - 0.5) * 0.08;
      const z = brainPos.getZ(i) + (Math.random() - 0.5) * 0.08;
      brainPos.setXYZ(i, x, y, z);
    }
    brainGeo.computeVertexNormals();
    brainGeometry = brainGeo;

    // Neural connection lines — random lines between brain vertices
    const linePositions: number[] = [];
    const brainVertices = brainGeo.attributes.position;
    const vertCount = brainVertices.count;
    for (let i = 0; i < 40; i++) {
      const a = Math.floor(Math.random() * vertCount);
      const b = Math.floor(Math.random() * vertCount);
      linePositions.push(
        brainVertices.getX(a), brainVertices.getY(a), brainVertices.getZ(a),
        brainVertices.getX(b), brainVertices.getY(b), brainVertices.getZ(b)
      );
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    neuralLines = lineGeo;
  });

  // Smooth mouse tracking
  let smoothMouseX = 0;
  let smoothMouseY = 0;

  useTask(() => {
    if (!headGroup) return;

    // Smooth mouse follow
    smoothMouseX += (mouseX - smoothMouseX) * 0.03;
    smoothMouseY += (mouseY - smoothMouseY) * 0.03;

    // Scroll-driven head tilt: looks down as scroll progresses
    const scrollTilt = scrollProgress * 0.6; // max ~35deg down at full scroll
    headGroup.rotation.x = -0.1 + scrollTilt + smoothMouseY * 0.15;
    headGroup.rotation.y = smoothMouseX * 0.25;

    // Subtle idle breathing rotation
    const time = performance.now() * 0.001;
    headGroup.rotation.z = Math.sin(time * 0.3) * 0.02;

    // Brain pulse lighting
    if (brainLight1) {
      brainLight1.intensity = 1.5 + Math.sin(time * 2.0) * 0.8;
    }
    if (brainLight2) {
      brainLight2.intensity = 1.0 + Math.sin(time * 3.0 + 1) * 0.6;
      brainLight2.position.x = Math.sin(time * 0.8) * 0.3;
      brainLight2.position.z = Math.cos(time * 0.8) * 0.3;
    }
    if (brainLight3) {
      brainLight3.intensity = 0.8 + Math.sin(time * 1.5 + 2) * 0.5;
      brainLight3.position.x = Math.cos(time * 0.6) * 0.4;
      brainLight3.position.z = Math.sin(time * 0.6) * 0.2;
    }

    // Brain mesh emissive pulse
    if (brainMesh) {
      const mat = brainMesh.material as THREE.MeshStandardMaterial;
      const pulse = 0.3 + Math.sin(time * 2.0) * 0.2;
      mat.emissiveIntensity = pulse;
    }
  });
</script>

<T.Group bind:ref={headGroup} position={[0, 0.3, 0]}>
  <!-- Head wireframe shell -->
  {#if headGeometry}
    <T.Mesh>
      <T is={headGeometry} />
      <T.MeshStandardMaterial
        wireframe={true}
        transparent={true}
        opacity={0.18}
        color={new THREE.Color('#94a3b8')}
        emissive={new THREE.Color('#06b6d4')}
        emissiveIntensity={0.05}
      />
    </T.Mesh>

    <!-- Second pass: very faint solid for depth -->
    <T.Mesh>
      <T is={headGeometry} />
      <T.MeshStandardMaterial
        transparent={true}
        opacity={0.03}
        color={new THREE.Color('#0c4a6e')}
        side={THREE.DoubleSide}
      />
    </T.Mesh>
  {/if}

  <!-- Brain inner mesh (upper portion of head) -->
  {#if brainGeometry}
    <T.Group position={[0, 0.45, 0]}>
      <!-- Brain wireframe -->
      <T.Mesh bind:ref={brainMesh}>
        <T is={brainGeometry} />
        <T.MeshStandardMaterial
          wireframe={true}
          transparent={true}
          opacity={0.35}
          color={new THREE.Color('#06b6d4')}
          emissive={new THREE.Color('#06b6d4')}
          emissiveIntensity={0.3}
        />
      </T.Mesh>

      <!-- Brain solid glow core -->
      <T.Mesh scale={[0.5, 0.5, 0.5]}>
        <T.IcosahedronGeometry args={[0.85, 0]} />
        <T.MeshStandardMaterial
          transparent={true}
          opacity={0.08}
          color={new THREE.Color('#ea580c')}
          emissive={new THREE.Color('#ea580c')}
          emissiveIntensity={0.8}
        />
      </T.Mesh>

      <!-- Neural connection lines -->
      {#if neuralLines}
        <T.LineSegments>
          <T is={neuralLines} />
          <T.LineBasicMaterial
            transparent={true}
            opacity={0.15}
            color={new THREE.Color('#22d3ee')}
          />
        </T.LineSegments>
      {/if}

      <!-- Brain lights — pulsing from inside -->
      <T.PointLight
        bind:ref={brainLight1}
        color={new THREE.Color('#06b6d4')}
        intensity={1.5}
        distance={4}
        decay={2}
        position={[0, 0.2, 0]}
      />
      <T.PointLight
        bind:ref={brainLight2}
        color={new THREE.Color('#ea580c')}
        intensity={1.0}
        distance={3}
        decay={2}
        position={[0.3, 0, 0.2]}
      />
      <T.PointLight
        bind:ref={brainLight3}
        color={new THREE.Color('#8b5cf6')}
        intensity={0.8}
        distance={3}
        decay={2}
        position={[-0.2, 0.1, -0.3]}
      />
    </T.Group>
  {/if}

  <!-- Orbiting ring around head -->
  <T.Mesh rotation.x={Math.PI / 2} position={[0, 0.2, 0]}>
    <T.TorusGeometry args={[2.2, 0.008, 8, 64]} />
    <T.MeshBasicMaterial
      transparent={true}
      opacity={0.12}
      color={new THREE.Color('#06b6d4')}
    />
  </T.Mesh>

  <!-- Second ring tilted -->
  <T.Mesh rotation.x={1.2} rotation.z={0.4} position={[0, 0.3, 0]}>
    <T.TorusGeometry args={[2.0, 0.006, 8, 64]} />
    <T.MeshBasicMaterial
      transparent={true}
      opacity={0.08}
      color={new THREE.Color('#ea580c')}
    />
  </T.Mesh>
</T.Group>
