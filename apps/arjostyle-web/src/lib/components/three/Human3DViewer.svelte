<script lang="ts">
  import { onDestroy } from 'svelte';
  import * as THREE from 'three';
  import SceneSetup from './SceneSetup.svelte';
  import HumanModel from './HumanModel.svelte';
  import HighlightSphere from './HighlightSphere.svelte';
  import CameraAnimator from './CameraAnimator.svelte';
  import type { BodyPartMappingData } from '$types/mapping';

  interface Props {
    modelUrl: string | undefined;
    isColor?: boolean;
    mapping: BodyPartMappingData | null | undefined;
    editMode?: boolean;
    onMappingUpdate?: (category: string, placement: string, update: Partial<BodyPartMappingData>) => void;
    selectedCategory?: string | null;
    currentPlacement?: string | null;
    size?: number;
    cameraFov?: number;
    isContainerResizing?: boolean;
    onCameraChange?: (azimuth: number, polar: number, distance: number) => void;
  }

  let {
    modelUrl,
    isColor = true,
    mapping = null,
    editMode = false,
    onMappingUpdate,
    selectedCategory = null,
    currentPlacement = null,
    size,
    cameraFov = 45,
    isContainerResizing = false,
    onCameraChange,
  }: Props = $props();

  // --- Constants (ported from tattoo-tide) ---
  const SQUARE_INCHES_TO_SCALE_FACTOR = 0.05;
  const MIN_TARGET_SCALE = 0.001;
  const MIN_ANIMATION_BASE_SCALE = 0.05;
  const INITIAL_VISIBILITY_DELAY_MS = 1100;

  // --- Pain color stops (ported from tattoo-tide usePainHighlightStyle) ---
  const PAIN_COLORS: { level: number; color: THREE.Color }[] = [
    { level: 1, color: new THREE.Color('#00FF80') },
    { level: 2, color: new THREE.Color('#00FF40') },
    { level: 3, color: new THREE.Color('#00FF00') },
    { level: 4, color: new THREE.Color('#80FF00') },
    { level: 5, color: new THREE.Color('#FFFF00') },
    { level: 6, color: new THREE.Color('#FFBF00') },
    { level: 7, color: new THREE.Color('#FF8000') },
    { level: 8, color: new THREE.Color('#FF4000') },
    { level: 9, color: new THREE.Color('#FF2000') },
    { level: 10, color: new THREE.Color('#FF0000') },
  ];
  const NO_PAIN_COLOR = new THREE.Color('#9ca3af');
  const EDIT_MODE_COLOR = new THREE.Color('#60a5fa');

  const LOAD_TIMEOUT_MS = 8000;

  let isModelLoaded = $state(false);
  let loadError = $state(false);
  let initialVisibilityFactor = $state(0);
  let fadeInTimer: ReturnType<typeof setTimeout> | null = null;
  let loadTimeoutTimer: ReturnType<typeof setTimeout> | null = null;

  // Start load timeout whenever modelUrl changes
  $effect(() => {
    if (loadTimeoutTimer) {
      clearTimeout(loadTimeoutTimer);
      loadTimeoutTimer = null;
    }
    if (modelUrl && !isModelLoaded && !loadError) {
      loadTimeoutTimer = setTimeout(() => {
        if (!isModelLoaded) {
          loadError = true;
        }
      }, LOAD_TIMEOUT_MS);
    }
    return () => {
      if (loadTimeoutTimer) clearTimeout(loadTimeoutTimer);
    };
  });

  // Default startup camera — centers on upper abdomen / lower torso area
  // Derived from the "Upper Abdomen" mapping: position [0, -0.56, 0.13], azimuth 0, polar π/2, distance 1.1
  const STARTUP_CAMERA_POSITION: [number, number, number] = [0, -0.56, 1.23];
  const STARTUP_CAMERA_TARGET: [number, number, number] = [0, -0.56, 0.13];

  // Camera animation state for coordinating with OrbitControls
  let isCameraAnimating = $state(false);
  let controlsTarget = $state<[number, number, number]>(STARTUP_CAMERA_TARGET);

  function handleAnimatingChange(animating: boolean, target?: [number, number, number]) {
    isCameraAnimating = animating;
    if (!animating && target) {
      controlsTarget = target;
    }
  }

  // In editMode, sync OrbitControls target ONLY when placement changes
  // (not on every slider drag — that makes the camera follow the sphere, hiding movement)
  let lastPlacementKey = '';
  $effect(() => {
    const key = `${selectedCategory}_${currentPlacement}`;
    if (editMode && spherePosition && key !== lastPlacementKey) {
      lastPlacementKey = key;
      controlsTarget = [...spherePosition];
    }
  });

  // --- Initial visibility fade-in (ported from tattoo-tide) ---
  $effect(() => {
    if (fadeInTimer) {
      clearTimeout(fadeInTimer);
      fadeInTimer = null;
    }
    if (isModelLoaded) {
      initialVisibilityFactor = 0;
      fadeInTimer = setTimeout(() => {
        initialVisibilityFactor = 1;
      }, INITIAL_VISIBILITY_DELAY_MS);
    } else {
      initialVisibilityFactor = 0;
    }
    return () => {
      if (fadeInTimer) clearTimeout(fadeInTimer);
    };
  });

  // --- Pain-level highlight color (ported from tattoo-tide usePainHighlightStyle) ---
  let highlightColor = $derived.by(() => {
    if (editMode) return EDIT_MODE_COLOR;
    const painLevel = (mapping as { placementPainInfo?: { level?: number } })?.placementPainInfo?.level;
    if (typeof painLevel !== 'number' || !isFinite(painLevel) || painLevel <= 0) {
      return NO_PAIN_COLOR;
    }
    for (const stop of PAIN_COLORS) {
      if (painLevel <= stop.level) return stop.color;
    }
    return PAIN_COLORS[PAIN_COLORS.length - 1].color;
  });

  let highlightOpacity = $derived.by(() => {
    const baseOpacity = editMode ? 0.6 : 0.73;
    return baseOpacity * initialVisibilityFactor;
  });

  // --- Target scale (ported from tattoo-tide getTargetScaleBase) ---
  let targetScale = $derived.by(() => {
    const mappingScale =
      typeof mapping?.scale === 'number' && isFinite(mapping.scale) && mapping.scale > 0
        ? mapping.scale
        : 0;

    if (typeof size === 'number' && isFinite(size) && size > 0) {
      const calculated = SQUARE_INCHES_TO_SCALE_FACTOR * Math.sqrt(size);
      return Math.max(MIN_TARGET_SCALE, calculated);
    } else if (size === 0 && !editMode) {
      // Pulsating base scale
      return Math.max(MIN_TARGET_SCALE, mappingScale > 0 ? mappingScale : MIN_ANIMATION_BASE_SCALE);
    } else {
      const defaultScale = editMode ? 1 : 0;
      const effective = mappingScale > 0 ? mappingScale : defaultScale;
      return Math.max(effective > 0 ? MIN_TARGET_SCALE : 0, effective);
    }
  });

  // Whether to enable pulsating animation (size === 0 in view mode)
  let shouldPulsate = $derived(size === 0 && !editMode && isModelLoaded);

  // Sphere position from mapping
  let spherePosition = $derived<[number, number, number]>(
    mapping?.position && Array.isArray(mapping.position) && mapping.position.length === 3
      ? (mapping.position as [number, number, number])
      : [0, 0, 0]
  );

  function handleModelLoad(model: THREE.Group) {
    if (loadTimeoutTimer) {
      clearTimeout(loadTimeoutTimer);
      loadTimeoutTimer = null;
    }
    loadError = false;
    isModelLoaded = true;
  }

  function handleModelError(error: unknown) {
    if (loadTimeoutTimer) {
      clearTimeout(loadTimeoutTimer);
      loadTimeoutTimer = null;
    }
    loadError = true;
  }

  // Cleanup on unmount
  onDestroy(() => {
    if (fadeInTimer) clearTimeout(fadeInTimer);
    if (loadTimeoutTimer) clearTimeout(loadTimeoutTimer);
    // Dispose pain color THREE.Color instances
    // (THREE.Color has no dispose, but clearing references helps GC)
    isModelLoaded = false;
  });
</script>

{#if modelUrl && !loadError}
  <SceneSetup {editMode} isAnimating={isCameraAnimating} {controlsTarget} cameraPosition={STARTUP_CAMERA_POSITION} {cameraFov} {isContainerResizing} {onCameraChange}>
    <HumanModel {modelUrl} {isColor} onLoad={handleModelLoad} onError={handleModelError} />

    <!-- Camera animation (ported from tattoo-tide useCameraAnimation) -->
    <CameraAnimator
      {mapping}
      {editMode}
      {isModelLoaded}
      onAnimatingChange={handleAnimatingChange}
    />

    {#if isModelLoaded && mapping}
      <HighlightSphere
        {highlightColor}
        {highlightOpacity}
        {targetScale}
        position={spherePosition}
        debugTextPosition={editMode ? spherePosition : null}
        debugTextScale={mapping.scale}
        {editMode}
        {shouldPulsate}
      />
    {/if}
  </SceneSetup>
{:else if modelUrl && loadError}
  <div
    style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #1f2937; border-radius: 8px; color: #9ca3af; font-size: 14px;"
  >
    3D Preview unavailable
  </div>
{/if}
