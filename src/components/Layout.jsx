import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QrCode, Scan, Database, LogOut, ShieldCheck } from 'lucide-react';
import SecurityGuard from './SecurityGuard';

const Layout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: Database, label: 'Datos' },
    { path: '/generator', icon: QrCode, label: 'Generador' },
    { path: '/verifier', icon: Scan, label: 'Verificador' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SecurityGuard />
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <ShieldCheck className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">QR Master</h1>
            <p className="text-xs text-slate-400">Sistema Seguro</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')] opacity-[0.02] pointer-events-none bg-cover bg-center" />
        <div className="relative z-0 p-8 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
