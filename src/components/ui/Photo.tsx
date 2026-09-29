import Image from "next/image";
import type { Photo as PhotoT } from "@/content/media";

type Props = {
  photo: PhotoT;
  sizes: string;
  priority?: boolean;
  className?: string;
  quality?: number;
  style?: React.CSSProperties;
};

/**
 * Full-bleed cover photograph. Always `fill` + object-fit: cover so the
 * composition is decided by the frame, not the file's aspect ratio.
 */
export default function Photo({ photo, sizes, priority, className, quality = 78, style }: Props) {
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={quality}
      className={className}
      style={{ objectFit: "cover", objectPosition: "center", ...style }}
    />
  );
}
