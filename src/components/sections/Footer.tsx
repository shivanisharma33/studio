import Link from "next/link";
import { brand, contact, nav } from "@/content/site";
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
          <span className={`meta-sm ${styles.colTitle}`}>SOCIAL</span>
          <ul>
            <li>
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className={styles.link} data-cursor="EXPLORE">
                INSTAGRAM
              </a>
            </li>
            <li>
              <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className={styles.link} data-cursor="EXPLORE">
                WHATSAPP
              </a>
            </li>
            <li>
              <a href={contact.youtube} target="_blank" rel="noopener noreferrer" className={styles.link} data-cursor="EXPLORE">
                YOUTUBE
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
