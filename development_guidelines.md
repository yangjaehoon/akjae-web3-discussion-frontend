# Project: [프로젝트명]

## Overview
React/Next.js 기반 웹 애플리케이션

## Tech Stack
- **Framework**: Next.js 14
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State**: Zustand / React Query

## Project Structure
```text
src/
├── app/           # Next.js App Router
├── components/
│   ├── ui/        # 공통 UI 컴포넌트
│   └── features/  # 기능별 컴포넌트
├── hooks/         # 커스텀 훅
├── lib/           # 유틸리티
├── types/         # TypeScript 타입
└── styles/        # 글로벌 스타일
```

## Code Style Rules
- [ ] 컴포넌트는 함수형으로 작성
- [ ] Props는 interface로 정의
- [ ] 커스텀 훅은 `use` 접두사 사용
- [ ] 상태 관리는 최소화

## Naming Conventions
- **컴포넌트**: PascalCase (`Button.tsx`)
- **훅**: camelCase with use prefix (`useAuth.ts`)
- **유틸**: camelCase (`formatDate.ts`)
- **타입**: PascalCase with I prefix (`IUser.ts`)

## Commands
- `npm run dev` - 개발 서버 (localhost:3000)
- `npm run build` - 프로덕션 빌드
- `npm run lint` - ESLint 검사
- `npm run test` - Jest 테스트

## Important Notes
- 이미지는 `next/image` 사용
- API 호출은 `lib/api.ts`에서 관리
- 환경변수는 `.env.local` 사용
