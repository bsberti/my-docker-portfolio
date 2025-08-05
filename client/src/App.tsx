import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProjectList from "./pages/ProjectList";
import AdminPage from "./pages/AdminPage";

const App: React.FC = () => {
  return (
    <Router>
      <header style={{ background: "#282c34", padding: "1rem", color: "#fff" }}>
        <h2>My Portfolio</h2>
        <nav>
          <Link to="/" style={{ marginRight: "1rem", color: "#61dafb" }}>Projects</Link>
          <Link to="/admin" style={{ color: "#61dafb" }}>Admin</Link>
        </nav>
      </header>
      <main style={{ padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<ProjectList />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
