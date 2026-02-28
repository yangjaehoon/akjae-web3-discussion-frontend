export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthData {
  token: string;
  username: string;
  email: string;
  role: string;
}

export interface StoredUser {
  username: string;
  email: string;
  role: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
}

export interface ProjectResponse {
  id: number;
  name: string;
  description?: string;
}

export interface PostResponse {
  id: number;
  title: string;
  content: string;
  authorUsername: string;
  authorId: number;
  project: ProjectResponse | null;
  category: CategoryResponse | null;
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentResponse {
  id: number;
  content: string;
  authorUsername: string;
  authorId: number;
  parentId: number | null;
  replies: CommentResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface PostRequest {
  title: string;
  content: string;
  categoryId?: number;
  projectId?: number;
}

export interface CommentRequest {
  content: string;
  parentId?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
