import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../ui/button/Button";

interface Potrero {
  id: number;
  nombre: string;
}

const API_URL = import.meta.env.VITE_API_URL + "aforos/";
const POTREROS_URL = import.meta.env.VITE_API_URL + "potreros/";

export default function AforoCreateModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [potreros, setPotreros] = useState<Potrero[]>([]);
  const [form, setForm] = useState({
    potrero: "",
    fecha: new Date().toISOString().split("T")[0],
    materia_seca_kg_ha: 0,
    observaciones: "",
  });

  useEffect(() => {
    axios.get(POTREROS_URL).then((res) => setPotreros(res.data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "materia_seca_kg_ha" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(API_URL, form);
      onCreated();
      onClose();
    } catch (err) {
      console.error("❌ Error creando aforo:", err);
    }
  };

  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-50 z-99999" style={{ margin: 0, backgroundColor: "rgba(0, 0, 0, 0.66)", }} onClick={onClose}></div>

      <div className="fixed inset-0 z-99999 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Registrar Aforo</h2>

          <div className="space-y-4">
            <select
              name="potrero"
              value={form.potrero}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="">Selecciona un potrero</option>
              {potreros.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
            />

            <input
              type="number"
              name="materia_seca_kg_ha"
              value={form.materia_seca_kg_ha}
              onChange={handleChange}
              placeholder="Materia seca (kg/ha)"
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
            />

            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              placeholder="Observaciones"
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="primary" size="sm" onClick={handleSubmit}>Guardar</Button>
            <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          </div>
        </div>
      </div>
    </>
  );
}
