<script lang="ts">
  import { T } from '@threlte/core';
  import { useGltf } from '@threlte/extras';
  import * as THREE from 'three';

  interface Props {
    modelUrl: string;
    isColor?: boolean;
    onLoad?: (model: THREE.Group) => void;
    onError?: (error: unknown) => void;
  }

  let { modelUrl, isColor = true, onLoad, onError }: Props = $props();

  const gltf = useGltf(modelUrl);

  $effect(() => {
    if ($gltf) {
      const model = $gltf.scene;

      // Apply transforms matching the reference (tattoo-tide)
      model.scale.set(1, 1, 1);
      model.position.set(0, -1, 0);
      model.rotation.set(0, 0, 0);

      // Apply material treatment
      model.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat) => {
            // Enable double-sided rendering for model faces
            mat.side = THREE.DoubleSide;

            if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshBasicMaterial) {
              if (!isColor) {
                mat.color.setHex(0x888888);
              } else {
                mat.color.setHex(0xffffff);
              }
            }
            mat.needsUpdate = true;
          });
        }
      });
      onLoad?.(model);
    }
  });
</script>

{#if $gltf}
  <T is={$gltf.scene} />
{/if}
