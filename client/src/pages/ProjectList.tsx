import React, { useEffect, useState } from "react";
import "./ProjectList.css";

type Project = {
  name: string;
  year?: number;
  tech: string[];
  image1?: string;
  image2?: string;
  image3?: string;
};

const buildImageUrl = (filename: string) => {
  return `${process.env.REACT_APP_API_URL}/uploads/${filename}`;
};

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estado para guardar a imagem selecionada para cada projeto
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/projects`)
      .then((res) => res.json())
      .then((data: Project[]) => {
        setProjects(data);
        setLoading(false);
        // Inicializa todas as imagens selecionadas como a primeira (índice 0)
        setSelectedImages(new Array(data.length).fill(0));
      })
      .catch((error) => {
        console.error("Unable to fetch projects:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading projects...</p>;

  return (
    <div className="project-list-container">
      {projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        <div className="project-grid">
          {projects.map((project, index) => {
            // Array com imagens disponíveis para o projeto, filtrando undefined
            const images = [project.image1, project.image2, project.image3].filter(Boolean) as string[];

            // Índice da imagem selecionada atualmente
            const selectedIndex = selectedImages[index] ?? 0;

            return (
              <div key={index} className="project-card">
                <div className="project-header">
                  <h2>{project.name}</h2>
                  {project.year && <span className="project-year">{project.year}</span>}
                </div>

                {images.length > 0 && (
                  <img
                    src={buildImageUrl(images[selectedIndex])}
                    alt={`${project.name} main`}
                    className="project-main-image"
                  />
                )}

                <div className="project-thumbnails">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={buildImageUrl(img)}
                      alt={`${project.name} img ${idx + 1}`}
                      className={`project-thumbnail ${idx === selectedIndex ? "selected" : ""}`}
                      onClick={() => {
                        // Atualiza a imagem selecionada para este projeto
                        const newSelected = [...selectedImages];
                        newSelected[index] = idx;
                        setSelectedImages(newSelected);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </div>

                <div className="project-tech">
                  <strong>Technologies:</strong> {project.tech.join(", ")}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
