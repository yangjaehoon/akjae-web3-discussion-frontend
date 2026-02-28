import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../lib/api';
import type { PostResponse, CategoryResponse, ProjectResponse, PageResponse } from '../types';
import PostCard from '../components/features/PostCard';
import Button from '../components/ui/Button';
import useAuthStore from '../store/authStore';

export default function BoardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const keyword = searchParams.get('keyword') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const projectId = searchParams.get('projectId') || '';
  const page = parseInt(searchParams.get('page') || '0', 10);

  const [keywordInput, setKeywordInput] = useState(keyword);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), size: '10' };
      if (keyword) params.keyword = keyword;
      if (categoryId) params.categoryId = categoryId;
      if (projectId) params.projectId = projectId;

      const res = await api.get<PageResponse<PostResponse>>('/api/posts', { params });
      setPosts(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, categoryId, projectId, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    // categories는 배열 직접 반환
    api.get<CategoryResponse[]>('/api/categories').then((r) => setCategories(r.data)).catch(() => {});
    // projects는 페이지네이션 반환
    api.get<PageResponse<ProjectResponse>>('/api/projects').then((r) => setProjects(r.data.content)).catch(() => {});
  }, []);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const handleSearch = () => {
    updateParam('keyword', keywordInput.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">게시판</h1>
          {isAuthenticated && (
            <Link to="/posts/new">
              <Button size="sm">글쓰기</Button>
            </Link>
          )}
        </div>

        {/* 필터 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="검색어를 입력하세요..."
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
            <Button size="sm" onClick={handleSearch}>검색</Button>
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              value={categoryId}
              onChange={(e) => updateParam('categoryId', e.target.value)}
              className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">전체 카테고리</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
              ))}
            </select>

            <select
              value={projectId}
              onChange={(e) => updateParam('projectId', e.target.value)}
              className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">전체 프로젝트</option>
              {projects.map((p) => (
                <option key={p.id} value={String(p.id)}>{p.name}</option>
              ))}
            </select>

            {(keyword || categoryId || projectId) && (
              <button
                onClick={() => { setKeywordInput(''); setSearchParams({}); }}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                필터 초기화
              </button>
            )}
          </div>
        </div>

        {/* 게시글 목록 */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">불러오는 중...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">게시글이 없습니다.</div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.set('page', String(i));
                  setSearchParams(next);
                }}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  i === page
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
