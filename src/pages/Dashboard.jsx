import React, { useRef } from 'react';
import { useData } from '../context/DataContext';
import { Download, Trash2, Camera, FileSpreadsheet, Search } from 'lucide-react';

const Dashboard = () => {
  const { employees, importExcel, updatePhoto, clearData, exportJson } = useData();
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const [selectedId, setSelectedId] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await importExcel(file);
      e.target.value = ''; // Reset
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && selectedId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePhoto(selectedId, reader.result);
        setSelectedId(null);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const triggerPhotoUpload = (id) => {
    setSelectedId(id);
    photoInputRef.current?.click();
  };

  const filteredEmployees = employees.filter(emp => 
    Object.values(emp).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Datos</h2>
          <p className="text-gray-500">Importe y administre la base de datos del personal</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Importar Excel
          </button>
          
          <button
            onClick={exportJson}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            Exportar JSON
          </button>

          <button
            onClick={clearData}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Limpiar
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre, cédula, cargo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm bg-white"
        />
      </div>

      {/* Hidden Photo Input */}
      <input
        type="file"
        ref={photoInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre / Cédula</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo / Brigada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                        {emp.photo ? (
                          <img src={emp.photo} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Camera className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{emp.nombre}</div>
                      <div className="text-sm text-gray-500">{emp.cedula}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{emp.cargo}</div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {emp.brigada}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {emp.municipio}, {emp.localidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => triggerPhotoUpload(emp.id)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md transition-colors"
                      >
                        Subir Foto
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileSpreadsheet className="h-8 w-8 text-gray-300" />
                      <p>No hay datos disponibles. Importe un archivo Excel.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
          Mostrando {filteredEmployees.length} registros
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
