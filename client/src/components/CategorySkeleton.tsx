export default function CategorySkeleton() {
  return (
    <div className="space-y-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2 px-2 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
          <div className="w-3.5 h-3.5 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}
