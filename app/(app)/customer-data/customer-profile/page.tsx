import { CustomerProfileTable } from "./components/CustomerProfileTable";

export default function CustomerProfilePage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Customer Profile</h1>
      </div>
      <CustomerProfileTable />
    </div>
  );
}
