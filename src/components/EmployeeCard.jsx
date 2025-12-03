import React from 'react';
import { User, MapPin, Briefcase, Hash, CheckCircle } from 'lucide-react';

const EmployeeCard = ({ employee }) => {
  if (!employee) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom duration-500">
      <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800 relative">
        <div className="absolute -bottom-12 left-8">
          <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
            {employee.photo ? (
              <img src={employee.photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                <User className="h-12 w-12" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-16 px-8 pb-8 space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{employee.nombre}</h3>
          <p className="text-blue-600 font-medium">{employee.cargo}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-3 text-gray-600">
            <Hash className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400 uppercase">Cédula</p>
              <p className="font-medium">{employee.cedula}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <Briefcase className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400 uppercase">Brigada / Coordinador</p>
              <p className="font-medium">{employee.brigada} • {employee.coordinador}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400 uppercase">Ubicación</p>
              <p className="font-medium">{employee.municipio}, {employee.localidad}</p>
              <p className="text-sm text-gray-400">{employee.departamento}</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-2 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span className="font-bold">VERIFICADO</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
