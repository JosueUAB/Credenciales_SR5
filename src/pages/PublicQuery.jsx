import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Search, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmployeeCard from '../components/EmployeeCard';
import toast from 'react-hot-toast';

const PublicQuery = () => {
  const { employees } = useData();
  const [ci, setCi] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!ci.trim()) return;

    const found = employees.find(emp => 
      String(emp.cedula).toLowerCase() === ci.toLowerCase().trim() ||
      String(emp.id).toLowerCase() === ci.toLowerCase().trim()
    );

    setResult(found || null);
    setSearched(true);
    
    if (found) {
      toast.success('Registro encontrado');
    } else {
      toast.error('No se encontró ningún registro');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white py-4 px-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-blue-500" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">QR Master</h1>
              <p className="text-xs text-slate-400">Consulta Pública</p>
            </div>
          </div>
          <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
            Acceso Administrativo
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Verificación de Personal</h2>
            <p className="text-gray-500">Ingrese el número de Cédula de Identidad para verificar la credencial.</p>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              placeholder="Ingrese Cédula de Identidad"
              className="w-full pl-4 pr-12 py-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search className="h-6 w-6" />
            </button>
          </form>

          {searched && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {result ? (
                <EmployeeCard employee={result} />
              ) : (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                    <Search className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No encontrado</h3>
                  <p className="text-gray-500">No existe registro con la cédula proporcionada.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-400 text-sm">
        <p>© 2024 Sistema de Verificación Oficial</p>
      </footer>
    </div>
  );
};

export default PublicQuery;
