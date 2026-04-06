<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { useGltf } from '@threlte/extras';
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

  // Load the head model
  const gltf = useGltf('/models/head.glb');

  // Build the brain geometry once mounted
  let brainGeometry = $state<THREE.IcosahedronGeometry | null>(null);
  let neuralLines = $state<THREE.BufferGeometry | null>(null);

  onMount(() => {
    // Brain inner mesh
    const brainGeo = new THREE.IcosahedronGeometry(0.065, 1);
    const brainPos = brainGeo.attributes.position;
    for (let i = 0; i < brainPos.count; i++) {
      brainPos.setXYZ(
        i,
        brainPos.getX(i) + (Math.random() - 0.5) * 0.006,
        brainPos.getY(i) + (Math.random() - 0.5) * 0.006,
        brainPos.getZ(i) + (Math.random() - 0.5) * 0.006
      );
    }
    brainGeo.computeVertexNormals();
    brainGeometry = brainGeo;

    // Neural connection lines
    const linePositions: number[] = [];
    const verts = brainGeo.attributes.position;
    for (let i = 0; i < 50; i++) {
      const a = Math.floor(Math.random() * verts.count);
      const b = Math.floor(Math.random() * verts.count);
      linePositions.push(
        verts.getX(a), verts.getY(a), verts.getZ(a),
        verts.getX(b), verts.getY(b), verts.getZ(b)
      );
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    neuralLines = lineGeo;
  });

  // Process loaded model — convert to wireframe
  let headMeshes = $state<THREE.Mesh[]>([]);

  $effect(() => {
    if (!$gltf) return;
    const meshes: THREE.Mesh[] = [];
    $gltf.scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        meshes.push(mesh);
      }
    });
    headMeshes = meshes;
  });

  // Smooth mouse tracking
  let smoothMouseX = 0;
  let smoothMouseY = 0;

  useTask(() => {
    if (!headGroup) return;

    smoothMouseX += (mouseX - smoothMouseX) * 0.03;
    smoothMouseY += (mouseY - smoothMouseY) * 0.03;

    // Scroll-driven head tilt
    const scrollTilt = scrollProgress * 0.5;
    headGroup.rotation.x = scrollTilt + smoothMouseY * 0.12;
    headGroup.rotation.y = Math.PI + smoothMouseX * 0.2;

    const time = performance.now() * 0.001;
    headGroup.rotation.z = Math.sin(time * 0.3) * 0.015;

    // Brain lights pulse
    if (brainLight1) {
      brainLight1.intensity = 2.0 + Math.sin(time * 2.0) * 1.2;
    }
    if (brainLight2) {
      brainLight2.intensity = 1.5 + Math.sin(time * 3.0 + 1) * 0.8;
      brainLight2.position.x = Math.sin(time * 0.8) * 0.03;
      brainLight2.position.z = Math.cos(time * 0.8) * 0.03;
    }
    if (brainLight3) {
      brainLight3.intensity = 1.0 + Math.sin(time * 1.5 + 2) * 0.6;
      brainLight3.position.x = Math.cos(time * 0.6) * 0.04;
      brainLight3.position.z = Math.sin(time * 0.6) * 0.02;
    }

    // Brain emissive pulse
    if (brainMesh) {
      const mat = brainMesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(time * 2.0) * 0.3;
    }
  });
</script>

<T.Group bind:ref={headGroup} position={[0, -0.05, 0]} scale={[8, 8, 8]}>
  <!-- Head wireframe from GLTF model -->
  {#each headMeshes as mesh}
    <!-- Primary wireframe -->
    <T.Mesh geometry={mesh.geometry}>
      <T.MeshStandardMaterial
        wireframe={true}
        transparent={true}
        opacity={0.2}
        color={new THREE.Color('#94a3b8')}
        emissive={new THREE.Color('#06b6d4')}
        emissiveIntensity={0.08}
      />
    </T.Mesh>

    <!-- Faint solid fill for depth -->
    <T.Mesh geometry={mesh.geometry}>
      <T.MeshStandardMaterial
        transparent={true}
        opacity={0.025}
        color={new THREE.Color('#0c4a6e')}
        side={THREE.BackSide}
      />
    </T.Mesh>

    <!-- Subtle edge highlight -->
    <T.Mesh geometry={mesh.geometry}>
      <T.MeshStandardMaterial
        transparent={true}
        opacity={0.04}
        color={new THREE.Color('#06b6d4')}
        emissive={new THREE.Color('#06b6d4')}
        emissiveIntensity={0.15}
        side={THREE.FrontSide}
      />
    </T.Mesh>
  {/each}

  <!-- Brain group — positioned inside upper skull -->
  {#if brainGeometry}
    <T.Group position={[0, 0.08, 0.01]}>
      <!-- Brain wireframe mesh -->
      <T.Mesh bind:ref={brainMesh}>
        <T is={brainGeometry} />
        <T.MeshStandardMaterial
          wireframe={true}
          transparent={true}
          opacity={0.5}
          color={new THREE.Color('#06b6d4')}
          emissive={new THREE.Color('#06b6d4')}
          emissiveIntensity={0.4}
        />
      </T.Mesh>

      <!-- Brain glow core (orange) -->
      <T.Mesh scale={[0.5, 0.5, 0.5]}>
        <T.IcosahedronGeometry args={[0.065, 0]} />
        <T.MeshStandardMaterial
          transparent={true}
          opacity={0.12}
          color={new THREE.Color('#ea580c')}
          emissive={new THREE.Color('#ea580c')}
          emissiveIntensity={1.0}
        />
      </T.Mesh>

      <!-- Second glow core (purple) -->
      <T.Mesh scale={[0.35, 0.35, 0.35]} position={[0.01, 0.01, 0]}>
        <T.IcosahedronGeometry args={[0.065, 0]} />
        <T.MeshStandardMaterial
          transparent={true}
          opacity={0.08}
          color={new THREE.Color('#8b5cf6')}
          emissive={new THREE.Color('#8b5cf6')}
          emissiveIntensity={0.8}
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

      <!-- Brain lights — pulsing from inside -->
      <T.PointLight
        bind:ref={brainLight1}
        color={new THREE.Color('#06b6d4')}
        intensity={2.0}
        distance={0.5}
        decay={2}
        position={[0, 0.02, 0]}
      />
      <T.PointLight
        bind:ref={brainLight2}
        color={new THREE.Color('#ea580c')}
        intensity={1.5}
        distance={0.4}
        decay={2}
        position={[0.03, 0, 0.02]}
      />
      <T.PointLight
        bind:ref={brainLight3}
        color={new THREE.Color('#8b5cf6')}
        intensity={1.0}
        distance={0.35}
        decay={2}
        position={[-0.02, 0.01, -0.02]}
      />
    </T.Group>
  {/if}

  <!-- Orbiting ring around head -->
  <T.Mesh rotation.x={Math.PI / 2} position={[0, 0.04, 0]}>
    <T.TorusGeometry args={[0.18, 0.0008, 8, 64]} />
    <T.MeshBasicMaterial
      transparent={true}
      opacity={0.15}
      color={new THREE.Color('#06b6d4')}
    />
  </T.Mesh>

  <!-- Second ring tilted -->
  <T.Mesh rotation.x={1.2} rotation.z={0.4} position={[0, 0.05, 0]}>
    <T.TorusGeometry args={[0.16, 0.0006, 8, 64]} />
    <T.MeshBasicMaterial
      transparent={true}
      opacity={0.1}
      color={new THREE.Color('#ea580c')}
    />
  </T.Mesh>
</T.Group>
