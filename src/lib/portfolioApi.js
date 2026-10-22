const apiOrigin = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

export function apiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiOrigin}${normalizedPath}`;
}

export function apiAssetUrl(path) {
  if (typeof path !== 'string' || !path.startsWith('/uploads/')) return path;
  return apiUrl(path);
}

export function normalizeProject(project) {
  return {
    ...project,
    id: project.id ?? project.ID,
    image: project.image ?? project.image_url,
    category: project.category ?? project.tech_stack ?? '',
    year: String(project.year ?? (project.created_at ? new Date(project.created_at).getFullYear() : '')),
    link: project.link ?? '',
    textSide: project.textSide ?? project.text_side ?? 'left',
    sortOrder: project.sortOrder ?? project.sort_order ?? 0
  };
}

export function normalizeProjects(response) {
  const projects = Array.isArray(response) ? response : response?.data;
  if (!Array.isArray(projects)) {
    throw new Error('Format daftar proyek dari API tidak valid.');
  }
  return projects.map(normalizeProject);
}

export function toApiProject(project) {
  return {
    title: project.title,
    category: project.category,
    tech_stack: project.category,
    year: project.year,
    description: project.description,
    image_url: project.image,
    link: project.link,
    text_side: project.textSide
  };
}
