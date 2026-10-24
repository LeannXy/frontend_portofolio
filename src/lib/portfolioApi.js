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

export function sortProjectsByYearAndUpload(projects) {
  return [...projects].sort((a, b) => {
    const yearA = Number.parseInt(String(a.year ?? '').match(/\d{4}/)?.[0] ?? '', 10) || 0;
    const yearB = Number.parseInt(String(b.year ?? '').match(/\d{4}/)?.[0] ?? '', 10) || 0;
    if (yearA !== yearB) return yearB - yearA;

    const uploadedAtA = Date.parse(a.created_at ?? a.createdAt ?? '') || 0;
    const uploadedAtB = Date.parse(b.created_at ?? b.createdAt ?? '') || 0;
    if (uploadedAtA !== uploadedAtB) return uploadedAtB - uploadedAtA;

    return Number(a.id ?? a.ID ?? 0) - Number(b.id ?? b.ID ?? 0);
  });
}

export function normalizeProjects(response) {
  const projects = Array.isArray(response) ? response : response?.data;
  if (!Array.isArray(projects)) {
    throw new Error('Format daftar proyek dari API tidak valid.');
  }
  return sortProjectsByYearAndUpload(projects.map(normalizeProject));
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
