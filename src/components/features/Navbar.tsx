import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Button from '../ui/Button';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white">
          <span className="text-emerald-400">AKJAE</span>-WEB3
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/board"
            className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
          >
            게시판
          </Link>

          {isAuthenticated ? (
            <>
              <span className="text-gray-400 text-sm">{user?.username}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">로그인</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">회원가입</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
