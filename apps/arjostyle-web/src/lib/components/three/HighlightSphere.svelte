<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { Text } from '@threlte/extras';
  import { onDestroy } from 'svelte';
  import * as THREE from 'three';

  interface Props {
    highlightColor?: THREE.Color;
    highlightOpacity?: number;
    targetScale?: number;
    position?: [number, number, number];
    debugTextPosition?: [number, number, number] | null;
    debugTextScale?: number;
    editMode?: boolean;
    shouldPulsate?: boolean;
    onPointerDown?: (event: THREE.Event) => void;
    onPointerMove?: (event: THREE.Event) => void;
    onPointerUp?: (event: THREE.Event) => void;
  }

  let {
    highlightColor = new THREE.Color(0xffffff),
    highlightOpacity = 0.5,
    targetScale = 1,
    position = [0, 0, 0],
    debugTextPosition = null,
    debugTextScale = 0,
    editMode = false,
    shouldPulsate = false,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  }: Props = $props();

  // Refs to Three.js objects (set via bind:ref)
  let meshRef: THREE.Mesh | undefined = $state();
  let materialRef: THREE.MeshBasicMaterial | undefined = $state();
  let pointLightRef: THREE.PointLight | undefined = $state();

  // --- Constants (matching tattoo-tide HighlightSphere) ---
  const STYLE_SMOOTHING_FACTOR = 7.0;
  const LERP_THRESHOLD = 0.01;
  const DEFAULT_LIGHT_INTENSITY = 0.06;
  const SPHERE_RADIUS = 0.5;
  const MIN_VISIBLE_SCALE_SQ = 0.000001;

  // Pulsating constants (ported from tattoo-tide Human3DViewer useFrame)
  const SCALE_ANIMATION_SPEED = 3;
  const SCALE_ANIMATION_AMPLITUDE_FACTOR = 0.15;
  const MIN_TARGET_SCALE = 0.001;

  let currentColor = new THREE.Color();
  let currentOpacity = 0;
  let currentScale = 0;
  let elapsedTime = 0;
  let isActive = true;

  // Frame loop using useTask (equivalent to useFrame in R3F)
  const { stop } = useTask((delta) => {
    if (!isActive || !meshRef || !materialRef) return;

    elapsedTime += delta;

    // Calculate effective target scale (with pulsation if enabled)
    let effectiveTargetScale = targetScale;
    if (shouldPulsate && targetScale > 0) {
      const oscillation = Math.sin(elapsedTime * SCALE_ANIMATION_SPEED);
      effectiveTargetScale = targetScale * (1 + SCALE_ANIMATION_AMPLITUDE_FACTOR * oscillation);
      effectiveTargetScale = Math.max(MIN_TARGET_SCALE, effectiveTargetScale);
    }

    const colorNeedsUpdate = !currentColor.equals(highlightColor);
    const opacityDiff = Math.abs(currentOpacity - highlightOpacity);
    const scaleDiff = Math.abs(currentScale - effectiveTargetScale);

    // For pulsating, always update scale
    if (!colorNeedsUpdate && opacityDiff <= Number.EPSILON && scaleDiff <= Number.EPSILON && !shouldPulsate) return;

    const dt = Math.min(delta, 0.05);
    const lerpAlpha = 1 - Math.exp(-STYLE_SMOOTHING_FACTOR * dt);

    if (colorNeedsUpdate) {
      materialRef.color.lerp(highlightColor, lerpAlpha);
      const rDiff = materialRef.color.r - highlightColor.r;
      const gDiff = materialRef.color.g - highlightColor.g;
      const bDiff = materialRef.color.b - highlightColor.b;
      if (rDiff * rDiff + gDiff * gDiff + bDiff * bDiff < LERP_THRESHOLD * LERP_THRESHOLD) {
        materialRef.color.copy(highlightColor);
      }
      if (pointLightRef) pointLightRef.color.copy(materialRef.color);
      currentColor.copy(materialRef.color);
    }

    if (opacityDiff > Number.EPSILON) {
      materialRef.opacity = THREE.MathUtils.lerp(materialRef.opacity, highlightOpacity, lerpAlpha);
      if (Math.abs(materialRef.opacity - highlightOpacity) < LERP_THRESHOLD) {
        materialRef.opacity = highlightOpacity;
      }
      const isTransparent = materialRef.opacity < 1.0 - Number.EPSILON;
      if (materialRef.transparent !== isTransparent) {
        materialRef.transparent = isTransparent;
        materialRef.needsUpdate = true;
      }
      if (pointLightRef) pointLightRef.intensity = DEFAULT_LIGHT_INTENSITY * materialRef.opacity;
      currentOpacity = materialRef.opacity;
    }

    // Scale interpolation (always runs when pulsating)
    if (scaleDiff > Number.EPSILON || shouldPulsate) {
      const newScale = THREE.MathUtils.lerp(meshRef.scale.x, effectiveTargetScale, lerpAlpha);
      if (!shouldPulsate && Math.abs(newScale - effectiveTargetScale) < LERP_THRESHOLD) {
        meshRef.scale.setScalar(effectiveTargetScale);
      } else {
        meshRef.scale.setScalar(newScale);
      }
      const scaleSq = meshRef.scale.x * meshRef.scale.x;
      meshRef.visible = scaleSq > MIN_VISIBLE_SCALE_SQ;
      currentScale = meshRef.scale.x;
    }
  });

  // Cleanup on unmount: stop task loop and dispose geometry/material
  onDestroy(() => {
    isActive = false;
    stop();
    if (meshRef) {
      if (meshRef.geometry) meshRef.geometry.dispose();
    }
    if (materialRef) {
      materialRef.dispose();
    }
  });

  // Text position: slightly above the sphere
  let textPos = $derived<[number, number, number]>(
    debugTextPosition
      ? [debugTextPosition[0], debugTextPosition[1] + SPHERE_RADIUS + 0.05, debugTextPosition[2]]
      : [0, SPHERE_RADIUS + 0.05, 0]
  );

  let positionText = $derived(
    debugTextPosition
      ? `Pos: [${debugTextPosition.map((p) => p.toFixed(2)).join(', ')}] | Scale: ${(debugTextScale ?? 0).toFixed(3)}`
      : ''
  );
</script>

<T.Group>
  <T.Mesh
    bind:ref={meshRef}
    {position}
    renderOrder={999}
    onpointerdown={editMode ? onPointerDown : undefined}
    onpointermove={editMode ? onPointerMove : undefined}
    onpointerup={editMode ? onPointerUp : undefined}
  >
    <T.SphereGeometry args={[0.5, 16, 8]} />
    <T.MeshBasicMaterial
      bind:ref={materialRef}
      color={highlightColor}
      opacity={highlightOpacity}
      transparent={true}
      depthTest={false}
      depthWrite={false}
    />
    <T.PointLight bind:ref={pointLightRef} decay={2} />
  </T.Mesh>

  {#if editMode && debugTextPosition && positionText}
    <Text
      position={textPos}
      fontSize={0.035}
      color="black"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.002}
      outlineColor="white"
      renderOrder={1000}
      text={positionText}
    />
  {/if}
</T.Group>
