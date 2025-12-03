import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { QRCodeSVG } from 'qrcode.react';
import { Search, QrCode, X } from 'lucide-react';

const Generator = () => {
  const { employees } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmp, setSelectedEmp] = useState(null);

  const filteredEmployees = employees.filter(emp => 
    Object.values(emp).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Generador de Códigos QR</h2>
        <p className="text-gray-500">Seleccione un registro para generar su código de identificación</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar personal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm bg-white"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden">
                {emp.photo ? (
                  <img src={emp.photo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold text-lg">
                    {emp.nombre?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{emp.nombre}</h3>
                <p className="text-sm text-gray-500 truncate">{emp.cargo}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedEmp(emp)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Generar QR"
            >
              <QrCode className="h-6 w-6" />
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedEmp(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="p-8 flex flex-col items-center text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">{selectedEmp.nombre}</h3>
                <p className="text-sm text-gray-500">{selectedEmp.cargo}</p>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {selectedEmp.brigada}
                </span>
              </div>

              <div className="p-4 bg-white border-2 border-gray-100 rounded-xl shadow-inner">
                <QRCodeSVG
                  id="qr-code-svg"
                  value={String(selectedEmp.id)}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="w-full pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-left text-sm">
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Cédula</p>
                    <p className="font-medium">{selectedEmp.cedula}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Municipio</p>
                    <p className="font-medium">{selectedEmp.municipio}</p>
                  </div>
                </div>
              </div>

              {/* Optional: Download button if they change their mind about "no download" */}
              {/* <button onClick={downloadQR} className="...">Descargar</button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Generator;
