"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import InquiryCta from "@/components/inquiry/InquiryCta";
import WhatsAppLink from "@/components/inquiry/WhatsAppLink";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { GREETING } from "@/lib/inquiry/whatsapp";
import styles from "./BookSlotBanner.module.css";

export default function BookSlotBanner() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      gsap.fromTo(
        el.querySelectorAll("[data-banner-fade]"),
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section} aria-label="Book A Slot">
      <div className={`container ${styles.inner}`}>
        <div className={styles.card}>
          <div className={styles.content}>
            <div className={styles.tag} data-banner-fade>
              <span className={styles.pulseDot} aria-hidden="true" />
              <span className={styles.tagText}>CALENDAR 2026–2027 · LIMITED SLOTS</span>
            </div>

            <h2 className={`serif ${styles.heading}`} data-banner-fade>
              WHERE MOMENTS BECOME HEIRLOOMS.
            </h2>

            <p className={styles.subtext} data-banner-fade>
              Wedding Photography &nbsp;·&nbsp; Cinematic Films &nbsp;·&nbsp; Celebrations
            </p>

            <div className={styles.actions} data-banner-fade>
              <InquiryCta source="book_slot_banner" primary boxed cursor="BEGIN" className={styles.bookBtn}>
                BOOK A SLOT
              </InquiryCta>
              <WhatsAppLink text={GREETING} from="book_slot_banner" className={styles.waBtn}>
                <WhatsAppIcon size={20} />
                <span>CHAT ON WHATSAPP</span>
              </WhatsAppLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
