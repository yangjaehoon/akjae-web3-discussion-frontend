import { useState } from 'react';
import type { CommentResponse } from '../../types';
import useAuthStore from '../../store/authStore';
import Button from '../ui/Button';
import api from '../../lib/api';

interface CommentItemProps {
  comment: CommentResponse;
  postId: number;
  onRefresh: () => void;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function CommentItem({ comment, postId, onRefresh }: CommentItemProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isAuthor = user?.id === comment.author.id;

  const handleDelete = async () => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/api/comments/${comment.id}`);
      onRefresh();
    } catch {
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/api/posts/${postId}/comments`, {
        content: replyContent,
        parentId: comment.id,
      });
      setReplyContent('');
      setReplyOpen(false);
      onRefresh();
    } catch {
      alert('대댓글 작성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-b border-gray-700 py-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-emerald-400 font-medium text-sm">{comment.author.username}</span>
            <span className="text-gray-600 text-xs">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="text-gray-200 text-sm whitespace-pre-wrap">{comment.content}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {isAuthenticated && (
            <button
              onClick={() => setReplyOpen(!replyOpen)}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              답글
            </button>
          )}
          {isAuthor && (
            <button
              onClick={handleDelete}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              삭제
            </button>
          )}
        </div>
      </div>

      {replyOpen && (
        <div className="mt-3 flex gap-2">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="대댓글을 입력하세요..."
            rows={2}
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
          <div className="flex flex-col gap-1">
            <Button size="sm" onClick={handleReplySubmit} loading={submitting}>등록</Button>
            <Button size="sm" variant="ghost" onClick={() => setReplyOpen(false)}>취소</Button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 ml-6 border-l-2 border-gray-700 pl-4 space-y-3">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="pt-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-emerald-400 font-medium text-sm">{reply.author.username}</span>
                    <span className="text-gray-600 text-xs">{formatDate(reply.createdAt)}</span>
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">{reply.content}</p>
                </div>
                {user?.id === reply.author.id && (
                  <button
                    onClick={async () => {
                      if (!confirm('댓글을 삭제하시겠습니까?')) return;
                      try {
                        await api.delete(`/api/comments/${reply.id}`);
                        onRefresh();
                      } catch {
                        alert('삭제에 실패했습니다.');
                      }
                    }}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors ml-4"
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
