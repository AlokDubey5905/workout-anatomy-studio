
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Html,
} from "@react-three/drei";
import SegmentedAnatomy from "./SegmentedAnatomy";

type Props = {
    highlightedMuscles: string[];
};

export default function AnatomyViewer({
    highlightedMuscles,
}: Props) {
    return (
        <Canvas
            shadows
            camera={{
                position: [0, 1.5, 5.5],
                fov: 38,
            }}
        >
            <color
                attach="background"
                args={["#171e29"]}
            />

            <ambientLight intensity={1.1} />

            <directionalLight
                position={[4, 6, 5]}
                intensity={2}
                castShadow
            />

            <directionalLight
                position={[-4, 2, -3]}
                intensity={0.8}
            />

            <Suspense
                fallback={
                    <Html center>
                        Loading anatomical model...
                    </Html>
                }
            >
                <SegmentedAnatomy
                    highlightedMuscles={highlightedMuscles}
                />
            </Suspense>

            <gridHelper
                args={[8, 16, "#394454", "#27313e"]}
                position={[0, 0, 0]}
            />

            <OrbitControls
                target={[0, 1.4, 0]}
                enableDamping
                dampingFactor={0.05}
                minDistance={2.5}
                maxDistance={8}
                minPolarAngle={0.3}
                maxPolarAngle={Math.PI - 0.3}
            />
        </Canvas>
    );
}
