import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL + "aforos/";

export default function GraficaAforosPorPotrero({ potreroId }: { potreroId: number }) {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setDatos([]);
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}?potrero=${potreroId}`);

        // Agrupar por fecha sumando la materia seca
        const agrupados = res.data.reduce((acc: Record<string, any>, curr) => {
          const fecha = curr.fecha;
          if (!acc[fecha]) {
            acc[fecha] = { fecha, materia_seca_kg_ha: 0 };
          }
          acc[fecha].materia_seca_kg_ha += curr.materia_seca_kg_ha;
          return acc;
        }, {});

        const sumados = Object.values(agrupados).sort(
          (a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );

        setDatos(sumados);
      } catch (error) {
        console.error("Error al cargar los aforos del potrero:", error);
      } finally {
        setLoading(false);
      }
    };

    if (potreroId) fetchData();
  }, [potreroId]);

  if (loading) {
    return <p className="text-sm text-gray-500">Cargando datos...</p>;
  }

  if (!datos.length) {
    return <p className="text-sm text-gray-500">No hay datos de aforo para este potrero.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={datos}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
        <YAxis
          label={{ value: "kg/ha", angle: -90, position: "insideLeft" }}
          domain={["auto", "auto"]}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="materia_seca_kg_ha"
          stroke="#4ade80"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
