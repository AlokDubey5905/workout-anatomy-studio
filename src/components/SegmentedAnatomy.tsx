
import { useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/muscle-anatomy/male.glb";
const MANIFEST_URL = "/models/muscle-anatomy/manifest.json";

type ManifestRegion = {
    muscle: string;
    label: string;
    side: string;
    meshNames: string[];
};

type MuscleManifest = {
    regions: ManifestRegion[];
};

type Props = {
    highlightedMuscles: string[];
};

export default function SegmentedAnatomy({
    highlightedMuscles,
}: Props) {
    const { scene } = useGLTF(MODEL_URL);

    const manifestText = useLoader(
        THREE.FileLoader,
        MANIFEST_URL
    ) as string;

    const manifest = useMemo(
        () => JSON.parse(manifestText) as MuscleManifest,
        [manifestText]
    );

    // Clone the scene and materials so highlighting
    // does not modify the cached original GLB.
    const model = useMemo(() => {
        const clonedScene = scene.clone(true);

        clonedScene.traverse((object) => {
            const mesh = object as THREE.Mesh;

            if (!mesh.isMesh) return;

            const cloneMaterial = (
                material: THREE.Material
            ) => {
                const cloned = material.clone();

                if (
                    cloned instanceof THREE.MeshStandardMaterial
                ) {
                    cloned.userData.baseEmissive =
                        cloned.emissive.clone();

                    cloned.userData.baseEmissiveIntensity =
                        cloned.emissiveIntensity;
                }

                return cloned;
            };

            mesh.material = Array.isArray(mesh.material)
                ? mesh.material.map(cloneMaterial)
                : cloneMaterial(mesh.material);

            mesh.castShadow = true;
            mesh.receiveShadow = true;
        });

        return clonedScene;
    }, [scene]);

    // Check whether manifest mesh names match the GLB.

    useEffect(() => {
        const actualMeshes: {
            name: string;
            vertices: number;
            material: string;
        }[] = [];

        model.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                actualMeshes.push({
                    name: object.name,
                    vertices: object.geometry.attributes.position?.count ?? 0,
                    material: Array.isArray(object.material)
                        ? "Multiple"
                        : object.material.type,
                });
            }
        });

        const expectedNames = manifest.regions.flatMap(
            (region) => region.meshNames
        );

        const actualNames = new Set(
            actualMeshes.map((mesh) => mesh.name)
        );

        const matched = expectedNames.filter(
            (name) => actualNames.has(name)
        );

        const missing = expectedNames.filter(
            (name) => !actualNames.has(name)
        );

        console.log("========== GLB MESH INSPECTION ==========");
        console.table(actualMeshes);

        console.log("========== MANIFEST INSPECTION ==========");
        console.log({
            expectedMeshes: expectedNames.length,
            matchedMeshes: matched.length,
            missingMeshes: missing.length,
            matched,
            missing,
        });
    }, [model, manifest]);

    // Highlight selected muscle groups.
    useEffect(() => {
        const selectedMeshNames = new Set(
            manifest.regions
                .filter((region) =>
                    highlightedMuscles.includes(region.muscle)
                )
                .flatMap((region) => region.meshNames)
        );

        model.traverse((object) => {
            const mesh = object as THREE.Mesh;
            if (!mesh.isMesh) return;

            const materials = Array.isArray(mesh.material)
                ? mesh.material
                : [mesh.material];

            const isHighlighted = selectedMeshNames.has(
                mesh.name
            );

            materials.forEach((material) => {
                if (
                    !(material instanceof THREE.MeshStandardMaterial)
                ) {
                    return;
                }

                const originalEmissive =
                    material.userData.baseEmissive as
                    | THREE.Color
                    | undefined;

                const originalIntensity =
                    material.userData.baseEmissiveIntensity as
                    | number
                    | undefined;

                if (isHighlighted) {
                    material.emissive.set("#ff2525");
                    material.emissiveIntensity = 0.75;
                } else {
                    if (originalEmissive) {
                        material.emissive.copy(originalEmissive);
                    }

                    material.emissiveIntensity =
                        originalIntensity ?? 0;
                }
            });
        });
    }, [model, manifest, highlightedMuscles]);

    return (
        <primitive object={model} />
    );
}

useGLTF.preload(MODEL_URL);
