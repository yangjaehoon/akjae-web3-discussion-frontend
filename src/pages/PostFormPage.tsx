import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import type { PostResponse, CategoryResponse, ProjectResponse } from '../types';
import useAuthStore from '../store/authStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function PostFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    api.get<CategoryResponse[]>('/api/categories').then((r) => setCategories(r.data)).catch(() => {});
    api.get<ProjectResponse[]>('/api/projects').then((r) => setProjects(r.data)).catch(() => {});

    if (isEdit && id) {
      api.get<PostResponse>(`/api/posts/${id}`).then((r) => {
        setTitle(r.data.title);
        setContent(r.data.content);
        if (r.data.category) setCategoryId(String(r.data.category.id));
        if (r.data.project) setProjectId(String(r.data.project.id));
      }).catch(() => navigate('/board'));
    }
  }, [isEdit, id, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 입력해주세요.');
      return;
    }
    setError('');
    setLoading(true);

    const body: Record<string, unknown> = { title, content };
    if (categoryId) body.categoryId = Number(categoryId);
    if (projectId) body.projectId = Number(projectId);

    try {
      if (isEdit) {
        await api.put(`/api/posts/${id}`, body);
        navigate(`/posts/${id}`);
      } else {
        const res = await api.post<PostResponse>('/api/posts', body);
        navigate(`/posts/${res.data.id}`);
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || '저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{isEdit ? '게시글 수정' : '게시글 작성'}</h1>

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <Input
            label="제목"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
            autoFocus
          />

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-300 block mb-1">카테고리</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              >
                <option value="">카테고리 선택</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-gray-300 block mb-1">프로젝트</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              >
                <option value="">프로젝트 선택</option>
                {projects.map((p) => (
                  <option key={p.id} value={String(p.id)}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요..."
              rows={12}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(isEdit ? `/posts/${id}` : '/board')}
            >
              취소
            </Button>
            <Button type="submit" loading={loading}>
              {isEdit ? '수정하기' : '등록하기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
