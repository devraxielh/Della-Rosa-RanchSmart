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
import PotreroFormModal from "./PotreroFormModal";
import Button from "../../components/ui/button/Button";

interface Pasto {
  id: number;
  nombre: string;
}

interface Potrero {
  id: number;
  nombre: string;
  coordenadas: number[][];
  estado: number;
  area_m2: number;
  pasto: number | null;
  pasto_info: Pasto | null;
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
  const [potreroSeleccionado, setPotreroSeleccionado] = useState<Potrero | null>(null);

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
      <input
        type="text"
        placeholder="🔍 Filtrar por nombre..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full max-w-sm px-4 py-2 text-sm border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />

      {potreroSeleccionado && (
        <PotreroFormModal
          potrero={potreroSeleccionado}
          onClose={() => {
            setPotreroSeleccionado(null);
            cargarPotreros();
          }}
        />
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableCell isHeader className="px-6 py-3 text-left font-semibold text-sm text-gray-600 dark:text-gray-300">
                  Nombre
                </TableCell>
                <TableCell isHeader className="px-6 py-3 text-left font-semibold text-sm text-gray-600 dark:text-gray-300">
                  Estado
                </TableCell>
                <TableCell isHeader className="px-6 py-3 text-left font-semibold text-sm text-gray-600 dark:text-gray-300">
                  Área (m²)
                </TableCell>
                <TableCell isHeader className="px-6 py-3 text-left font-semibold text-sm text-gray-600 dark:text-gray-300">
                  Pasto
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {potrerosFiltrados.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="px-6 py-3 text-left text-sm text-blue-600">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setPotreroSeleccionado(p)}
                    >
                    {p.nombre}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge size="sm" color={estadoColor(p.estado)}>
                      {estadoTexto(p.estado)}
                    </Badge>
                  </TableCell>
                  <TableCell>{p.area_m2.toFixed(2)} m²</TableCell>
                  <TableCell>{p.pasto_info ? p.pasto_info.nombre : "Sin pasto"}</TableCell>
                </TableRow>
              ))}
              {potrerosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>No se encontraron potreros.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}