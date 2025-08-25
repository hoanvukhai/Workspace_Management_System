import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../img/DuoTask.png';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = ({ onLogout, setLoading }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState("user"); // Mặc định là user

  // Lấy role từ token khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decodedToken.role || "user");
    }
  }, []);

  const isLoggedIn = () => {
    return !!localStorage.getItem('token');
  };

  const logout = () => {
    if (onLogout) onLogout();
    setLoading(true);
    localStorage.removeItem('token');
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  return (
    <header className="bg-white shadow-md px-6 h-20 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link to="/"><div className="flex items-center">
        <img src={logo} alt="DuoTask Logo" className="h-24 w-auto object-contain" />
      </div></Link>
      

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6 text-gray-700 font-medium items-center">
        <Link to="/" className="hover:text-blue-600 transition">Trang chủ</Link>
        <Link to="/home" className="hover:text-blue-600 transition">Workspace</Link>
        <a href="#support" className="hover:text-blue-600 transition">Hỗ trợ</a>
      </nav>

      {/* Actions */}
      <div className="hidden md:flex space-x-4 items-center">
        {isLoggedIn() ? (
          <>
            {userRole === "admin" && (
              <Link
                to="/admin/users"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Admin
              </Link>
            )}
            <Link to="/profile" className="text-blue-600 hover:underline transition">Tài khoản</Link>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600 hover:underline transition">Đăng nhập</Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Đăng ký
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700" aria-label="Toggle menu">
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-md px-6 py-4 flex flex-col gap-4 md:hidden z-40 transition-all duration-300">
          <Link to="/" onClick={() => setMenuOpen(false)}>Trang chủ</Link>
          <Link to="/home" onClick={() => setMenuOpen(false)}>Workspace</Link>
          <a href="#support" onClick={() => setMenuOpen(false)}>Hỗ trợ</a>
          <hr />
          {isLoggedIn() ? (
            <>
              {userRole === "admin" && (
                <Link to="/admin/users" onClick={() => setMenuOpen(false)}>Quản lý người dùng</Link>
              )}
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Tài khoản</Link>
              <button onClick={logout} className="text-left text-red-600">Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Đăng nhập</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Đăng ký</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;