import React, { createContext, useContext, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      let localData = [];
      const storedData = localStorage.getItem('qr_app_data');
      
      if (storedData) {
        try {
          localData = JSON.parse(storedData);
        } catch (error) {
          console.error('Error loading local data', error);
        }
      }

      // If local data is empty, or if we want to ensure we have the latest static data
      // Strategy: If local data is empty, definitely load static.
      // If local data exists, we currently keep it (user might have added more).
      // But for the "Public Verifier" on a fresh browser, localData is empty.
      
      if (localData.length > 0) {
        setEmployees(localData);
        setLoading(false);
      } else {
        // Try loading from static file
        try {
          // Use import.meta.env.BASE_URL to ensure correct path on GitHub Pages
          const baseUrl = import.meta.env.BASE_URL || '/';
          const dataUrl = `${baseUrl}data.json`.replace('//', '/'); // Avoid double slashes
          
          const response = await fetch(dataUrl);
          if (response.ok) {
            const staticData = await response.json();
            if (Array.isArray(staticData) && staticData.length > 0) {
              setEmployees(staticData);
              // Optionally save this to local storage so it persists for this user
              // localStorage.setItem('qr_app_data', JSON.stringify(staticData));
            }
          } else {
            console.log('Static data not found or empty');
          }
        } catch (error) {
          console.log('Error loading static data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('qr_app_data', JSON.stringify(employees));
    }
  }, [employees, loading]);

  const importExcel = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Normalize keys to lowercase and map to expected structure
          const formattedData = jsonData.map((row) => {
            // Helper to find key case-insensitively
            const getValue = (key) => {
              const foundKey = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase());
              return foundKey ? row[foundKey] : '';
            };

            return {
              id: getValue('id') || getValue('cédula') || Math.random().toString(36).substr(2, 9), // Fallback ID
              cargo: getValue('cargo'),
              brigada: getValue('brigada'),
              nombre: getValue('nombre'),
              cedula: getValue('cedula') || getValue('cédula'),
              departamento: getValue('departamento'),
              municipio: getValue('municipio'),
              localidad: getValue('localidad'),
              coordinador: getValue('coordinador'),
              photo: null // Initialize photo as null
            };
          });

          // Merge with existing data (avoid duplicates based on ID/Cedula?)
          // For now, just replace or append. Let's append but filter duplicates by ID if possible.
          // Actually, user might want to clear and reload. Let's just setEmployees for now, or append.
          // "Importar la lista" implies loading it.
          setEmployees(formattedData);
          toast.success(`Se importaron ${formattedData.length} registros`);
          resolve(formattedData);
        } catch (error) {
          toast.error('Error al leer el archivo Excel');
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const updatePhoto = (id, photoBase64) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, photo: photoBase64 } : emp
    ));
    toast.success('Foto actualizada');
  };

  const getEmployeeById = (id) => {
    return employees.find(emp => String(emp.id) === String(id));
  };

  const clearData = () => {
    if (window.confirm('¿Estás seguro de borrar todos los datos?')) {
      setEmployees([]);
      toast.success('Datos eliminados');
    }
  };

  const exportJson = () => {
    const dataStr = JSON.stringify(employees, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup_qr_data.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Copia de seguridad descargada');
  };

  return (
    <DataContext.Provider value={{ 
      employees, 
      importExcel, 
      updatePhoto, 
      getEmployeeById,
      clearData,
      exportJson
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
