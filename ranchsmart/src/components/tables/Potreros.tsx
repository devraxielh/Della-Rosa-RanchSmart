import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import axios from "axios";

interface Potrero {
  id: number;
  nombre: string;
  coordenadas: number[][];
  estado: number;
  area_m2: number;
  pasto: string | null;
}

const API_URL = import.meta.env.VITE_API_URL + "potreros/";

const estadoTexto = (estado: number): string => {
  switch (estado) {
    case 1:
      return "En descanso";
    case 2:
      return "Ocupado";
    default:
      return "Inactivo";
  }
};

const estadoColor = (estado: number): "success" | "warning" | "error" => {
  switch (estado) {
    case 1:
      return "success";
    case 2:
      return "error";
    default:
      return "warning";
  }
};

export default function BasicTableOne() {
  const [potreros, setPotreros] = useState<Potrero[]>([]);
  const [filtro, setFiltro] = useState("");

  const cargarPotreros = async () => {
    try {
      const res = await axios.get(API_URL);
      setPotreros(res.data);
    } catch (err) {
      console.error("❌ Error cargando potreros:", err);
    }
  };

  useEffect(() => {
    cargarPotreros();
  }, []);

  const potrerosFiltrados = potreros.filter((p) =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Input de filtro */}
      <input
        type="text"
        placeholder="🔍 Filtrar por nombre..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full max-w-sm px-4 py-2 text-sm border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Nombre
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Estado
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Área (m²)
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Pasto
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {potrerosFiltrados.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white">
                    {p.nombre}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge size="sm" color={estadoColor(p.estado)}>
                      {estadoTexto(p.estado)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-600 dark:text-gray-300">
                    {p.area_m2.toFixed(2)} m²
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-600 dark:text-gray-300">
                    {p.pasto ?? "Sin pasto"}
                  </TableCell>
                </TableRow>
              ))}
              {potrerosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                    No se encontraron potreros.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}