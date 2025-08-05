import React, { useEffect, useState } from "react";

// Define o tipo do projeto esperado
type Project = {
  name: string;
  tech: string[];
};

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/projects`)
      .then((res) => res.json())
      .then((data: Project[]) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Unable to find project on error:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando projetos...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Projects</h1>
      {projects.length === 0 ? (
        <p>No projects.</p>
      ) : (
        <ul>
          {projects.map((project, index) => (
            <li key={index}>
              <strong>{project.name}</strong>
              <br />
              <small>Technologies: {project.tech.join(", ")}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectList;
