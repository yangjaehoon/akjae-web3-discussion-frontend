import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/features/Navbar';
import HomePage from './pages/HomePage';
import BoardPage from './pages/BoardPage';
import PostDetailPage from './pages/PostDetailPage';
import PostFormPage from './pages/PostFormPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/board"
          element={
            <Layout>
              <BoardPage />
            </Layout>
          }
        />
        <Route
          path="/posts/new"
          element={
            <Layout>
              <PostFormPage />
            </Layout>
          }
        />
        <Route
          path="/posts/:id"
          element={
            <Layout>
              <PostDetailPage />
            </Layout>
          }
        />
        <Route
          path="/posts/:id/edit"
          element={
            <Layout>
              <PostFormPage />
            </Layout>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
