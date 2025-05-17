import MapaPotrerosLive from "../../components/MapaPotrerosLive";
import MapaPotrerosAforo from "../../components/Aforo/MapaPotrerosAforo";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta title="RanchSmart" description="Panel principal de monitoreo ganadero" />

      <div className="grid grid-cols-12 gap-6 px-4 xl:px-8 mt-4">
        {/* Mapa de la finca */}
        <div className="col-span-12">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              🗺️ Mapa de la finca
            </h2>
            <MapaPotrerosLive />
          </section>
        </div>

        {/* Aforo + Info */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              🌿 Aforo de potreros
            </h2>
            <MapaPotrerosAforo />
          </section>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] h-full">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              🐄 Info Hatos
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Aquí irá la información sobre los hatos.</p>
          </section>
        </div>

        {/* Recomendaciones */}
        <div className="col-span-12">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              💡 Recomendaciones
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Aquí aparecerán las recomendaciones basadas en los datos.</p>
          </section>
        </div>
      </div>
    </>
  );
}
