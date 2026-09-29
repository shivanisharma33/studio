"use client";

import Arrow from "@/components/ui/Arrow";
import { useInquiry } from "./InquiryProvider";

type Props = {
  /** Where on the page the CTA lives — sent with inquiry_opened. */
  source: string;
  children: React.ReactNode;
  primary?: boolean;
  boxed?: boolean;
  className?: string;
  cursor?: string;
  magnetic?: boolean;
};

/**
 * Every "let's connect" style CTA on the page renders this, so they all open
 * the same inquiry flow. It stays a real link to #get-in-touch, so without
 * JavaScript it still lands on the contact section.
 */
export default function InquiryCta({ source, children, primary, boxed, className, cursor = "EXPLORE", magnetic = true }: Props) {
  const { open } = useInquiry();
  const cls = ["cta", primary && "cta--primary", boxed && "cta--boxed", className].filter(Boolean).join(" ");
  return (
    <a
      href="#get-in-touch"
      className={cls}
      aria-haspopup="dialog"
      data-inquiry=""
      data-cursor={cursor}
      data-magnetic={magnetic ? "" : undefined}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        open(source);
      }}
    >
      <span>{children}</span>
      <Arrow />
    </a>
  );
}
