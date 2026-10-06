"use client";

import Arrow from "@/components/ui/Arrow";
import { useInquiry } from "./InquiryProvider";
import WhatsAppLink from "./WhatsAppLink";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { GREETING } from "@/lib/inquiry/whatsapp";
import { track } from "@/lib/inquiry/analytics";
import styles from "./FloatingInquire.module.css";

/**
 * Constant "CHECK YOUR DATE" CTA with a WhatsApp companion.
 * Pinned and constant across all screen sizes (iPhone, Android, Desktop).
 * Only hides when the inquiry modal itself is open.
 */
export default function FloatingInquire() {
  const { open, isOpen, hasProgress } = useInquiry();

  return (
    <div
      className={styles.wrap}
      data-inquiry-open={isOpen ? "true" : "false"}
      aria-hidden={isOpen}
    >
      <a
        href="#get-in-touch"
        className={styles.btn}
        tabIndex={isOpen ? -1 : 0}
        aria-haspopup="dialog"
        data-inquiry=""
        data-cursor="BEGIN"
        onClick={(e) => {
          e.preventDefault();
          track("sticky_cta_clicked");
          open("sticky");
        }}
      >
        <span className={styles.dot} aria-hidden="true" />
        <span>{hasProgress ? "CONTINUE YOUR INQUIRY" : "CHECK YOUR DATE"}</span>
        <Arrow />
      </a>
      <WhatsAppLink
        text={GREETING}
        from="floating"
        className={styles.wa}
        tabIndex={isOpen ? -1 : 0}
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon size={46} className={styles.waIcon} />
      </WhatsAppLink>
    </div>
  );
}
