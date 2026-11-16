
import AnatomyViewer from "./components/AnatomyViewer";
import "./App.css";

function App() {
  return (
    <main className="studio">

      <header className="header">
        <div>
          <h1>WORKOUT ANATOMY STUDIO</h1>
          <p>3D Exercise & Muscle Visualization</p>
        </div>

        <span className="version">VERSION 0.1</span>
      </header>

      <section className="workspace">

        <aside className="sidebar">
          <h3>EXERCISES</h3>

          <button className="exercise active">
            Bicep Curl
          </button>

          <button className="exercise">
            Squat
          </button>

          <button className="exercise">
            Push Up
          </button>

          <button className="exercise">
            Shoulder Press
          </button>
        </aside>

        <section className="viewer">
          <div className="viewer-label">
            3D HUMAN MODEL
          </div>

          <AnatomyViewer />
        </section>

        <aside className="info-panel">
          <h3>ANATOMY DETAILS</h3>

          <p>Selected Exercise</p>
          <h2>Bicep Curl</h2>

          <hr />

          <p>Primary Muscle</p>
          <h3>Biceps Brachii</h3>

          <p>Secondary Muscles</p>
          <h3>Brachialis</h3>
          <h3>Brachioradialis</h3>
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