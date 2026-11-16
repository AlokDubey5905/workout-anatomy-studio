
import { useState } from "react";
import AnatomyViewer from "./components/AnatomyViewer";
import "./App.css";

const exercises = [
    {
        id: "bicep",
        name: "Bicep Curl",
        description: "Elbow flexion exercise",
        primary: "Biceps Brachii",
        secondary: ["Brachialis", "Brachioradialis"],
        muscles: ["biceps", "forearms"],
        sets: 3,
        reps: 12,
    },
    {
        id: "squat",
        name: "Squat",
        description: "Lower body compound exercise",
        primary: "Quadriceps",
        secondary: ["Gluteus Maximus", "Hamstrings"],
        muscles: ["quads", "glutes", "hamstrings"],
        sets: 3,
        reps: 12,
    },
    {
        id: "pushup",
        name: "Push Up",
        description: "Upper body pushing exercise",
        primary: "Pectoralis Major",
        secondary: ["Triceps", "Anterior Deltoids"],
        muscles: ["chest", "triceps", "front-shoulders"],
        sets: 3,
        reps: 12,
    },
    {
        id: "shoulder",
        name: "Shoulder Press",
        description: "Overhead pressing exercise",
        primary: "Deltoids",
        secondary: ["Triceps Brachii", "Trapezius"],
        muscles: ["front-shoulders", "triceps", "traps"],
        sets: 3,
        reps: 10,
    },
];

function App() {
    const [selectedId, setSelectedId] = useState("bicep");

    const selectedExercise =
        exercises.find((exercise) => exercise.id === selectedId)!
        ;

    return (
        <main className="studio">

            <header className="header">
                <div>
                    <h1>WORKOUT ANATOMY STUDIO</h1>
                    <p>
                        3D Exercise & Muscle Visualization
                    </p>
                </div>

                <span className="version">
                    VERSION 0.5
                </span>
            </header>

            <section className="workspace">

                <aside className="sidebar">
                    <h3>EXERCISES</h3>

                    {exercises.map((exercise) => (
                        <button
                            key={exercise.id}
                            className={
                                "exercise " +
                                (selectedId === exercise.id
                                    ? "active"
                                    : "")
                            }
                            onClick={() =>
                                setSelectedId(exercise.id)
                            }
                        >
                            {exercise.name}
                        </button>
                    ))}
                </aside>

                <section className="viewer">
                    <div className="viewer-label">
                        3D MUSCULAR ANATOMY
                    </div>
                    <AnatomyViewer
                        highlightedMuscles={
                            selectedExercise.muscles
                        }
                    />
                </section>

                <aside className="info-panel">
                    <h3>ANATOMY DETAILS</h3>

                    <p>Selected Exercise</p>
                    <h2>{selectedExercise.name}</h2>

                    <hr />

                    <p>Exercise Description</p>
                    <h3>{selectedExercise.description}</h3>

                    <p>Primary Muscle</p>
                    <h3>{selectedExercise.primary}</h3>

                    <p>Secondary Muscles</p>

                    {selectedExercise.secondary.map(
                        (muscle) => (
                            <h3 key={muscle}>{muscle}</h3>
                        )
                    )}

                    <hr />

                    <p>Recommended Training</p>

                    <h3>
                        {selectedExercise.sets} Sets ×{" "}
                        {selectedExercise.reps} Reps
                    </h3>
                </aside>

            </section>

            <footer>
                <span>WORKOUT ANATOMY STUDIO</span>
                <span>3D ENGINE: THREE.JS</span>
            </footer>

        </main>
    );
}

export default App;
