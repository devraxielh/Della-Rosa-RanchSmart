import { useState } from "react";
import axios from "axios";
import Button from "../ui/button/Button";

interface Precipitacion {
  id: number;
  fecha: string;
  milimetros: number;
  observaciones: string | null;
}

const API_URL = import.meta.env.VITE_API_URL + "precipitaciones/";

export default function PrecipitacionFormModal({
  precipitacion,
  onClose,
}: {
  precipitacion: Precipitacion;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Precipitacion>(precipitacion);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "milimetros" ? parseFloat(value) : value,
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
    const confirmar = window.confirm("¿Eliminar este registro de precipitación?");
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
      <div className="fixed inset-0 bg-black bg-opacity-50 z-99999" style={{ margin: 0, backgroundColor: "rgba(0, 0, 0, 0.66)", }} onClick={onClose}></div>

      <div className="fixed inset-0 z-99999 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Editar Precipitación</h2>

          <div className="space-y-4">
            <input
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
            />
            <input
              name="milimetros"
              type="number"
              step="0.1"
              value={form.milimetros}
              onChange={handleChange}
              placeholder="Cantidad en mm"
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
            />
            <textarea
              name="observaciones"
              value={form.observaciones ?? ""}
              onChange={handleChange}
              placeholder="Observaciones"
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="primary" size="sm" onClick={handleSave}>Guardar</Button>
            <Button variant="outline" size="sm" onClick={handleDelete}>Eliminar</Button>
            <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          </div>
        </div>
      </div>
    </>
  );
}
