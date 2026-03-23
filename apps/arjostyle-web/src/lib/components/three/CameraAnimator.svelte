<script lang="ts">
  import { useThrelte, useTask } from '@threlte/core';
  import * as THREE from 'three';
  import type { BodyPartMappingData } from '$types/mapping';

  interface Props {
    mapping: BodyPartMappingData | null | undefined;
    editMode?: boolean;
    isModelLoaded?: boolean;
    onAnimatingChange?: (animating: boolean, target?: [number, number, number]) => void;
  }

  let {
    mapping = null,
    editMode = false,
    isModelLoaded = false,
    onAnimatingChange,
  }: Props = $props();

  const { camera } = useThrelte();

  // --- Constants (ported from tattoo-tide useCameraAnimation) ---
  const ANIMATION_DURATION_S = 1.0; // 1000ms in seconds
  const MIN_CAMERA_DISTANCE = 0.5;
  const DEFAULT_CAMERA_DISTANCE = 1.5;

  // --- Easing: easeOutQuartic ---
  function easeOutQuart(t: number): number {
    return 1 - Math.pow(1 - t, 4);
  }

  // --- Calculate target camera position from mapping spherical coords ---
  function calculateTargetCameraPosition(
    targetPoint: THREE.Vector3,
    m: BodyPartMappingData | null | undefined
  ): THREE.Vector3 {
    const fallback = new THREE.Vector3(targetPoint.x, targetPoint.y + 0.5, targetPoint.z + DEFAULT_CAMERA_DISTANCE);
    if (!m) return fallback;

    const { cameraAzimuth, cameraPolar, cameraDistance } = m;
    const safeAzimuth = typeof cameraAzimuth === 'number' && isFinite(cameraAzimuth) ? cameraAzimuth : 0;
    const safePolar = typeof cameraPolar === 'number' && isFinite(cameraPolar)
      ? Math.max(0.01, Math.min(Math.PI - 0.01, cameraPolar))
      : Math.PI / 2;
    const safeDistance = typeof cameraDistance === 'number' && isFinite(cameraDistance) && cameraDistance >= MIN_CAMERA_DISTANCE
      ? cameraDistance
      : DEFAULT_CAMERA_DISTANCE;

    const offsetX = safeDistance * Math.sin(safePolar) * Math.sin(safeAzimuth);
    const offsetY = safeDistance * Math.cos(safePolar);
    const offsetZ = safeDistance * Math.sin(safePolar) * Math.cos(safeAzimuth);

    const result = new THREE.Vector3(
      targetPoint.x + offsetX,
      targetPoint.y + offsetY,
      targetPoint.z + offsetZ
    );

    if (!isFinite(result.x) || !isFinite(result.y) || !isFinite(result.z)) return fallback;
    return result;
  }

  // --- Animation state ---
  let isAnimating = $state(false);
  let animationElapsed = 0;
  let startCameraPos = new THREE.Vector3();
  let startTargetPos = new THREE.Vector3();
  let endCameraPos = new THREE.Vector3();
  let endTargetPos = new THREE.Vector3();

  // Track previous mapping to detect actual changes
  let prevMappingKey = '';

  function getMappingKey(m: BodyPartMappingData | null | undefined): string {
    if (!m) return '';
    const pos = m.position;
    if (!pos || !Array.isArray(pos) || pos.length !== 3 || !pos.every(n => typeof n === 'number' && isFinite(n))) {
      return '';
    }
    return `${pos[0].toFixed(4)}_${pos[1].toFixed(4)}_${pos[2].toFixed(4)}_${(m.cameraAzimuth ?? 0).toFixed(4)}_${(m.cameraPolar ?? 0).toFixed(4)}_${(m.cameraDistance ?? 0).toFixed(4)}`;
  }

  $effect(() => {
    if (!isModelLoaded || !mapping) {
      if (isAnimating) {
        isAnimating = false;
        onAnimatingChange?.(false);
      }
      return;
    }

    const pos = mapping.position;
    if (!pos || !Array.isArray(pos) || pos.length !== 3 || !pos.every(n => typeof n === 'number' && isFinite(n))) {
      return;
    }

    const key = getMappingKey(mapping);
    if (key === prevMappingKey) return;
    prevMappingKey = key;

    const targetPoint = new THREE.Vector3(...pos);
    const targetCamPos = calculateTargetCameraPosition(targetPoint, mapping);

    const cam = camera.current;
    if (!cam) return;

    if (editMode) {
      // Edit mode: snap immediately
      cam.position.copy(targetCamPos);
      cam.lookAt(targetPoint);
      isAnimating = false;
      onAnimatingChange?.(false, [targetPoint.x, targetPoint.y, targetPoint.z]);
    } else {
      // View mode: start animation
      startCameraPos.copy(cam.position);
      // Approximate current look-at target from camera direction
      const currentDir = new THREE.Vector3();
      cam.getWorldDirection(currentDir);
      startTargetPos.copy(cam.position).add(currentDir.multiplyScalar(2));

      endCameraPos.copy(targetCamPos);
      endTargetPos.copy(targetPoint);
      animationElapsed = 0;
      isAnimating = true;
      onAnimatingChange?.(true);
    }
  });

  // Per-frame animation loop
  useTask((delta) => {
    if (!isAnimating) return;

    const cam = camera.current;
    if (!cam) {
      isAnimating = false;
      onAnimatingChange?.(false);
      return;
    }

    animationElapsed += delta;
    const progress = Math.min(animationElapsed / ANIMATION_DURATION_S, 1.0);
    const t = easeOutQuart(progress);

    // Interpolate camera position
    const newCamPos = new THREE.Vector3().lerpVectors(startCameraPos, endCameraPos, t);
    const newTarget = new THREE.Vector3().lerpVectors(startTargetPos, endTargetPos, t);

    cam.position.copy(newCamPos);
    cam.lookAt(newTarget);

    // Check completion
    if (progress >= 1.0) {
      cam.position.copy(endCameraPos);
      cam.lookAt(endTargetPos);
      isAnimating = false;
      // Notify parent with the final target so OrbitControls can sync
      onAnimatingChange?.(false, [endTargetPos.x, endTargetPos.y, endTargetPos.z]);
    }
  });
</script>
