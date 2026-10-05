import Link from "next/link";
import { brand, contact, nav } from "@/content/site";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} data-floating-cta-hide="">
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <span className={`serif ${styles.wordmark}`}>
            {brand.wordmark[0]}
            <br />
            <span className={styles.wordmarkSub}>{brand.wordmark[1]}</span>
          </span>
          <span className="meta-sm">{brand.regions.join(" · ")}</span>
        </div>

        <nav className={styles.col} aria-label="Footer">
          <span className={`meta-sm ${styles.colTitle}`}>NAVIGATION</span>
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={styles.link} data-cursor="EXPLORE">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <span className={`meta-sm ${styles.colTitle}`}>SOCIAL MEDIA</span>
          <ul className={styles.socialList}>
            <li>
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                data-cursor="EXPLORE"
                aria-label="Studio Kunal on Instagram"
              >
                <span className={styles.iconWrap} aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </span>
                <span className={styles.socialText}>INSTAGRAM</span>
                <span className={styles.arrow} aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <a
                href={contact.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                data-cursor="EXPLORE"
                aria-label="Studio Kunal on YouTube"
              >
                <span className={styles.iconWrap} aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
                  </svg>
                </span>
                <span className={styles.socialText}>YOUTUBE</span>
                <span className={styles.arrow} aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                data-cursor="EXPLORE"
                aria-label="Studio Kunal on WhatsApp"
              >
                <span className={styles.iconWrap} aria-hidden="true">
                  <WhatsAppIcon size={16} />
                </span>
                <span className={styles.socialText}>WHATSAPP</span>
                <span className={styles.arrow} aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <span className={`meta-sm ${styles.colTitle}`}>CONTACT</span>
          <a href={`mailto:${contact.email}`} className={`${styles.link} ${styles.email}`} data-cursor="EXPLORE">
            {contact.email}
          </a>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span className="meta-sm champagne">{brand.booking}</span>
        <span className="meta-sm">{brand.copyright}</span>
      </div>
    </footer>
  );
}
