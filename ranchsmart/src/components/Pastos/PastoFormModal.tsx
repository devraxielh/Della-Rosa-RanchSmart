import { useState } from "react";
import axios from "axios";
import Button from "../ui/button/Button";

interface Pasto {
  id: number;
  nombre: string;
}

const API_URL = import.meta.env.VITE_API_URL + "pastos/";

export default function PastoFormModal({
  pasto,
  onClose,
}: {
  pasto: Pasto;
  onClose: () => void;
}) {
  const [nombre, setNombre] = useState(pasto.nombre);

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}${pasto.id}/`, { nombre });
      onClose();
    } catch (err) {
      console.error("❌ Error al actualizar pasto:", err);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("¿Eliminar este pasto?");
    if (!confirm) return;

    try {
      await axios.delete(`${API_URL}${pasto.id}/`);
      onClose();
    } catch (err) {
      console.error("❌ Error al eliminar pasto:", err);
    }
  };

  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-50 z-99999" style={{ margin: 0, backgroundColor: "rgba(0, 0, 0, 0.66)", }} onClick={onClose}></div>

      <div className="fixed inset-0 z-999999 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Editar Pasto</h2>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del pasto"
            className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
          />
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
