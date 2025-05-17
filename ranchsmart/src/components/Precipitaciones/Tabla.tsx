import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import PrecipitacionFormModal from "./PrecipitacionFormModal";
import PrecipitacionCreateModal from "./PrecipitacionCreateModal";
import Button from "../ui/button/Button";

interface Precipitacion {
  id: number;
  fecha: string;
  milimetros: number;
  observaciones: string | null;
}

const API_URL = import.meta.env.VITE_API_URL + "precipitaciones/";

export default function BasicTablePrecipitaciones() {
  const [data, setData] = useState<Precipitacion[]>([]);
  const [filtro, setFiltro] = useState("");
  const [seleccionado, setSeleccionado] = useState<Precipitacion | null>(null);
  const [modalCrear, setModalCrear] = useState(false);

  const cargar = async () => {
    try {
      const res = await axios.get(API_URL);
      setData(res.data);
    } catch (err) {
      console.error("❌ Error cargando precipitaciones:", err);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const filtradas = data.filter((p) =>
    p.fecha.includes(filtro)
  );

  return (
    <div className="space-y-4">
      {/* Filtro y botón de crear */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
        <input
          type="text"
          placeholder="🔍 Filtrar por fecha (YYYY-MM-DD)"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full sm:w-1/3 px-4 py-2 text-sm border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />

        <Button variant="primary" size="sm" onClick={() => setModalCrear(true)}>
          Nuevo registro
        </Button>
      </div>

      {modalCrear && (
        <PrecipitacionCreateModal
          onClose={() => setModalCrear(false)}
          onCreated={cargar}
        />
      )}

      {seleccionado && (
        <PrecipitacionFormModal
          precipitacion={seleccionado}
          onClose={() => {
            setSeleccionado(null);
            cargar();
          }}
        />
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableCell isHeader className="px-6 py-3 text-sm text-gray-800 dark:text-white">
                  Fecha
                </TableCell>
                <TableCell isHeader className="px-6 py-3 text-sm text-gray-800 dark:text-white">
                  Milímetros
                </TableCell>
                <TableCell isHeader className="px-6 py-3 text-sm text-gray-800 dark:text-white">
                  Observaciones
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtradas.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="px-6 py-3 text-sm text-gray-800 dark:text-white">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSeleccionado(p)}
                    >
                      {p.fecha}
                    </Button>
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm text-gray-800 dark:text-white">
                    {p.milimetros.toFixed(1)} mm
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm text-gray-800 dark:text-white">
                    {p.observaciones || "Sin observaciones"}
                  </TableCell>
                </TableRow>
              ))}
              {filtradas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center px-6 py-3 text-sm text-gray-800 dark:text-white">
                    No se encontraron registros.
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
