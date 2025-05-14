import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import TablaPotreros from "../components/tables/Potreros";

export default function Blank() {
  return (
    <div>
      <PageMeta
        title=""
        description=""
      />
      <PageBreadcrumb pageTitle="Potreros" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full">
            <TablaPotreros />
        </div>
      </div>
    </div>
  );
}
