import React from 'react';

function App() {
  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4">
      {/* 로고/타이틀 */}
      <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-wider">
        <span className="text-emerald-400">AKJAE</span>-WEB3
      </h1>

      {/* 검색창 */}
      <div className="w-full max-w-xl flex">
        <input
          type="text"
          placeholder="관심 있는 WEB3 프로젝트를 검색해보세요..."
          className="flex-grow p-4 text-lg rounded-l-full border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          className="px-6 py-4 bg-emerald-600 text-white text-lg rounded-r-full hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          검색
        </button>
      </div>
    </div>
  );
}

export default App;
