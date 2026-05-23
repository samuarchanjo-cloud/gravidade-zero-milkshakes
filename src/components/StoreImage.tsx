"use client";

import { useMemo, useState } from "react";
import { getImageSrc } from "@/lib/images";
import { CosmicImageFallback } from "@/components/CosmicImageFallback";

type Props = {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
  fallbackLabel?: string;
  priority?: boolean;
};

export function StoreImage({
  src,
  alt,
  className,
  fallback,
  fallbackLabel,
  priority = false,
}: Props) {
  const displaySrc = useMemo(() => getImageSrc(src), [src]);
  const [failed, setFailed] = useState(false);

  if (!displaySrc || failed) {
    return (
      <>
        {fallback ?? <CosmicImageFallback label={fallbackLabel || alt} />}
      </>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
