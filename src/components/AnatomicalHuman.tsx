
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

export default function AnatomicalHuman() {
  const { scene, animations } = useGLTF(
    "/models/muscular-human-idle.glb"
  );

  // Clone the cached GLB without modifying the original scene
  const normalized = useMemo(() => {
    const model = clone(scene);

    model.traverse((object) => {
      if (
        object instanceof THREE.Mesh &&
        object.name.toLowerCase().includes("eye") &&
        !(object instanceof THREE.SkinnedMesh)
      ) {
        object.visible = false;
      }
    });

    model.updateMatrixWorld(true);

    // Calculate dimensions only once for this clone
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const targetHeight = 4.5;
    const scale = size.y > 0 ? targetHeight / size.y : 1;

    // Centre horizontally and align feet with y = 0
    const position: [number, number, number] = [
      -center.x * scale,
      -box.min.y * scale,
      -center.z * scale,
    ];

    console.log("MODEL NORMALIZATION:", {
      originalHeight: size.y,
      scale,
      targetHeight,
    });

    return {
      model,
      scale,
      position,
    };
  }, [scene]);

  const { actions } = useAnimations(
    animations,
    normalized.model
  );

  const longestClip = useMemo(() => {
    if (!animations.length) return null;

    return animations.reduce((best, clip) =>
      clip.duration > best.duration ? clip : best
    );
  }, [animations]);

  useEffect(() => {
    if (!longestClip) {
      console.error("No animation clips found");
      return;
    }

    const action = actions[longestClip.name];

    if (!action) {
      console.error(
        "Animation action unavailable:",
        longestClip.name
      );
      return;
    }

    action.reset();
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.play();

    console.log("Playing animation:", {
      name: longestClip.name,
      duration: longestClip.duration,
    });

    return () => {
      action.stop();
    };
  }, [actions, longestClip]);

  return (
    <group
      position={normalized.position}
      scale={normalized.scale}
    >
      <primitive object={normalized.model} />
    </group>
  );
}

useGLTF.preload("/models/muscular-human-idle.glb");
