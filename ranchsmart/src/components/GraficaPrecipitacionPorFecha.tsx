import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL + 'precipitaciones/';

type Precipitacion = {
  id: number;
  fecha: string;
  milimetros: number;
  observaciones?: string;
};

const GraficaPrecipitacionPorFecha = () => {
  const [datos, setDatos] = useState<Precipitacion[]>([]);

  const cargarDatos = async () => {
    try {
      const res = await axios.get(API_URL);
      const datosOrdenados = res.data
        .map((p: Precipitacion) => ({
          ...p,
          fecha: new Date(p.fecha).toISOString().split('T')[0]
        }))
        .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      setDatos(datosOrdenados);
    } catch (err) {
      console.error('❌ Error cargando precipitaciones:', err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="w-full h-96 bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Histórico de precipitaciones</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis label={{ value: 'mm', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="milimetros" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficaPrecipitacionPorFecha;