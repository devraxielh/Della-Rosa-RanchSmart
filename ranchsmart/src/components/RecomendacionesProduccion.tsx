const RecomendacionesProduccion = () => {
  const indicadores = [
    { icono: '🐄', titulo: 'Hato con mayor producción', valor: 'Hato 3 - 27 L/día', color: 'green' },
    { icono: '🌧️', titulo: 'Precipitación semanal', valor: '35 mm', color: 'blue' },
    { icono: '📈', titulo: 'Tendencia de aforo', valor: '↑ 12% esta semana', color: 'yellow' },
    { icono: '🌱', titulo: 'Pasto en riesgo', valor: 'Potrero 2 - 900 kg/ha', color: 'red' },
    { icono: '📊', titulo: 'Índice de ocupación', valor: '70%', color: 'purple' },
    { icono: '🧪', titulo: 'Promedio calidad del pasto', valor: '78%', color: 'teal' },
    { icono: '📆', titulo: 'Rotación promedio', valor: '21 días', color: 'indigo' },
    { icono: '🍼', titulo: 'Producción total de leche', valor: '1,350 L/semana', color: 'sky' },
    { icono: '🧫', titulo: 'Índice de digestibilidad', valor: '64%', color: 'amber' },
    { icono: '🩺', titulo: 'Salud general del hato', valor: 'Buena', color: 'emerald' },
    { icono: '🚿', titulo: 'Nivel de humedad del suelo', valor: '54%', color: 'cyan' },
    { icono: '⚖️', titulo: 'Peso promedio ganado', valor: '432 kg', color: 'slate' },
    { icono: '🌡️', titulo: 'Temperatura promedio', valor: '29°C', color: 'rose' },
    { icono: '💩', titulo: 'Nivel de fertilización natural', valor: 'Moderado', color: 'zinc' },
    { icono: '🧮', titulo: 'Rendimiento esperado', valor: '2.1 kg/MS/día', color: 'fuchsia' },
    { icono: '🐂', titulo: 'Toros activos', valor: '12', color: 'orange' },
    { icono: '🐮', titulo: 'Vacas en lactancia', valor: '34', color: 'amber' },
    { icono: '👶', titulo: 'Terneros nacidos este mes', valor: '8', color: 'lime' },
    { icono: '⏳', titulo: 'Tiempo promedio en potrero', valor: '5.2 días', color: 'gray' },
    { icono: '📦', titulo: 'Inventario de suplementos', valor: '72%', color: 'blue' },
    { icono: '🧬', titulo: 'Índice genético promedio', valor: '0.78', color: 'cyan' },
    { icono: '🔬', titulo: 'Condición corporal promedio', valor: '3.5/5', color: 'emerald' },
    { icono: '💲', titulo: 'Ingreso proyectado semanal', valor: '$2,500,000', color: 'fuchsia' },
    { icono: '🧻', titulo: 'Frecuencia de desparasitación', valor: 'Cada 60 días', color: 'stone' },
    { icono: '🔋', titulo: 'Nivel de estrés térmico', valor: 'Bajo', color: 'rose' },
  ];

  const getColorClasses = (color: string) => {
    const base = {
      green: 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100',
      red: 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100',
      yellow: 'bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
      blue: 'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100',
      purple: 'bg-purple-50 dark:bg-purple-900 text-purple-800 dark:text-purple-100',
      teal: 'bg-teal-50 dark:bg-teal-900 text-teal-800 dark:text-teal-100',
      indigo: 'bg-indigo-50 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100',
      amber: 'bg-amber-50 dark:bg-amber-900 text-amber-800 dark:text-amber-100',
      sky: 'bg-sky-50 dark:bg-sky-900 text-sky-800 dark:text-sky-100',
      orange: 'bg-orange-50 dark:bg-orange-900 text-orange-800 dark:text-orange-100',
      lime: 'bg-lime-50 dark:bg-lime-900 text-lime-800 dark:text-lime-100',
      cyan: 'bg-cyan-50 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-100',
      emerald: 'bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100',
      fuchsia: 'bg-fuchsia-50 dark:bg-fuchsia-900 text-fuchsia-800 dark:text-fuchsia-100',
      rose: 'bg-rose-50 dark:bg-rose-900 text-rose-800 dark:text-rose-100',
      gray: 'bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100',
      stone: 'bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-100',
      slate: 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100',
      zinc: 'bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100',
    };
    return base[color as keyof typeof base] || 'bg-white text-black';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-6">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">💡</span>
        <h2 className="text-xl font-semibold dark:text-white">Recomendaciones</h2>
      </div>

      <p className="text-gray-600 dark:text-gray-300">
        Aquí aparecen indicadores clave simulados para la toma de decisiones en la producción ganadera:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {indicadores.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg shadow flex items-center space-x-4 ${getColorClasses(item.color)}`}
          >
            <span className="text-2xl">{item.icono}</span>
            <div>
              <p className="text-sm font-medium">{item.titulo}</p>
              <p className="text-lg font-bold">{item.valor}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecomendacionesProduccion;