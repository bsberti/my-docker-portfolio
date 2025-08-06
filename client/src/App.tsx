import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import ProjectList from "./pages/ProjectList";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import PrivateRoute from "./routes/PrivateRoute";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Detecta login pelo token no localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      window.location.href = "/"; // Redireciona para home
    };

  return (
    <Router>
      <header style={{ background: "#282c34", padding: "1rem", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>My Portfolio</h2>
        <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link to="/" style={{ color: "#61dafb" }}>Projects</Link>
          <Link to="/admin" style={{ color: "#61dafb" }}>Admin</Link>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              style={{ background: "transparent", border: "none", color: "#ff6b6b", cursor: "pointer" }}
            >
              Logout
            </button>
          ) : (
            <Link to="/auth" style={{ color: "#61dafb" }}>Login</Link>
          )}
        </nav>
      </header>
      
      <main style={{ padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<ProjectList />} />
          <Route path="/auth" element={<AuthPage onLogin={() => setIsLoggedIn(true)} />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
