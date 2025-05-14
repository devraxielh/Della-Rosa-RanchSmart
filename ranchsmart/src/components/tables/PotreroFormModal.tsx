import { useEffect, useState } from "react";
import axios from "axios";
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
}

const API_URL = import.meta.env.VITE_API_URL + "potreros/";
const PASTO_URL = import.meta.env.VITE_API_URL + "pastos/";

export default function PotreroFormModal({
  potrero,
  onClose,
}: {
  potrero: Potrero;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Potrero>(potrero);
  const [pastos, setPastos] = useState<Pasto[]>([]);

  useEffect(() => {
    const fetchPastos = async () => {
      try {
        const res = await axios.get(PASTO_URL);
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setPastos(data);
      } catch (err) {
        console.error("❌ Error cargando pastos:", err);
        setPastos([]);
      }
    };
    fetchPastos();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "estado"
          ? parseInt(value)
          : name === "area_m2"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}${form.id}/`, form);
      onClose();
    } catch (err) {
      console.error("❌ Error al guardar:", err);
    }
  };

  const handleDelete = async () => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este potrero?");
    if (!confirmar) return;

    try {
      await axios.delete(`${API_URL}${form.id}/`);
      onClose();
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
    }
  };

  return (
    <>
      {/* Fondo oscuro */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-99999" style={{ margin: 0, backgroundColor: "rgba(0, 0, 0, 0.66)", }} onClick={onClose}></div>


      {/* Modal */}
      <div className="fixed inset-0 z-999999 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">
            Editar Potrero
          </h2>

          <div className="space-y-4">
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
            />
            <input
              name="area_m2"
              type="number"
              value={form.area_m2}
              onChange={handleChange}
              placeholder="Área en m²"
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
            />
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
            >
              <option value={0}>Inactivo</option>
              <option value={1}>En descanso</option>
              <option value={2}>Ocupado</option>
            </select>
            <select
              name="pasto"
              value={form.pasto ?? ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
            >
              {Array.isArray(pastos) &&
                pastos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
            </select>
          </div>

          <div className="mt-6 flex justify-between">
            <Button
              size="sm"
              variant="primary"
              onClick={handleSave}
            >
              Guardar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
            >
              Eliminar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}