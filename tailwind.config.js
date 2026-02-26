/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Antigravity 스타일 지침을 고려한 색상, 폰트 등을 여기에 확장할 수 있습니다.
      // 예: primary: '#5a67d8',
    },
  },
  plugins: [],
}