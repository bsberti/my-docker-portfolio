import React from "react";
import ProjectList from "./pages/ProjectList";

const App: React.FC = () => {
  return (
    <div>
      <header style={{ background: "#282c34", padding: "1rem", color: "#fff" }}>
        <h2>Meu Portfólio</h2>
      </header>
      <main>
        <ProjectList />
      </main>
    </div>
  );
};

export default App;
