import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const MODEL_URLS = [
  '/darth_vader_helmet.glb',
  '/lightsaber_red.glb',
  '/3d_t.i.e_fighter_-_star_wars_model.glb',
  '/death_star_-_star_wars.glb',
  '/r2d2.glb',
  '/star_destroyer.glb',
];

interface LoadState {
  progress: number;
  loaded: boolean;
}

const gltfCache = new Map<string, THREE.Group>();

export default function useAssetLoader(): LoadState {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const manager = new THREE.LoadingManager();

    manager.onProgress = (_url, itemsLoaded, itemsTotal) => {
      setProgress(Math.round((itemsLoaded / itemsTotal) * 100));
    };

    manager.onLoad = () => {
      setProgress(100);
      setLoaded(true);
    };

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

    const gltfLoader = new GLTFLoader(manager);
    gltfLoader.setDRACOLoader(dracoLoader);

    const promises = MODEL_URLS.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          if (gltfCache.has(url)) {
            resolve();
            return;
          }
          gltfLoader.load(
            url,
            (gltf) => {
              gltfCache.set(url, gltf.scene);
              resolve();
            },
            undefined,
            reject
          );
        })
    );

    try {
      await Promise.all(promises);
    } catch (err) {
      console.error('Asset loading error:', err);
      setProgress(100);
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { progress, loaded };
}
