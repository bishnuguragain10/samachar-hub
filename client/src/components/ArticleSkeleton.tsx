import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
