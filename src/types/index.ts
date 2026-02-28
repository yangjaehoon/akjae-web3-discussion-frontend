export interface UserResponse {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
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
  author: UserResponse;
  category?: CategoryResponse;
  project?: ProjectResponse;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentResponse {
  id: number;
  content: string;
  author: UserResponse;
  parentId?: number;
  replies?: CommentResponse[];
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
