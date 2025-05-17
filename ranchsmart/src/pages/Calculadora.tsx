import { useState } from "react";

export default function CalculadoraCargaAnimalAvanzada() {
  const [area, setArea] = useState(0); // ha
  const [aforo, setAforo] = useState(0); // kg MS/ha
  const [animales, setAnimales] = useState(0);
  const [pesoPromedio, setPesoPromedio] = useState(0);
  const [dias, setDias] = useState(30); // días por defecto

  const [result, setResult] = useState<{
    forrajeTotal: number;
    consumoTotal: number;
    diasSostenibles: number;
    cargaUGG: number;
  } | null>(null);

  const calcular = () => {
    const forrajeTotal = area * aforo; // kg MS
    const consumoTotal = animales * pesoPromedio * 0.03 * dias; // 3% del peso vivo por día
    const diasSostenibles = Math.floor(forrajeTotal / (animales * pesoPromedio * 0.03));
    const cargaUGG = (animales * pesoPromedio) / (450 * area);

    setResult({
      forrajeTotal,
      consumoTotal,
      diasSostenibles,
      cargaUGG: parseFloat(cargaUGG.toFixed(2)),
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-6">
      <h2 className="font-bold text-center text-gray-700 dark:text-gray-300">
        📐 Calculadora de Carga Animal
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div>
    <label htmlFor="area" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      Área total (ha)
    </label>
    <input
      id="area"
      type="number"
      value={area}
      onChange={(e) => setArea(parseFloat(e.target.value))}
      placeholder="Área total (ha)"
      className="input-field"
    />
  </div>

  <div>
    <label htmlFor="aforo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      Aforo promedio (kg MS/ha)
    </label>
    <input
      id="aforo"
      type="number"
      value={aforo}
      onChange={(e) => setAforo(parseFloat(e.target.value))}
      placeholder="Aforo promedio"
      className="input-field"
    />
  </div>

  <div>
    <label htmlFor="animales" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      Cantidad de animales
    </label>
    <input
      id="animales"
      type="number"
      value={animales}
      onChange={(e) => setAnimales(parseInt(e.target.value))}
      placeholder="Cantidad de animales"
      className="input-field"
    />
  </div>

  <div>
    <label htmlFor="peso" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      Peso promedio (kg)
    </label>
    <input
      id="peso"
      type="number"
      value={pesoPromedio}
      onChange={(e) => setPesoPromedio(parseFloat(e.target.value))}
      placeholder="Peso promedio"
      className="input-field"
    />
  </div>

  <div>
    <label htmlFor="dias" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      Días de análisis
    </label>
    <input
      id="dias"
      type="number"
      value={dias}
      onChange={(e) => setDias(parseInt(e.target.value))}
      placeholder="Días de análisis"
      className="input-field"
    />
  </div>
</div>


      <button
        onClick={calcular}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        Calcular
      </button>

      {result && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 mt-4 shadow space-y-4">
          <p className="text-lg dark:text-white">
            🌿 <strong>Producción total:</strong>{" "}
            <span className="text-green-600 dark:text-green-400">
              {result.forrajeTotal.toLocaleString()} kg MS
            </span>
          </p>
          <p className="text-lg dark:text-white">
            🐄 <strong>Consumo total:</strong>{" "}
            <span className="text-red-600 dark:text-red-400">
              {result.consumoTotal.toLocaleString()} kg MS
            </span>
          </p>
          <p className="text-lg dark:text-white">
            📅 <strong>Días sostenibles:</strong>{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {result.diasSostenibles} días
            </span>
          </p>
          <p className="text-lg dark:text-white">
            🔢 <strong>Carga animal:</strong>{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              {result.cargaUGG} UGG/ha
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
