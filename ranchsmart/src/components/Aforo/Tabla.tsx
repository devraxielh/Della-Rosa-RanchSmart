import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import AforoFormModal from "./AforoFormModal";
import AforoCreateModal from "./AforoCreateModal";

const API_URL = import.meta.env.VITE_API_URL + "aforos/";

export default function BasicTableAforos() {
  const [aforos, setAforos] = useState<AforoPasto[]>([]);
  const [filtro, setFiltro] = useState("");
  const [seleccionado, setSeleccionado] = useState<AforoPasto | null>(null);
  const [modalCrear, setModalCrear] = useState(false);

  const cargar = async () => {
    try {
      const res = await axios.get(API_URL);
      setAforos(res.data);
    } catch (err) {
      console.error("❌ Error cargando aforos:", err);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const filtrados = aforos.filter((a) =>
    a.potrero_nombre?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
        <input
          type="text"
          placeholder="🔍 Filtrar por potrero"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full sm:w-1/3 px-4 py-2 text-sm border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
        <Button variant="primary" size="sm" onClick={() => setModalCrear(true)}>
          Nuevo registro
        </Button>
      </div>

      {modalCrear && (
        <AforoCreateModal
          onClose={() => setModalCrear(false)}
          onCreated={cargar}
        />
      )}

      {seleccionado && (
        <AforoFormModal
          aforo={seleccionado}
          onClose={() => {
            setSeleccionado(null);
            cargar();
          }}
        />
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableCell isHeader className="px-6 py-3 text-sm text-gray-800 dark:text-white">Potrero</TableCell>
                <TableCell isHeader className="px-6 py-3 text-sm text-gray-800 dark:text-white">Fecha</TableCell>
                <TableCell isHeader className="px-6 py-3 text-sm text-gray-800 dark:text-white">Materia seca (kg/ha)</TableCell>
                <TableCell isHeader className="px-6 py-3 text-sm text-gray-800 dark:text-white">Observaciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="px-6 py-3 text-sm text-gray-800 dark:text-white">
                    <Button variant="outline" size="sm" onClick={() => setSeleccionado(a)}>
                      {a.potrero_nombre}
                    </Button>
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm text-gray-800 dark:text-white">{a.fecha}</TableCell>
                  <TableCell className="px-6 py-3 text-sm text-gray-800 dark:text-white">{a.materia_seca_kg_ha.toFixed(1)}</TableCell>
                  <TableCell className="px-6 py-3 text-sm text-gray-800 dark:text-white">{a.observaciones || "—"}</TableCell>
                </TableRow>
              ))}
              {filtrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-4">No se encontraron aforos.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
