import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

const MODEL_PATH = "/models/desk_set_10_mb.glb";

export function Computer(props: ThreeElements["group"]) {
  const { scene } = useGLTF(MODEL_PATH);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  // The source asset isn't authored around the origin, so recenter it on
  // X/Z and rest its lowest point on y = 0 rather than hardcoding offsets
  // that only matched the previous model.
  const offset = useMemo<[number, number, number]>(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    return [-center.x, -box.min.y, -center.z];
  }, [scene]);

  return (
    <group {...props} dispose={null}>
      <primitive object={scene} position={offset} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

export default Computer;
