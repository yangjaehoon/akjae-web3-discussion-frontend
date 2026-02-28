import { Link } from 'react-router-dom';
import type { PostResponse } from '../../types';

interface PostCardProps {
  post: PostResponse;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link to={`/posts/${post.id}`}>
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 hover:border-emerald-500 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
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
            <h3 className="text-white font-semibold text-lg truncate">{post.title}</h3>
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{post.content}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span>{post.author.username}</span>
          <span>{formatDate(post.createdAt)}</span>
          <span>댓글 {post.commentCount}</span>
        </div>
      </div>
    </Link>
  );
}
