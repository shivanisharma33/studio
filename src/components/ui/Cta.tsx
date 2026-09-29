import Link from "next/link";
import Arrow from "./Arrow";

type Props = {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  boxed?: boolean;
  external?: boolean;
  className?: string;
  cursor?: string;
  magnetic?: boolean;
};

export default function Cta({
  href,
  children,
  primary,
  boxed,
  external,
  className,
  cursor = "EXPLORE",
  magnetic = true,
}: Props) {
  const cls = ["cta", primary && "cta--primary", boxed && "cta--boxed", className].filter(Boolean).join(" ");
  const common = {
    className: cls,
    "data-cursor": cursor,
    "data-magnetic": magnetic ? "" : undefined,
  };
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...common}>
        <span>{children}</span>
        <Arrow />
      </a>
    );
  }
  return (
    <Link href={href} {...common}>
      <span>{children}</span>
      <Arrow />
    </Link>
  );
}
