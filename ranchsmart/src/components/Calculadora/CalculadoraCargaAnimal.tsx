import { useState } from "react";

export default function CalculadoraCargaAnimal() {
  const [area, setArea] = useState(0); // en hectáreas
  const [animales, setAnimales] = useState(0);
  const [pesoPromedio, setPesoPromedio] = useState(0);
  const [carga, setCarga] = useState<number | null>(null);

  const calcular = () => {
    if (area > 0 && animales > 0 && pesoPromedio > 0) {
      const ugg = (animales * pesoPromedio) / (450 * area);
      setCarga(parseFloat(ugg.toFixed(2)));
    } else {
      setCarga(null);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
      <h2 className="text-lg font-semibold dark:text-white">Calculadora de Carga Animal</h2>

      <input
        type="number"
        value={area}
        onChange={(e) => setArea(parseFloat(e.target.value))}
        placeholder="Área del potrero (ha)"
        className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
      />

      <input
        type="number"
        value={animales}
        onChange={(e) => setAnimales(parseInt(e.target.value))}
        placeholder="Número de animales"
        className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
      />

      <input
        type="number"
        value={pesoPromedio}
        onChange={(e) => setPesoPromedio(parseFloat(e.target.value))}
        placeholder="Peso promedio (kg)"
        className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
      />

      <button
        onClick={calcular}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Calcular Carga Animal
      </button>

      {carga !== null && (
        <div className="mt-4 text-center text-lg font-medium dark:text-white">
          Carga animal: <span className="text-blue-500">{carga} UGG/ha</span>
        </div>
      )}
    </div>
  );
}
