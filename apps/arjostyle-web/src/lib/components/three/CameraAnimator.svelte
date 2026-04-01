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
  // Pre-allocated result vector — caller must .copy() if needed long-term
  const _calcResult = new THREE.Vector3();
  function calculateTargetCameraPosition(
    targetPoint: THREE.Vector3,
    m: BodyPartMappingData | null | undefined
  ): THREE.Vector3 {
    if (!m) {
      return _calcResult.set(targetPoint.x, targetPoint.y, targetPoint.z + DEFAULT_CAMERA_DISTANCE);
    }

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

    _calcResult.set(
      targetPoint.x + offsetX,
      targetPoint.y + offsetY,
      targetPoint.z + offsetZ
    );

    if (!isFinite(_calcResult.x) || !isFinite(_calcResult.y) || !isFinite(_calcResult.z)) {
      return _calcResult.set(targetPoint.x, targetPoint.y, targetPoint.z + DEFAULT_CAMERA_DISTANCE);
    }
    return _calcResult;
  }

  // --- Animation state (pre-allocated vectors to avoid GC pressure during animation) ---
  let isAnimating = $state(false);
  let animationElapsed = 0;
  let startCameraPos = new THREE.Vector3();
  let startTargetPos = new THREE.Vector3();
  let endCameraPos = new THREE.Vector3();
  let endTargetPos = new THREE.Vector3();
  // Reusable scratch vectors — NEVER allocate in hot loops
  const _scratchVec = new THREE.Vector3();
  const _scratchCamPos = new THREE.Vector3();
  const _scratchTarget = new THREE.Vector3();

  // Track previous mapping to detect actual changes
  let prevMappingKey = '';

  /** Key for camera animation — only includes fields that affect camera placement */
  function getCameraKey(m: BodyPartMappingData | null | undefined): string {
    if (!m) return '';
    const pos = m.position;
    if (!pos || !Array.isArray(pos) || pos.length !== 3 || !pos.every(n => typeof n === 'number' && isFinite(n))) {
      return '';
    }
    return `${pos[0].toFixed(4)}_${pos[1].toFixed(4)}_${pos[2].toFixed(4)}_${(m.cameraAzimuth ?? 0).toFixed(4)}_${(m.cameraPolar ?? 0).toFixed(4)}_${(m.cameraDistance ?? 0).toFixed(4)}`;
  }

  /** Key for edit-mode camera — only camera angles/distance, NOT position/scale.
   *  Position changes should move the sphere without re-snapping the camera. */
  function getEditCameraKey(m: BodyPartMappingData | null | undefined): string {
    if (!m) return '';
    return `${(m.cameraAzimuth ?? 0).toFixed(4)}_${(m.cameraPolar ?? 0).toFixed(4)}_${(m.cameraDistance ?? 0).toFixed(4)}`;
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

    // In editMode, only re-snap camera when camera fields change (azimuth/polar/distance),
    // not when position/scale sliders move — those should only move the sphere.
    const key = editMode ? getEditCameraKey(mapping) : getCameraKey(mapping);
    if (key === prevMappingKey) return;
    prevMappingKey = key;

    _scratchVec.set(pos[0], pos[1], pos[2]); // reuse instead of new Vector3
    const targetCamPos = calculateTargetCameraPosition(_scratchVec, mapping);

    const cam = camera.current;
    if (!cam) return;

    if (editMode) {
      // Edit mode: snap immediately
      cam.position.copy(targetCamPos);
      cam.lookAt(_scratchVec);
      isAnimating = false;
      onAnimatingChange?.(false, [_scratchVec.x, _scratchVec.y, _scratchVec.z]);
    } else {
      // View mode: start animation
      startCameraPos.copy(cam.position);
      // Approximate current look-at target from camera direction (reuse scratch)
      cam.getWorldDirection(_scratchTarget);
      startTargetPos.copy(cam.position).add(_scratchTarget.multiplyScalar(2));

      endCameraPos.copy(targetCamPos);
      endTargetPos.copy(_scratchVec);
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

    // Interpolate camera position (zero allocations — reuse scratch vectors)
    _scratchCamPos.lerpVectors(startCameraPos, endCameraPos, t);
    _scratchTarget.lerpVectors(startTargetPos, endTargetPos, t);

    cam.position.copy(_scratchCamPos);
    cam.lookAt(_scratchTarget);

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
