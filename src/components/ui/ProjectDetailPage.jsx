import { apiAssetUrl } from '../../lib/portfolioApi.js';
import { motion } from 'framer-motion';
import { useLayoutEffect, useRef } from 'react';

export default function ProjectDetailPage({ project, isLoading, loadError, onRetry, onBackToPortfolio }) {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    pageRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [project?.id, project?.ID]);

  if (!project) {
    return (
      <motion.main
        ref={pageRef}
        className="project-page project-page-not-found"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <p role="status">
          {isLoading ? 'Memuat detail proyek...' : loadError ? 'Detail proyek belum dapat dimuat.' : 'Proyek tidak ditemukan.'}
        </p>
        {!isLoading && loadError && (
          <button type="button" onClick={onRetry}>Coba lagi</button>
        )}
        <button type="button" onClick={onBackToPortfolio}>Kembali ke portofolio</button>
      </motion.main>
    );
  }

  return (
    <motion.main
      ref={pageRef}
      className="project-page"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="project-page-header">
        <button type="button" className="project-page-back" onClick={onBackToPortfolio}>
          <span aria-hidden="true">←</span>
          Kembali ke portofolio
        </button>
        <span className="project-page-index">PROJECT / {project.year}</span>
      </header>

      <section className="project-page-content">
        <div className="project-page-meta">
          <span>{project.category || 'PORTFOLIO'}</span>
          <span>{project.year}</span>
        </div>
        <h1>{project.title}</h1>
        <p className="project-page-description">{project.description}</p>

        {project.image && (
          <figure className="project-page-image-frame">
            <img
              src={apiAssetUrl(project.image)}
              alt={`Gambar proyek ${project.title}`}
              fetchPriority="high"
              decoding="async"
            />
          </figure>
        )}

        <div className="project-page-actions">
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              Kunjungi proyek
              <span aria-hidden="true">↗</span>
            </a>
          )}
          <button type="button" onClick={onBackToPortfolio}>
            Lihat semua portofolio
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </motion.main>
  );
}
