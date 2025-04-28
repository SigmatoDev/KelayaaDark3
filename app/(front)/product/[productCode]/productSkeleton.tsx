// components/ProductDetailsSkeleton.tsx
export default function ProductDetailsSkeleton() {
  return (
    <div className="animate-pulse p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 h-96 bg-gray-300 rounded-lg" />
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-gray-300 rounded w-3/4" />
          <div className="h-6 bg-gray-300 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="space-y-2 pt-4">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
          <div className="h-12 bg-gray-300 rounded mt-6 w-40" />
        </div>
      </div>
    </div>
  );
}
