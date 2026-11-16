
import { useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/muscle-anatomy/male.glb";
const MANIFEST_URL = "/models/muscle-anatomy/manifest.json";

type ManifestRegion = {
    id: string;
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

function belongsToRegion(
    mesh: THREE.Mesh,
    expectedNames: Set<string>
): boolean {
    let node: THREE.Object3D | null = mesh;

    while (node) {
        for (const expected of expectedNames) {
            if (
                node.name === expected ||
                node.name.startsWith(`${expected}-geometry`) ||
                node.name.startsWith(`${expected}_`)
            ) {
                return true;
            }
        }

        node = node.parent;
    }

    return false;
}

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

    const model = useMemo(() => {
        const clonedScene = scene.clone(true);

        clonedScene.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return;

            const cloneMaterial = (material: THREE.Material) => {
                const cloned = material.clone();

                if (cloned instanceof THREE.MeshStandardMaterial) {
                    cloned.userData.baseEmissive =
                        cloned.emissive.clone();

                    cloned.userData.baseEmissiveIntensity =
                        cloned.emissiveIntensity;
                }

                return cloned;
            };

            object.material = Array.isArray(object.material)
                ? object.material.map(cloneMaterial)
                : cloneMaterial(object.material);

            object.castShadow = true;
            object.receiveShadow = true;
        });

        return clonedScene;
    }, [scene]);

    // Map manifest regions to actual meshes using their full hierarchy.
    const regionMeshes = useMemo(() => {
        const result = new Map<string, THREE.Mesh[]>();

        for (const region of manifest.regions) {
            const expectedNames = new Set(region.meshNames);
            const meshes: THREE.Mesh[] = [];

            model.traverse((object) => {
                if (
                    object instanceof THREE.Mesh &&
                    belongsToRegion(object, expectedNames)
                ) {
                    meshes.push(object);
                }
            });

            result.set(region.id, meshes);
        }

        return result;
    }, [model, manifest]);

    // Highlight selected muscle groups.
    useEffect(() => {
        const selectedGroups = new Set(highlightedMuscles);

        for (const region of manifest.regions) {
            const meshes = regionMeshes.get(region.id) ?? [];
            const highlighted = selectedGroups.has(region.muscle);

            for (const mesh of meshes) {
                const materials = Array.isArray(mesh.material)
                    ? mesh.material
                    : [mesh.material];

                for (const material of materials) {
                    if (
                        !(material instanceof THREE.MeshStandardMaterial)
                    ) {
                        continue;
                    }

                    const originalEmissive =
                        material.userData.baseEmissive as
                            | THREE.Color
                            | undefined;

                    const originalIntensity =
                        material.userData.baseEmissiveIntensity as
                            | number
                            | undefined;

                    if (highlighted) {
                        material.emissive.set("#ff2525");
                        material.emissiveIntensity = 0.75;
                    } else {
                        if (originalEmissive) {
                            material.emissive.copy(originalEmissive);
                        }

                        material.emissiveIntensity =
                            originalIntensity ?? 0;
                    }
                }
            }
        }
    }, [manifest, regionMeshes, highlightedMuscles]);

    // Verify mapping coverage.
    useEffect(() => {
        const resolved = manifest.regions.filter(
            (region) =>
                (regionMeshes.get(region.id)?.length ?? 0) > 0
        );

        const unresolved = manifest.regions.filter(
            (region) =>
                (regionMeshes.get(region.id)?.length ?? 0) === 0
        );

        console.info("[Anatomy mapping]", {
            totalRegions: manifest.regions.length,
            resolvedRegions: resolved.length,
            unresolvedRegions: unresolved.length,
            unresolved: unresolved.map(
                (region) => `${region.label} (${region.side})`
            ),
        });
    }, [manifest, regionMeshes]);

    return <primitive object={model} />;
}

useGLTF.preload(MODEL_URL);
