import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/board?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/board');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-wider">
        <span className="text-emerald-400">AKJAE</span>-WEB3
      </h1>

      <div className="w-full max-w-xl flex">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="관심 있는 WEB3 프로젝트를 검색해보세요..."
          className="flex-grow p-4 text-lg rounded-l-full border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-4 bg-emerald-600 text-white text-lg rounded-r-full hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          검색
        </button>
      </div>

      <p className="mt-6 text-gray-500 text-sm">
        또는{' '}
        <a href="/board" className="text-emerald-400 hover:text-emerald-300 underline">
          게시판 전체보기
        </a>
      </p>
    </div>
  );
}
