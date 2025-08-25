import { useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Plus, LayoutDashboard, Package } from "lucide-react";

export default function Layout({ children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  const timerRef = useRef(null);

  function handleMouseEnter() {
    timerRef.current = setTimeout(() => setShowTooltip(true), 7000);
  }

  function handleMouseLeave() {
    clearTimeout(timerRef.current);
    setShowTooltip(false);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo e Navegação */}
          <div className="flex items-center gap-8">
            <Link to="/produtos" className="flex items-center gap-2">
              <img src="/image.png" alt="Logo" className="w-8 h-8 rounded-md object-cover"></img>
              <h1 className="text-xl font-bold text-gray-800">Marketplace</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/produtos" className={({ isActive }) =>
                `flex items-center gap-2 text-gray-600 hover:text-orange-600 ${isActive ? 'text-orange-600' : ''}`
              }
              >
                <Package size={20} />
                Produtos
              </NavLink>
            </nav>
          </div>

          {/* Ações do Usuário */}
          <div className="flex items-center gap-4">
            <Link to="/produtos/novo">
              <button className="bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-orange-700 transition"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <Plus size={16} />
                Novo produto
              </button>
              {showTooltip && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-sm rounded shadow-lg z-10">
                  Tá esperando o quê? Boraa moeer!! 🚀
                </div>
              )}
            </Link>
            <div className="relative">
              <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                <span className="font-bold text-gray-600">
                  {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}