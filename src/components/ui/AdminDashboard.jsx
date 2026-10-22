import { useEffect, useState } from 'react';
import { normalizeProject, normalizeProjects, toApiProject } from '../../lib/portfolioApi.js';
import { DEFAULT_SITE_CONTENT, normalizeSiteContent } from '../../lib/siteContent.js';
import { convertImageToWebP } from '../../lib/imageUpload.js';

const EMPTY_PROJECT = {
  title: '',
  category: '',
  year: new Date().getFullYear().toString(),
  description: '',
  link: '',
  textSide: 'left',
  image: ''
};

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    ...options,
    headers: options.body instanceof FormData
      ? options.headers
      : { 'Content-Type': 'application/json', ...options.headers }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Permintaan tidak dapat diproses.');
  }
  return response.status === 204 ? null : response.json();
}

export default function AdminDashboard({ onClose, onProjectsChanged, onSiteContentChanged }) {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState([]);
  const [siteContent, setSiteContent] = useState(DEFAULT_SITE_CONTENT);
  const [activeTab, setActiveTab] = useState('projects');
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!preview.startsWith('blob:')) return undefined;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const loadProjects = async () => {
    const data = normalizeProjects(await apiRequest('/api/projects'));
    setProjects(data);
  };

  const loadSiteContent = async () => {
    const saved = await apiRequest('/api/content');
    const merged = normalizeSiteContent(saved);
    setSiteContent(merged);
    return merged;
  };

  useEffect(() => {
    apiRequest('/api/auth/session')
      .then(async (session) => {
        setAuthenticated(session.authenticated);
        if (session.authenticated) {
          const results = await Promise.allSettled([loadProjects(), loadSiteContent()]);
          const failed = results.find((result) => result.status === 'rejected');
          if (failed) setError(failed.reason.message);
        }
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsCheckingSession(false));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setFeedback('');
    try {
      await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      setAuthenticated(true);
      setPassword('');
      const results = await Promise.allSettled([loadProjects(), loadSiteContent()]);
      const failed = results.find((result) => result.status === 'rejected');
      if (failed) setError(failed.reason.message);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
      setAuthenticated(false);
      setProjects([]);
      setSiteContent(DEFAULT_SITE_CONTENT);
      setEditingProject(null);
      setFeedback('Anda telah keluar dari dashboard.');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const startCreate = () => {
    setEditingProject(null);
    setForm(EMPTY_PROJECT);
    setSelectedImage(null);
    setPreview('');
    setError('');
    setFeedback('');
  };

  const startEdit = (project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      category: project.category,
      year: project.year,
      description: project.description,
      link: project.link || '',
      textSide: project.textSide,
      image: project.image
    });
    setSelectedImage(null);
    setPreview(project.image);
    setError('');
    setFeedback('');
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const saveProfileImage = async (file) => {
    setError('');
    setFeedback('');
    setIsSaving(true);
    try {
      let image = '/profile.webp';
      if (file) {
        const optimized = await convertImageToWebP(file, { maxWidth: 1600, maxHeight: 1600 });
        const data = new FormData();
        data.append('image', optimized);
        data.append('purpose', 'profile');
        const uploaded = await apiRequest('/api/admin/uploads', { method: 'POST', body: data });
        image = uploaded.image;
      }

      const result = await apiRequest('/api/admin/content/profileImage', {
        method: 'PUT',
        body: JSON.stringify({ value: image })
      });
      setSiteContent((current) => ({ ...current, profileImage: result.value }));
      await onSiteContentChanged();
      setFeedback(file ? 'Foto About berhasil diperbarui.' : 'Foto bawaan berhasil dipulihkan.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError('');
    setFeedback('');
    setIsSaving(true);
    try {
      let image = form.image;
      if (selectedImage) {
        const data = new FormData();
        data.append('image', await convertImageToWebP(selectedImage, { aspectRatio: 16 / 9 }));
        data.append('purpose', 'project');
        const uploaded = await apiRequest('/api/admin/uploads', { method: 'POST', body: data });
        image = uploaded.image;
      }
      if (!image) throw new Error('Pilih gambar proyek dengan rasio 16:9.');

      const payload = toApiProject({ ...form, image });
      const savedProject = editingProject
        ? await apiRequest(`/api/admin/projects/${editingProject.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        })
        : await apiRequest('/api/admin/projects', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      const project = normalizeProject(savedProject);

      setProjects((current) => {
        if (!editingProject) return [...current, project];
        return current.map((item) => item.id === project.id ? project : item);
      });
      await onProjectsChanged();
      setFeedback(editingProject ? 'Proyek berhasil diperbarui.' : 'Proyek berhasil ditambahkan.');
      startCreate();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Hapus proyek "${project.title}"?`)) return;
    setError('');
    setFeedback('');
    try {
      await apiRequest(`/api/admin/projects/${project.id}`, { method: 'DELETE' });
      setProjects((current) => current.filter((item) => item.id !== project.id));
      if (editingProject?.id === project.id) startCreate();
      await onProjectsChanged();
      setFeedback('Proyek berhasil dihapus.');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const saveContent = async (key, value) => {
    setError('');
    setFeedback('');
    try {
      const result = await apiRequest(`/api/admin/content/${key}`, {
        method: 'PUT',
        body: JSON.stringify({ value })
      });
      setSiteContent((current) => ({ ...current, [key]: result.value }));
      await onSiteContentChanged();
      setFeedback('Konten berhasil disimpan.');
    } catch (saveError) {
      setError(saveError instanceof SyntaxError ? 'JSON tidak valid. Periksa format konten sebelum menyimpan.' : saveError.message);
    }
  };

  const legacyImageProjects = projects.filter((project) => (
    project.image.startsWith('/uploads/') && /\.jpe?g$/i.test(project.image)
  ));

  const convertLegacyImages = async () => {
    if (!legacyImageProjects.length || !window.confirm(`Kompres ${legacyImageProjects.length} gambar proyek lama menjadi WebP?`)) return;
    setError('');
    setFeedback('');
    setIsSaving(true);
    let converted = 0;
    try {
      for (const project of legacyImageProjects) {
        const response = await fetch(project.image, { credentials: 'same-origin' });
        if (!response.ok) throw new Error(`Gambar "${project.title}" tidak dapat dimuat.`);
        const source = await response.blob();
        const imageFile = new File([source], `${project.id}.jpg`, { type: source.type || 'image/jpeg' });
        const optimized = await convertImageToWebP(imageFile, { aspectRatio: 16 / 9 });
        const data = new FormData();
        data.append('image', optimized);
        data.append('purpose', 'project');
        const uploaded = await apiRequest('/api/admin/uploads', { method: 'POST', body: data });
        const saved = await apiRequest(`/api/admin/projects/${project.id}`, {
          method: 'PUT',
          body: JSON.stringify(toApiProject({ ...project, image: uploaded.image }))
        });
        const normalized = normalizeProject(saved);
        setProjects((current) => current.map((item) => item.id === normalized.id ? normalized : item));
        converted += 1;
        setFeedback(`Mengompres gambar lama: ${converted}/${legacyImageProjects.length} selesai.`);
      }
      await onProjectsChanged();
      setFeedback(`${converted} gambar proyek berhasil dikompres ke WebP.`);
    } catch (conversionError) {
      setError(`Berhasil mengompres ${converted} dari ${legacyImageProjects.length} gambar. ${conversionError.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: '8px',
    background: '#0a0a0c',
    color: '#fff',
    font: 'inherit',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'grid',
    gap: '8px',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    letterSpacing: '1px',
    color: 'rgba(255,255,255,0.65)'
  };

  return (
    <main
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        overflowY: 'auto',
        background: '#050505',
        color: '#fff',
        padding: '6.5rem clamp(1.25rem, 5vw, 4rem) 4rem'
      }}
    >
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        <header className="admin-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          paddingBottom: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)' }}>
              PORTFOLIO / CONTENT MANAGEMENT
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', margin: '0.5rem 0 0', color: '#fff' }}>
              Admin dashboard
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {authenticated && (
              <button type="button" onClick={handleLogout} style={secondaryButtonStyle}>
                KELUAR
              </button>
            )}
            <button type="button" onClick={onClose} style={secondaryButtonStyle}>
              ← KEMBALI KE WORK
            </button>
          </div>
        </header>

        {error && !authenticated && <div role="alert" style={messageStyle('error')}>{error}</div>}
        {feedback && !authenticated && <div role="status" style={messageStyle('success')}>{feedback}</div>}
        {isCheckingSession ? (
          <p>Memeriksa sesi admin…</p>
        ) : !authenticated ? (
          <form
            onSubmit={handleLogin}
            style={{
              maxWidth: '460px',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              background: '#0a0a0c',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'grid',
              gap: '1.2rem'
            }}
          >
            <div>
              <h2 style={{ margin: '0 0 0.5rem', color: '#fff', fontFamily: 'var(--font-display)' }}>Login admin</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
                Masuk untuk mengelola proyek portofolio.
              </p>
            </div>
            <label style={labelStyle}>
              USERNAME
              <input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              PASSWORD
              <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} style={inputStyle} />
            </label>
            <button type="submit" style={primaryButtonStyle}>MASUK KE DASHBOARD ↗</button>
          </form>
        ) : (
          <>
            <div className="admin-layout" style={{ display: 'grid', gridTemplateColumns: '220px minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
              <aside aria-label="Menu admin" style={{ display: 'grid', gap: '8px', padding: '12px', background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.12)', position: 'sticky', top: '1rem' }}>
                {[
                  ['projects', 'Proyek'],
                  ['history', 'Histori'],
                  ['technologies', 'Teknologi About'],
                  ['profile', 'Foto About'],
                  ['socials', 'Media sosial']
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { setActiveTab(key); setError(''); setFeedback(''); }}
                    style={{ ...secondaryButtonStyle, textAlign: 'left', borderColor: activeTab === key ? '#fff' : 'rgba(255,255,255,0.14)', background: activeTab === key ? '#fff' : 'transparent', color: activeTab === key ? '#050505' : '#fff' }}
                  >
                    {label}
                  </button>
                ))}
              </aside>

              <div style={{ minWidth: 0 }}>
                {error && <div role="alert" style={messageStyle('error')}>{error}</div>}
                {feedback && <div role="status" style={messageStyle('success')}>{feedback}</div>}
                {activeTab === 'projects' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: '2rem', alignItems: 'start' }}>
            <form onSubmit={handleSave} style={{ display: 'grid', gap: '1rem', padding: '1.5rem', background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>
                  {editingProject ? 'Edit proyek' : 'Tambah proyek'}
                </h2>
                {editingProject && <button type="button" onClick={startCreate} style={quietButtonStyle}>BATAL</button>}
              </div>

              <label style={labelStyle}>JUDUL<input required maxLength={160} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} style={inputStyle} /></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: '10px' }}>
                <label style={labelStyle}>KATEGORI<input required maxLength={100} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} style={inputStyle} /></label>
                <label style={labelStyle}>TAHUN<input required maxLength={12} value={form.year} onChange={(event) => setForm({ ...form, year: event.target.value })} style={inputStyle} /></label>
              </div>
              <label style={labelStyle}>DESKRIPSI<textarea required maxLength={4000} rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} style={{ ...inputStyle, resize: 'vertical' }} /></label>
              <label style={labelStyle}>URL PROYEK (OPSIONAL)<input type="url" value={form.link} onChange={(event) => setForm({ ...form, link: event.target.value })} style={inputStyle} placeholder="https://" /></label>
              <label style={labelStyle}>
                POSISI PANEL
                <select value={form.textSide} onChange={(event) => setForm({ ...form, textSide: event.target.value })} style={inputStyle}>
                  <option value="left">Kiri</option>
                  <option value="right">Kanan</option>
                </select>
              </label>
              <div style={{ display: 'grid', gap: '8px' }}>
                <label style={labelStyle}>
                  GAMBAR PROYEK • 16:9
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} style={{ ...inputStyle, padding: '9px' }} />
                </label>
                <div style={{ aspectRatio: '16 / 9', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.14)', background: '#111' }}>
                  {preview ? (
                    <img src={preview} alt="Pratinjau gambar proyek 16:9" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      PREVIEW 16:9
                    </div>
                  )}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                  Maksimal 12 MB. Gambar otomatis dipotong ke 16:9, dikompres, lalu disimpan sebagai WebP.
                </span>
              </div>
              <button type="submit" disabled={isSaving} style={{ ...primaryButtonStyle, opacity: isSaving ? 0.65 : 1 }}>
                {isSaving ? 'MENYIMPAN…' : editingProject ? 'SIMPAN PERUBAHAN' : 'TAMBAH PROYEK'}
              </button>
            </form>

            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, color: '#fff', fontFamily: 'var(--font-display)' }}>Proyek tersimpan</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {legacyImageProjects.length > 0 && (
                    <button type="button" disabled={isSaving} onClick={convertLegacyImages} style={{ ...secondaryButtonStyle, opacity: isSaving ? 0.6 : 1 }}>
                      KOMPRES {legacyImageProjects.length} FOTO LAMA
                    </button>
                  )}
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{projects.length} ITEM</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.12)' }}>
                {projects.map((project) => (
                  <article key={project.id} style={{ background: '#0a0a0c', minWidth: 0 }}>
                    <img src={project.image} alt="" loading="lazy" style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block', background: '#151515' }} />
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>{project.category} / {project.year}</div>
                      <h3 style={{ margin: '0.5rem 0 1rem', color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{project.title}</h3>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="button" onClick={() => startEdit(project)} style={secondaryButtonStyle}>EDIT</button>
                        <button type="button" onClick={() => handleDelete(project)} style={dangerButtonStyle}>HAPUS</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
                ) : activeTab === 'profile' ? (
                  <ProfileImageEditor
                    key={siteContent.profileImage}
                    value={siteContent.profileImage}
                    onSave={saveProfileImage}
                    isSaving={isSaving}
                    inputStyle={inputStyle}
                    labelStyle={labelStyle}
                  />
                ) : (
                  <ContentEditor
                    key={activeTab}
                    contentKey={activeTab}
                    value={siteContent[activeTab] ?? DEFAULT_SITE_CONTENT[activeTab]}
                    onSave={saveContent}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function ProfileImageEditor({ value, onSave, isSaving, inputStyle, labelStyle }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(value || '/profile.webp');

  useEffect(() => {
    if (!preview.startsWith('blob:')) return undefined;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  return (
    <section style={{ display: 'grid', gap: '1rem', maxWidth: '680px', padding: 'clamp(1rem, 3vw, 2rem)', background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.12)' }}>
      <div>
        <h2 style={{ margin: '0 0 0.5rem', color: '#fff', fontFamily: 'var(--font-display)' }}>Ganti foto About</h2>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
          Foto hanya dapat diganti dari dashboard admin. Gambar akan dikompres menjadi WebP sebelum diunggah.
        </p>
      </div>
      <div style={{ width: 'min(100%, 360px)', aspectRatio: '3 / 4', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.14)', background: '#111' }}>
        <img src={preview} alt="Pratinjau foto About" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <label style={labelStyle}>
        FOTO PROFIL
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            const nextFile = event.target.files?.[0];
            if (!nextFile) return;
            setFile(nextFile);
            setPreview(URL.createObjectURL(nextFile));
          }}
          style={{ ...inputStyle, padding: '9px' }}
        />
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <button type="button" disabled={!file || isSaving} onClick={() => onSave(file)} style={{ ...primaryButtonStyle, opacity: !file || isSaving ? 0.6 : 1 }}>
          {isSaving ? 'MENYIMPAN…' : 'SIMPAN FOTO'}
        </button>
        <button type="button" disabled={isSaving} onClick={() => { setFile(null); setPreview('/profile.webp'); onSave(null); }} style={secondaryButtonStyle}>
          GUNAKAN FOTO DEFAULT
        </button>
      </div>
    </section>
  );
}

function ContentEditor({ contentKey, value, onSave }) {
  const [draft, setDraft] = useState(value);
  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: '8px',
    background: '#0a0a0c',
    color: '#fff',
    font: 'inherit',
    boxSizing: 'border-box'
  };
  const labelStyle = {
    display: 'grid',
    gap: '8px',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    letterSpacing: '1px',
    color: 'rgba(255,255,255,0.65)'
  };
  const titles = {
    history: 'Edit histori perjalanan',
    technologies: 'Edit teknologi About',
    socials: 'Edit tautan media sosial'
  };
  const descriptions = {
    history: 'Atur pengalaman dan milestone yang ditampilkan pada section History.',
    technologies: 'Kelola daftar teknologi pada halaman About. Pilih kategori yang tersedia untuk mengelompokkan kartu.',
    socials: 'Atur tautan GitHub, LinkedIn, TikTok, dan Instagram yang ditampilkan pada halaman.'
  };
  const updateEntry = (index, field, nextValue) => {
    setDraft((current) => current.map((entry, entryIndex) => {
      if (entryIndex !== index) return entry;
      if (field === 'details' || field === 'techStack') {
        return { ...entry, [field]: nextValue.split('\n').map((item) => item.trim()).filter(Boolean) };
      }
      if (field === 'id' || field === 'ratio' || field === 'stemHeight') {
        return { ...entry, [field]: Number(nextValue) };
      }
      return { ...entry, [field]: nextValue };
    }));
  };
  const listFields = contentKey === 'history'
    ? ['id', 'year', 'title', 'company', 'text', 'details', 'techStack', 'ratio', 'stemHeight']
    : ['name', 'category', 'tag', 'role', 'desc'];
  const addEntry = () => {
    const blank = contentKey === 'history'
      ? {
        id: Math.max(-1, ...draft.map((item) => Number(item.id))) + 1,
        year: '',
        title: '',
        company: '',
        text: '',
        details: [],
        techStack: [],
        ratio: Math.min(1, Math.max(0, ...draft.map((item) => Number(item.ratio))) + 0.05),
        stemHeight: 64
      }
      : { name: '', category: 'frontend', tag: '', role: '', desc: '' };
    setDraft((current) => [...current, blank]);
  };
  const fieldStyle = { ...inputStyle, padding: '10px 12px' };

  return (
    <form
      onSubmit={(event) => { event.preventDefault(); onSave(contentKey, draft); }}
      style={{ display: 'grid', gap: '1rem', padding: 'clamp(1rem, 3vw, 2rem)', background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.12)' }}
    >
      <div>
        <h2 style={{ margin: '0 0 0.5rem', color: '#fff', fontFamily: 'var(--font-display)' }}>{titles[contentKey]}</h2>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{descriptions[contentKey]}</p>
      </div>

      {contentKey === 'socials' ? (
        Object.entries(draft).map(([platform, social]) => (
          <fieldset key={platform} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', padding: '1rem', border: '1px solid rgba(255,255,255,0.14)' }}>
            <legend style={{ padding: '0 8px', fontFamily: 'var(--font-mono)', color: '#fff', textTransform: 'uppercase' }}>{platform}</legend>
            {[
              ['label', 'LABEL'],
              ['hoverLabel', 'LABEL SAAT HOVER'],
              ['url', 'URL PROFIL']
            ].map(([field, label]) => (
              <label key={field} style={labelStyle}>
                {label}
                <input
                  type={field === 'url' ? 'url' : 'text'}
                  value={social[field] || ''}
                  placeholder={field === 'url' ? 'https://' : ''}
                  onChange={(event) => setDraft((current) => ({ ...current, [platform]: { ...current[platform], [field]: event.target.value } }))}
                  style={fieldStyle}
                />
              </label>
            ))}
          </fieldset>
        ))
      ) : (
        <>
          {draft.map((entry, index) => (
            <fieldset key={entry.id ?? entry.name ?? index} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px', padding: '1rem', border: '1px solid rgba(255,255,255,0.14)' }}>
              <legend style={{ padding: '0 8px', fontFamily: 'var(--font-mono)', color: '#fff' }}>
                {contentKey === 'history' ? `MILESTONE ${index + 1}` : `TEKNOLOGI ${index + 1}`}
              </legend>
              {listFields.map((field) => {
                const isLongText = ['text', 'desc', 'details', 'techStack'].includes(field);
                const isArray = field === 'details' || field === 'techStack';
                return (
                  <label key={field} style={{ ...labelStyle, gridColumn: isLongText ? '1 / -1' : undefined }}>
                    {field === 'techStack' ? 'TECH STACK' : field.toUpperCase()}
                    {field === 'category' ? (
                      <select value={entry[field]} onChange={(event) => updateEntry(index, field, event.target.value)} style={fieldStyle}>
                        <option value="backend">Backend & API</option>
                        <option value="database">Database & Data</option>
                        <option value="frontend">Frontend</option>
                        <option value="design">Desain & Kreatif</option>
                      </select>
                    ) : isLongText ? (
                      <textarea
                        rows={isArray ? 3 : 4}
                        value={isArray ? entry[field].join('\n') : entry[field]}
                        onChange={(event) => updateEntry(index, field, event.target.value)}
                        style={{ ...fieldStyle, resize: 'vertical' }}
                      />
                    ) : (
                      <input
                        type={['id', 'ratio', 'stemHeight'].includes(field) ? 'number' : 'text'}
                        min={field === 'ratio' ? 0 : undefined}
                        max={field === 'ratio' ? 1 : undefined}
                        step={field === 'ratio' ? '0.01' : undefined}
                        value={entry[field]}
                        onChange={(event) => updateEntry(index, field, event.target.value)}
                        style={fieldStyle}
                      />
                    )}
                  </label>
                );
              })}
              <button type="button" onClick={() => setDraft((current) => current.filter((_, entryIndex) => entryIndex !== index))} style={dangerButtonStyle}>
                HAPUS ITEM
              </button>
            </fieldset>
          ))}
          <button type="button" onClick={addEntry} style={secondaryButtonStyle}>+ TAMBAH ITEM</button>
        </>
      )}

      <button type="submit" style={primaryButtonStyle}>SIMPAN PERUBAHAN</button>
    </form>
  );
}

const primaryButtonStyle = {
  border: 0,
  padding: '13px 16px',
  background: '#fff',
  color: '#050505',
  fontFamily: 'var(--font-mono)',
  fontWeight: 700,
  letterSpacing: '1px',
  cursor: 'pointer'
};

const secondaryButtonStyle = {
  border: '1px solid rgba(255,255,255,0.2)',
  padding: '9px 13px',
  background: 'transparent',
  color: '#fff',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.68rem',
  letterSpacing: '1px',
  cursor: 'pointer'
};

const quietButtonStyle = { ...secondaryButtonStyle, padding: '7px 10px', color: 'rgba(255,255,255,0.7)' };
const dangerButtonStyle = { ...secondaryButtonStyle, borderColor: 'rgba(255,110,110,0.35)', color: '#ff9a9a' };

function messageStyle(type) {
  return {
    padding: '12px 16px',
    marginBottom: '1rem',
    border: `1px solid ${type === 'error' ? 'rgba(255,100,100,0.4)' : 'rgba(150,255,190,0.35)'}`,
    background: type === 'error' ? 'rgba(100,20,20,0.2)' : 'rgba(20,100,50,0.16)',
    color: type === 'error' ? '#ffb0b0' : '#aaffc5'
  };
}
