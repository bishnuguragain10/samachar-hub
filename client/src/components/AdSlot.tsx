interface AdSlotProps {
  type: "banner" | "sidebar" | "in-article" | "footer";
  className?: string;
}

const AD_SIZES: Record<AdSlotProps["type"], { width: string; height: string; label: string }> = {
  banner: { width: "728px", height: "90px", label: "Advertisement · 728×90" },
  sidebar: { width: "300px", height: "250px", label: "Advertisement · 300×250" },
  "in-article": { width: "100%", height: "250px", label: "Advertisement · In-Article" },
  footer: { width: "728px", height: "90px", label: "Advertisement · 728×90" },
};

export default function AdSlot({ type, className = "" }: AdSlotProps) {
  const size = AD_SIZES[type];

  return (
    <div
      className={`ad-slot overflow-hidden ${className}`}
      style={{ maxWidth: size.width, height: size.height }}
      data-ad-slot={type}
      aria-label="Advertisement"
    >
      {/* 
        Replace this div with Google AdSense code:
        <ins class="adsbygoogle"
          style="display:block"
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins>
      */}
      <div className="text-center p-2">
        <div className="text-xs text-muted-foreground/60 mb-1">ADVERTISEMENT</div>
        <div className="text-xs text-muted-foreground/40">{size.label}</div>
      </div>
    </div>
  );
}
