import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Scanner } from '@yudiel/react-qr-scanner';
import { CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import EmployeeCard from '../components/EmployeeCard';

const Verifier = () => {
  const { getEmployeeById } = useData();
  const [scannedResult, setScannedResult] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(true);

  const handleScan = (result) => {
    if (result && result.length > 0) {
      const id = result[0].rawValue;
      setScannedResult(id);
      setIsScanning(false);
      
      const found = getEmployeeById(id);
      if (found) {
        setEmployee(found);
        setError(null);
        toast.success('Personal verificado correctamente');
      } else {
        setEmployee(null);
        setError('ID no encontrado en la base de datos');
        toast.error('Personal no encontrado');
      }
    }
  };

  const resetScanner = () => {
    setScannedResult(null);
    setEmployee(null);
    setError(null);
    setIsScanning(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Verificador de Identidad</h2>
        <p className="text-gray-500">Escanee el código QR para validar la información</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Scanner Section */}
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative">
          {isScanning ? (
            <div className="aspect-square rounded-xl overflow-hidden relative bg-black">
              <Scanner 
                onScan={handleScan}
                onError={(error) => console.log(error)}
                components={{
                  audio: false,
                  torch: true,
                  count: false,
                  onOff: false,
                  tracker: true
                }}
                styles={{
                  container: { width: '100%', height: '100%' }
                }}
              />
              <div className="absolute inset-0 border-2 border-blue-500/50 animate-pulse pointer-events-none rounded-xl" />
              <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/50 py-2">
                Apunte la cámara al código QR
              </div>
            </div>
          ) : (
            <div className="aspect-square flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-center space-y-4">
                {employee ? (
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                )}
                <button
                  onClick={resetScanner}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Escanear Nuevo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="space-y-6">
          {employee ? (
            <EmployeeCard employee={employee} />
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-2 animate-in fade-in">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h3 className="text-lg font-bold text-red-800">No Encontrado</h3>
              <p className="text-red-600">El código escaneado ({scannedResult}) no corresponde a ningún registro activo.</p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-400 space-y-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <p>Esperando escaneo...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verifier;
