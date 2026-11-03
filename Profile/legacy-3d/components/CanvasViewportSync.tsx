import { useThree } from '@react-three/fiber';
import { useLayoutEffect, useEffect } from 'react';
import * as THREE from 'three';

/**
 * Garante que pixel ratio, viewport e câmera perspectiva acompanham o container
 * após resize de janela, mudança de layout ou transições CSS — evita canvas esticado, desfocado ou com aspect incorreto.
 */
export default function CanvasViewportSync({ maxDpr = 2 }: { maxDpr?: number }) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    const w = Math.max(1, size.width);
    const h = Math.max(1, size.height);
    const dpr = Math.min(
      typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
      maxDpr
    );
    gl.setPixelRatio(dpr);
    gl.setSize(w, h, true);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  }, [gl, camera, size.width, size.height, maxDpr]);

  useEffect(() => {
    const parent = gl.domElement.parentElement;
    if (!parent) return;

    const bump = () => {
      requestAnimationFrame(() => invalidate());
    };

    const onWindowResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      gl.setPixelRatio(dpr);
      bump();
    };

    window.addEventListener('resize', onWindowResize);

    const ro = new ResizeObserver(() => bump());
    ro.observe(parent);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      ro.disconnect();
    };
  }, [gl, invalidate, maxDpr]);

  return null;
}
