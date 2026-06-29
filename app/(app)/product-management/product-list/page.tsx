import ProductListTable from "./components/ProductListTable";

export default function ProductListPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Product List</h1>
      </div>

      <ProductListTable />
    </div>
  );
}
