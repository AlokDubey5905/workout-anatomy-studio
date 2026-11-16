
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import AnatomicalHuman from "./AnatomicalHuman";

function MuscleLimb({
    position,
    radius,
    length,
}: {
    position: [number, number, number];
    radius: number;
    length: number;
}) {
    return (
        <mesh position={position}>
            <capsuleGeometry
                args={[radius, length, 8, 20]}
            />
            <meshStandardMaterial
                color="#d8a58e"
                roughness={0.65}
            />
        </mesh>
    );
}

function HumanPlaceholder() {
    return (
        <group position={[0, 0, 0]}>
            {/* Head */}
            <mesh position={[0, 1.78, 0]}>
                <sphereGeometry args={[0.23, 32, 32]} />
                <meshStandardMaterial color="#d8a58e" />
            </mesh>

            {/* Neck */}
            <mesh position={[0, 1.45, 0]}>
                <cylinderGeometry args={[0.10, 0.12, 0.22, 24]} />
                <meshStandardMaterial color="#d8a58e" />
            </mesh>

            {/* Chest / torso */}
            <mesh position={[0, 0.85, 0]}>
                <capsuleGeometry args={[0.35, 0.65, 8, 24]} />
                <meshStandardMaterial color="#d8a58e" />
            </mesh>

            {/* Pelvis */}
            <mesh position={[0, 0.20, 0]}>
                <sphereGeometry args={[0.34, 32, 24]} />
                <meshStandardMaterial color="#d8a58e" />
            </mesh>

            {/* Arms */}
            {[-1, 1].map((side) => (
                <group key={side}>
                    <MuscleLimb
                        position={[side * 0.49, 0.83, 0]}
                        radius={0.13}
                        length={0.48}
                    />

                    <mesh position={[side * 0.49, 0.53, 0]}>
                        <sphereGeometry args={[0.13, 20, 20]} />
                        <meshStandardMaterial color="#d8a58e" />
                    </mesh>

                    <MuscleLimb
                        position={[side * 0.49, 0.15, 0]}
                        radius={0.105}
                        length={0.50}
                    />

                    {/* Hands */}
                    <mesh position={[side * 0.49, -0.18, 0]}>
                        <sphereGeometry args={[0.11, 20, 20]} />
                        <meshStandardMaterial color="#d8a58e" />
                    </mesh>
                </group>
            ))}

            {/* Legs */}
            {[-1, 1].map((side) => (
                <group key={side}>
                    <MuscleLimb
                        position={[side * 0.19, -0.47, 0]}
                        radius={0.17}
                        length={0.58}
                    />

                    <mesh position={[side * 0.19, -0.80, 0]}>
                        <sphereGeometry args={[0.13, 20, 20]} />
                        <meshStandardMaterial color="#d8a58e" />
                    </mesh>

                    <MuscleLimb
                        position={[side * 0.19, -1.18, 0]}
                        radius={0.12}
                        length={0.55}
                    />

                    {/* Feet */}
                    <mesh position={[side * 0.19, -1.52, 0.08]}>
                        <boxGeometry args={[0.22, 0.13, 0.38]} />
                        <meshStandardMaterial color="#d8a58e" />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

export default function AnatomyViewer() {
    return (
        <Canvas
            camera={{
                position: [0, 0.5, 6],
                fov: 40,
            }}
        >
            <color attach="background" args={["#171e29"]} />

            <ambientLight intensity={1.2} />

            <directionalLight
                position={[4, 6, 5]}
                intensity={2}
            />

            <directionalLight
                position={[-4, 2, -3]}
                intensity={0.8}
            />

            <AnatomicalHuman  />

            <gridHelper
                args={[10, 10, "#394454", "#27313e"]}
                position={[0, -1.6, 0]}
            />

            <OrbitControls
                target={[0, 0, 0]}
                enableDamping
                minDistance={2}
                maxDistance={9}
            />
        </Canvas>
    );
}