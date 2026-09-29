"use client";

import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/inquiry/whatsapp";
import { track } from "@/lib/inquiry/analytics";

/**
 * Desktop opens WhatsApp Web; phones and tablets open the app (wa.me).
 * Starts as "app" so server and first client render agree, then upgrades.
 */
function useWhatsAppTarget(): "app" | "web" {
  const [target, setTarget] = useState<"app" | "web">("app");
  useEffect(() => {
    const handheld = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.matchMedia("(pointer: coarse)").matches;
    if (!handheld) setTarget("web");
  }, []);
  return target;
}

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> & {
  /** Plain-text message; encoded here. */
  text: string;
  /** Where the click came from — sent with whatsapp_clicked. */
  from: string;
  trackProps?: Record<string, string | number | boolean | undefined>;
};

export default function WhatsAppLink({ text, from, trackProps, onClick, children, ...rest }: Props) {
  const target = useWhatsAppTarget();
  return (
    <a
      data-cursor="WHATSAPP"
      {...rest}
      href={whatsappLink(text, target)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        track("whatsapp_clicked", { from, ...trackProps });
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
