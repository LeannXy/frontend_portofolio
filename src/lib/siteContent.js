export const DEFAULT_HISTORY = [
  {
    id: 0, year: '2023 - 2024', title: 'Full Stack Developer', company: 'Meedia',
    text: 'Joined Meedia as a Full Stack Developer, building scalable apps with React, Node.js, and MongoDB.',
    details: ['Mengembangkan arsitektur aplikasi web reaktif berskala besar', 'Optimalisasi pipeline integrasi API RESTful & MongoDB query', 'Penerapan sistem komponen desain monokrom berkecepatan 60 FPS'],
    techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'TailwindCSS'], ratio: 0.08, stemHeight: 64
  },
  {
    id: 1, year: '2024 - 2025', title: 'DevOps & Cloud Engineer', company: 'Core Infrastructure',
    text: 'Led projects with AWS and Docker, improved CI/CD pipelines, and mentored junior developers.',
    details: ['Orkestrasi kontainerisasi multi-layanan menggunakan Docker & AWS ECS', 'Peningkatan kecepatan deployment pipeline CI/CD hingga 3.2x lebih cepat', 'Mentorship teknis bagi 6+ junior developer dalam standar clean code'],
    techStack: ['AWS', 'Docker', 'CI/CD', 'TypeScript', 'Terraform'], ratio: 0.38, stemHeight: 64
  },
  {
    id: 2, year: '2025 - 2026', title: 'Senior Developer', company: 'Platform Engineering',
    text: 'Promoted to Senior Developer, focusing on microservices, database design, and open-source work.',
    details: ['Transisi arsitektur monolit ke ekosistem microservices modular', 'Perancangan skema database terdistribusi dengan konkurensi tinggi', 'Kontribusi aktif pada ekosistem open-source dan UI framework modern'],
    techStack: ['Microservices', 'PostgreSQL', 'Go', 'Redis', 'Kafka'], ratio: 0.70, stemHeight: 64
  },
  {
    id: 3, year: '2026 - 2027', title: 'Team Lead & Creative Architect', company: 'Innovation Lab',
    text: 'Became Team Lead, managing agile projects, scaling systems, and driving developer tools.',
    details: ['Memimpin visi teknis dan arsitektur produk interaktif berbasis WebGL 3D', 'Manajemen sprint agile lintas disiplin desain interaksi dan rekayasa kode', 'Pengembangan developer tooling internal yang memangkas waktu iterasi UI'],
    techStack: ['Team Leadership', 'Three.js', 'System Architecture', 'GSAP', 'Next.js'], ratio: 0.92, stemHeight: 64
  }
];

export const DEFAULT_TECHNOLOGIES = [
  { name: 'Laravel 13', category: 'backend', tag: 'Primary Framework', role: 'Backend Architecture', desc: 'Modern MVC architecture, Eloquent ORM, database migrations, secure authentication, and structured REST API development.' },
  { name: 'PHP', category: 'backend', tag: 'Core Language', role: 'Server-Side Programming', desc: 'Object-oriented programming (OOP), session management, modular code, and reliable backend logic.' },
  { name: 'Golang', category: 'backend', tag: 'High Concurrency', role: 'Systems & Microservices', desc: 'A high-performance compiled language featuring goroutines, strong typing, and efficient server workloads.' },
  { name: 'Postman', category: 'backend', tag: 'API Tooling', role: 'Contract & Endpoint Testing', desc: 'REST endpoint specification, automated JSON response testing, status-code debugging, and API documentation.' },
  { name: 'PostgreSQL', category: 'database', tag: 'Primary RDBMS', role: 'Enterprise Relational DB', desc: 'A robust relational database system for complex queries, ACID data integrity, and large-scale indexing.' },
  { name: 'MySQL', category: 'database', tag: 'Relational DB', role: 'Data Modeling & Queries', desc: 'Relational schema design, table normalization, foreign-key integrity, and high-performance query optimization.' },
  { name: 'phpMyAdmin', category: 'database', tag: 'DB Administration', role: 'Visual SQL Manager', desc: 'Visual database management, schema inspection, manual query execution, row editing, and schema import/export.' },
  { name: 'React.js', category: 'frontend', tag: 'Modern UI', role: 'Frontend Library', desc: 'Modular components, reactive state management, custom hooks, and single-page application (SPA) architecture.' },
  { name: 'JavaScript', category: 'frontend', tag: 'Core Web', role: 'Modern ESNext', desc: 'Dynamic DOM manipulation, asynchronous programming (async/await), precise event handling, and modern interactive logic.' },
  { name: 'Three.js / WebGL', category: 'frontend', tag: 'Portfolio Engine', role: '3D Spatial Graphics', desc: 'Interactive browser-based 3D graphics, spatial coordinate systems, PBR materials, and procedural rendering—powering this portfolio.' },
  { name: 'GSAP & ScrollTrigger', category: 'frontend', tag: 'Portfolio Engine', role: 'Timeline Motion Engine', desc: '60 FPS timeline orchestration, dynamic scroll scrubbing, pinned sections, and responsive motion interactions.' },
  { name: 'Framer Motion', category: 'frontend', tag: 'Portfolio Engine', role: 'Declarative Transitions', desc: 'Smooth page transitions, spring-based motion, micro-interaction gestures, and dynamic layouts.' },
  { name: 'Lenis', category: 'frontend', tag: 'Portfolio Engine', role: 'Smooth Scroll Core', desc: 'High-precision inertial scrolling synchronized with ScrollTrigger and browser navigation.' },
  { name: 'Figma', category: 'design', tag: 'UI/UX Design', role: 'Interface Architecture', desc: 'Wireframing, design systems, responsive auto layouts, balanced typography, and interface prototyping.' },
  { name: 'Canva', category: 'design', tag: 'Visual Assets', role: 'Creative Layout', desc: 'Rapid visual layout creation, supporting graphic assets, presentation branding, and modern visual materials.' },
  { name: 'Canva Affinity', category: 'design', tag: 'Vector Studio', role: 'Affinity Designer & Graphics', desc: 'Precise vector illustration, ultra-high-resolution graphic editing, and refined editorial typography.' }
];

export const DEFAULT_SOCIALS = {
  github: { label: 'GITHUB', hoverLabel: '@BILLEAN', url: '' },
  linkedin: { label: 'LINKEDIN', hoverLabel: 'CONNECT ↗', url: '' },
  tiktok: { label: 'TIKTOK', hoverLabel: '@LEANN_DEV', url: '' },
  instagram: { label: 'INSTAGRAM', hoverLabel: '@BILLEAN.UP', url: '' }
};

export const DEFAULT_SITE_CONTENT = {
  history: DEFAULT_HISTORY,
  technologies: DEFAULT_TECHNOLOGIES,
  socials: DEFAULT_SOCIALS,
  profileImage: '/profile.webp',
  contact: {
    email: 'billeanujiprakasa@gmail.com',
    githubRepo: 'https://github.com'
  }
};

export function normalizeSiteContent(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return DEFAULT_SITE_CONTENT;
  }

  return {
    history: Array.isArray(value.history) && value.history.length > 0 ? value.history : DEFAULT_HISTORY,
    technologies: Array.isArray(value.technologies) && value.technologies.length > 0
      ? value.technologies
      : DEFAULT_TECHNOLOGIES,
    socials: value.socials && typeof value.socials === 'object' && !Array.isArray(value.socials)
      ? Object.fromEntries(
        Object.entries(DEFAULT_SOCIALS).map(([platform, defaults]) => [
          platform,
          { ...defaults, ...(value.socials[platform] || {}) }
        ])
      )
      : DEFAULT_SOCIALS,
    profileImage: typeof value.profileImage === 'string' && value.profileImage.trim()
      ? value.profileImage
      : DEFAULT_SITE_CONTENT.profileImage,
    contact: value.contact && typeof value.contact === 'object' && !Array.isArray(value.contact)
      ? { ...DEFAULT_SITE_CONTENT.contact, ...value.contact }
      : DEFAULT_SITE_CONTENT.contact
  };
}
