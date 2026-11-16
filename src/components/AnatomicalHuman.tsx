
import { useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { LoopRepeat } from "three";

export default function AnatomicalHuman() {
  const { scene, animations } = useGLTF(
    "/models/muscular-human-idle.glb"
  );

  const { actions, names } = useAnimations(
    animations,
    scene
  );

  useEffect(() => {
    console.log("Available animations:", names);

    if (names.length === 0) {
      console.error("No animations found in GLB");
      return;
    }

    const action = actions[names[0]];

    if (!action) {
      console.error("Animation action unavailable");
      return;
    }

    action.reset();
    action.setLoop(LoopRepeat, Infinity);
    action.play();

    console.log("Playing:", names[0]);

    return () => {
      action.stop();
    };
  }, [actions, names]);

  return (
    <primitive
      object={scene}
      position={[0, 0, 0]}
    />
  );
}

useGLTF.preload(
  "/models/muscular-human-idle.glb"
);
