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
import PastoFormModal from "./PastoFormModal";
import PastoCreateModal from "./PastoCreateModal";

interface Pasto {
  id: number;
  nombre: string;
}

const API_URL = import.meta.env.VITE_API_URL + "pastos/";

export default function BasicTablePastos() {
  const [pastos, setPastos] = useState<Pasto[]>([]);
  const [filtro, setFiltro] = useState("");
  const [seleccionado, setSeleccionado] = useState<Pasto | null>(null);
  const [modalCrear, setModalCrear] = useState(false);

  const cargar = async () => {
    try {
      const res = await axios.get(API_URL);
      setPastos(res.data);
    } catch (err) {
      console.error("❌ Error cargando pastos:", err);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const filtrados = pastos.filter((p) =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
        <input
          type="text"
          placeholder="🔍 Filtrar por nombre"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full sm:w-1/3 px-4 py-2 text-sm border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
        <Button variant="primary" size="sm" onClick={() => setModalCrear(true)}>
          Nuevo registro
        </Button>
      </div>

      {modalCrear && (
        <PastoCreateModal
          onClose={() => setModalCrear(false)}
          onCreated={cargar}
        />
      )}

      {seleccionado && (
        <PastoFormModal
          pasto={seleccionado}
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
                <TableCell isHeader className="px-6 py-3 text-sm text-gray-800 dark:text-white">Nombre</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="px-6 py-3 text-sm text-gray-800 dark:text-white">
                    <Button variant="outline" size="sm" onClick={() => setSeleccionado(p)}>
                      {p.nombre}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtrados.length === 0 && (
                <TableRow>
                  <TableCell className="text-center text-gray-500 py-4">
                    No se encontraron pastos.
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
