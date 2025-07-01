import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

type HatoInfo = {
  raza: string;
  cantidad: number;
};

const datosSimulados: HatoInfo[] = [
  { raza: 'Brahman', cantidad: 120 },
  { raza: 'Holstein', cantidad: 85 },
  { raza: 'Gyr', cantidad: 60 },
  { raza: 'Jersey', cantidad: 40 },
  { raza: 'Normando', cantidad: 25 },
];

const InfoHatos = () => {
  const [datos, setDatos] = useState<HatoInfo[]>([]);

  useEffect(() => {
    // Simulación de carga de datos
    setTimeout(() => {
      setDatos(datosSimulados);
    }, 1000);
  }, []);

  const total = datos.reduce((acc, curr) => acc + curr.cantidad, 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-4">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">🐄</span>
        <h2 className="text-xl font-semibold dark:text-white">Info Hatos</h2>
      </div>

      <p className="text-gray-600 dark:text-gray-300">
        Actualmente hay un total de <span className="font-bold">{total}</span> animales distribuidos por raza.
      </p>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="raza" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InfoHatos;