import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import type { PostResponse, CommentResponse } from '../types';
import useAuthStore from '../store/authStore';
import CommentItem from '../components/features/CommentItem';
import Button from '../components/ui/Button';

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [post, setPost] = useState<PostResponse | null>(null);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [postLoading, setPostLoading] = useState(true);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      const res = await api.get<PostResponse>(`/api/posts/${id}`);
      setPost(res.data);
    } catch {
      navigate('/board');
    } finally {
      setPostLoading(false);
    }
  }, [id, navigate]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await api.get<CommentResponse[]>(`/api/posts/${id}/comments`);
      setComments(res.data);
    } catch {
      setComments([]);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  const handleDelete = async () => {
    if (!confirm('게시글을 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/api/posts/${id}`);
      navigate('/board');
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;
    setCommentSubmitting(true);
    try {
      await api.post(`/api/posts/${id}/comments`, { content: commentContent });
      setCommentContent('');
      fetchComments();
    } catch {
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-500">
        불러오는 중...
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = user?.id === post.author.id;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-6">
          <Link to="/board" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← 목록으로
          </Link>
        </div>

        {/* 게시글 */}
        <article className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-2 mb-3 flex-wrap">
            {post.category && (
              <span className="text-xs px-2 py-0.5 bg-emerald-900 text-emerald-300 rounded-full">
                {post.category.name}
              </span>
            )}
            {post.project && (
              <span className="text-xs px-2 py-0.5 bg-blue-900 text-blue-300 rounded-full">
                {post.project.name}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-white mb-4">{post.title}</h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="text-emerald-400 font-medium">{post.author.username}</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
            {isAuthor && (
              <div className="flex gap-2">
                <Link to={`/posts/${id}/edit`}>
                  <Button size="sm" variant="secondary">수정</Button>
                </Link>
                <Button size="sm" variant="danger" onClick={handleDelete}>삭제</Button>
              </div>
            )}
          </div>

          <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </article>

        {/* 댓글 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">댓글 {comments.length}개</h2>

          {isAuthenticated && (
            <div className="mb-6 flex gap-2">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="댓글을 입력하세요..."
                rows={3}
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm"
              />
              <Button onClick={handleCommentSubmit} loading={commentSubmitting}>
                등록
              </Button>
            </div>
          )}

          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">첫 댓글을 작성해보세요!</p>
          ) : (
            <div>
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  postId={Number(id)}
                  onRefresh={fetchComments}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
