export function PlaceholderContent({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-32 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
      {label} — coming soon
    </div>
  );
}
