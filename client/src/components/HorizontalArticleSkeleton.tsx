import { Skeleton } from "@/components/ui/skeleton";

export default function HorizontalArticleSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="w-20 h-14 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}
