"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { SITE_URL } from "@/content/site";
import { galleries } from "@/content/media";
import { storyGalleries } from "@/content/stories";
import Arrow from "@/components/ui/Arrow";
import { useStory } from "@/components/portfolio/StoryProvider";
import styles from "./StoriesByType.module.css";

const CATEGORIES = [
  { id: "all", label: "ALL STORIES" },
  { id: "weddings", label: "WEDDINGS" },
  { id: "pre-wedding", label: "PRE-WEDDING" },
  { id: "editorial", label: "EDITORIAL & TRADITIONS" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

interface StoryItem {
  id: string;
  title: string;
  subtitle: string;
  category: CategoryId;
  categoryLabel: string;
  location: string;
  slug: string;
  imgSrc: string;
}

const STORIES: StoryItem[] = [
  {
    id: "01",
    title: "Whispering Pines",
    subtitle: "Anand Karaj Under Shaded Woodland Canopies",
    category: "weddings",
    categoryLabel: "WEDDING",
    location: "ONTARIO, CANADA",
    slug: "forest-anand-karaj",
    imgSrc: "/images/curated-forest-wedding.jpg",
  },
  {
    id: "02",
    title: "Cathedral Grandeur",
    subtitle: "Emerald Velvet, Historic Arches & Timeless Steps",
    category: "pre-wedding",
    categoryLabel: "PRE-WEDDING",
    location: "DOWNTOWN TORONTO",
    slug: "cathedral-grandeur",
    imgSrc: "/images/curated-cathedral-steps.jpg",
  },
  {
    id: "03",
    title: "Noir & Stone Archway",
    subtitle: "High Fashion, Monochromatic Drama & Sacred Silence",
    category: "pre-wedding",
    categoryLabel: "PRE-WEDDING",
    location: "HISTORIC ESTATE",
    slug: "noir-archway-embrace",
    imgSrc: "/images/curated-noir-archway.jpg",
  },
  {
    id: "04",
    title: "The Royal Bride",
    subtitle: "Crimson Silk, Intricate Henna & Sacred Vows",
    category: "editorial",
    categoryLabel: "TRADITIONS",
    location: "HERITAGE COLLECTION",
    slug: "royal-heritage-bride",
    imgSrc: "/images/curated-royal-bride.jpg",
  },
  {
    id: "05",
    title: "Aman & Mrinal",
    subtitle: "Sacred Vows & Timeless Elegance",
    category: "weddings",
    categoryLabel: "WEDDING",
    location: "TORONTO, CANADA",
    slug: "aman-mrinal",
    imgSrc: storyGalleries["aman-mrinal"]?.images[2] || galleries["aman-mrinal"][0].src,
  },
  {
    id: "06",
    title: "Deep & Payal",
    subtitle: "Haldi, Mehndi & Royal Grandeur",
    category: "weddings",
    categoryLabel: "WEDDING",
    location: "CANADA & INDIA",
    slug: "deep-payal",
    imgSrc: storyGalleries["deep-payal"]?.images[3] || galleries["deep-payal"][0].src,
  },
  {
    id: "07",
    title: "Akshita & Rajat",
    subtitle: "A Love Story from Toronto Downtown",
    category: "pre-wedding",
    categoryLabel: "PRE-WEDDING",
    location: "DOWNTOWN TORONTO",
    slug: "akshita-rajat-a-lovestory-from-toronto-downtown",
    imgSrc: storyGalleries["akshita-rajat-a-lovestory-from-toronto-downtown"]?.images[3] || galleries["akshita-rajat-a-lovestory-from-toronto-downtown"][0].src,
  },
  {
    id: "08",
    title: "Varinder & Param",
    subtitle: "Palace Celebration at Noor Mahal",
    category: "weddings",
    categoryLabel: "WEDDING",
    location: "NOOR MAHAL, INDIA",
    slug: "varinder-param-at-noor-mahal",
    imgSrc: storyGalleries["varinder-param-at-noor-mahal"]?.images[3] || galleries["varinder-param-at-noor-mahal"][0].src,
  },
  {
    id: "09",
    title: "Raman & Akash",
    subtitle: "Love Straight Outta Panjab",
    category: "pre-wedding",
    categoryLabel: "PRE-WEDDING",
    location: "PUNJAB, INDIA",
    slug: "raman-akash-love-straight-outta-panjab",
    imgSrc: storyGalleries["raman-akash-love-straight-outta-panjab"]?.images[3] || galleries["raman-akash-love-straight-outta-panjab"][0].src,
  },
  {
    id: "10",
    title: "The Fashion Vault",
    subtitle: "Editorial Lighting & Haute Couture",
    category: "editorial",
    categoryLabel: "EDITORIAL",
    location: "STUDIO ARCHIVE",
    slug: "the-fashion-vault",
    imgSrc: storyGalleries["the-fashion-vault"]?.images[3] || galleries["the-fashion-vault"][0].src,
  },
  {
    id: "11",
    title: "Nooreen & Jugraj",
    subtitle: "Intimate Memories & Joyful Celebrations",
    category: "weddings",
    categoryLabel: "WEDDING",
    location: "NORTH AMERICA",
    slug: "nooreen-jugraj",
    imgSrc: storyGalleries["nooreen-jugraj"]?.images[3] || galleries["nooreen-jugraj"][0].src,
  },
  {
    id: "12",
    title: "The House of Rituals",
    subtitle: "Heritage, Customs & Authentic Soul",
    category: "editorial",
    categoryLabel: "TRADITIONS",
    location: "INDIA",
    slug: "the-house-of-rituals-india",
    imgSrc: storyGalleries["the-house-of-rituals-india"]?.images[3] || galleries["the-house-of-rituals-india"][0].src,
  },
];

export default function StoriesByType() {
  const root = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<CategoryId>("all");
  const { openStory } = useStory();

  const filtered =
    activeTab === "all" ? STORIES : STORIES.filter((s) => s.category === activeTab);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q(`.${styles.title} .line > span`),
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.5,
            ease: "expo.out",
            stagger: 0.14,
            scrollTrigger: { trigger: q(`.${styles.title}`)[0], start: "top 80%", once: true },
          }
        );
      });

      mm.add(MQ.reduced, () => {
        gsap.set(q(".line > span"), { yPercent: 0 });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="stories-by-type" className={`section ${styles.wrap}`} aria-labelledby="stories-type-title">
      <div className="container">
        <div className={styles.head}>
          <div>
            <p className="meta-sm" data-reveal>
              08 &nbsp;—&nbsp; STORIES BY TYPE
            </p>
            <h2 id="stories-type-title" className={`serif ${styles.title}`}>
              <span className="line">
                <span>CURATED</span>
              </span>
              <span className="line">
                <span className={styles.italic}>COLLECTIONS</span>
              </span>
            </h2>
          </div>
          <p className={`serif-i ${styles.lede}`} data-reveal>
            From heritage weddings to intimate pre-wedding journeys.
          </p>
        </div>

        {/* Filter Pills */}
        <div className={styles.filterRow} role="tablist" aria-label="Stories categories">
          {CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.filterBtn} ${isActive ? styles.filterActive : ""}`}
                onClick={() => setActiveTab(cat.id)}
                data-cursor="SELECT"
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Grid of Stories */}
        <div className={styles.grid}>
          {filtered.map((item, i) => (
            <button
              type="button"
              key={item.id}
              onClick={() => openStory(item.slug)}
              className={styles.card}
              data-cursor="VIEW STORY"
              data-reveal
              style={{ ["--d" as string]: `${(i % 3) * 0.08}s`, textAlign: "left", cursor: "pointer" }}
            >
              <div className={styles.thumbWrap}>
                <Image
                  src={item.imgSrc}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 680px) 46vw, 100vw"
                  className={styles.thumb}
                />
                <div className={styles.thumbShade} />
                <div className={styles.cardTop}>
                  <span className={styles.badgeCategory}>{item.categoryLabel}</span>
                  <span className={styles.badgeLocation}>{item.location}</span>
                </div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <span className={`meta-sm ${styles.cardNum}`}>{item.id}</span>
                  <h3 className={`serif ${styles.cardTitle}`}>{item.title}</h3>
                </div>
                <p className={styles.cardSub}>{item.subtitle}</p>
                <div className={styles.cardFooter}>
                  <span className={`meta-sm ${styles.cardAction}`}>
                    VIEW STORY <Arrow />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
