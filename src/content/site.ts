/**
 * SINGLE SOURCE OF TRUTH — all copy below is taken verbatim from
 * https://studiokunalphotography.com (crawled 2026-09-29).
 * Nothing here is invented. If it is not on the live site, it is not here.
 */

export const SITE_URL = "https://studiokunalphotography.com";

export const brand = {
  name: "Studio Kunal Photography",
  wordmark: ["STUDIO KUNAL", "PHOTOGRAPHY"],
  regions: ["NORTH AMERICA", "INDIA"],
  headline: "From North America to India, We Capture Stories That Last Forever",
  /** Verbatim brand description from the homepage. */
  description:
    "Studio Kunal Photography is an international photography company dedicated to capturing timeless stories with authenticity and emotion. With a cinematic approach and an eye for genuine moments, we transform real emotions into lasting memories. We are proudly based across North America and India, offering seamless photography and cinematography services for couples worldwide. With a deep understanding of diverse cultures, traditions, and wedding celebrations, we bring a global perspective while preserving the authenticity of every moment. Our approach will always inclined towards — timeless storytelling, genuine emotions, and cinematic excellence.",
  /** Sentence-level fragments of the description, used where a shorter statement is needed. */
  statements: {
    intro:
      "Studio Kunal Photography is an international photography company dedicated to capturing timeless stories with authenticity and emotion.",
    cinematic:
      "With a cinematic approach and an eye for genuine moments, we transform real emotions into lasting memories.",
    reach:
      "We are proudly based across North America and India, offering seamless photography and cinematography services for couples worldwide.",
    cultures:
      "With a deep understanding of diverse cultures, traditions, and wedding celebrations, we bring a global perspective while preserving the authenticity of every moment.",
    approach:
      "Our approach will always inclined towards — timeless storytelling, genuine emotions, and cinematic excellence.",
  },
  positioning: ["DOCUMENTARY", "EDITORIAL", "CINEMATIC"],
  booking: "Bookings Open for 2026–2027",
  bookingLine:
    "Bookings Open for 2026–2027 | Documentary & Editorial Style Wedding Photography | Cinematic Storytelling | Timeless Memories | Limited Dates Available",
  limitedDates: "Limited Dates Available",
  metaDescription:
    "Studio Kunal Photography is wedding photography in Canada, dedicated to capturing timeless stories with authenticity and emotion. With a cinematic approach and an eye for genuine moments, we transform real emotions into lasting memories. We are proudly based across North America and India.",
  copyright: "All copyright reserved by Studio Kunal Photography",
};

export const contact = {
  email: "kkunalphotoarts@gmail.com",
  whatsapp: "https://wa.me/19057822743",
  instagram: "https://www.instagram.com/studiokunal_photography/?hl=en",
  youtube: "https://www.youtube.com/@StudioKunalPhotographyCanada",
  heading: "We’re so glad you found us!",
  intro:
    "Feel free to fill out the form below or reach out to us directly via email. If you’re looking to book an appointment, please share as many details as you can about your requirements—this helps us understand your vision better.",
  intro2:
    "We’ll do our best to get back to you as soon as possible and look forward to connecting with you.",
  success: "Your message was successfully sent!",
  submit: "Submit",
};

export const nav = [
  { n: "01", label: "MAIN", href: "#main" },
  { n: "02", label: "CINEMATIC FILMS", href: "#cinematic-films" },
  { n: "03", label: "PORTFOLIO", href: "#portfolio" },
  { n: "04", label: "STORIES BY TYPE", href: "#stories-by-type" },
  { n: "05", label: "TESTIMONIALS", href: "#testimonials" },
  { n: "06", label: "INVESTMENT", href: "#investment" },
  { n: "07", label: "GET IN TOUCH", href: "#get-in-touch" },
];

export const cta = {
  seeOurMagic: "EXPLORE PORTFOLIO",
  explorePortfolio: "EXPLORE PORTFOLIO",
  letsConnect: "LETS CONNECT",
  viewStory: "VIEW STORY",
  viewFullStory: "VIEW THE FULL STORY",
  playFilm: "PLAY FILM",
  watchTheFilm: "WATCH THE FILM",
  getInTouch: "GET IN TOUCH",
  discussYourStory: "DISCUSS YOUR STORY",
};

/** Portfolio — exact titles and live gallery URLs from the Portfolio page. */
export const portfolio = [
  { n: "01", title: "Aman & Mrinal", slug: "aman-mrinal" },
  { n: "02", title: "Nooreen & Jugraj", slug: "nooreen-jugraj" },
  { n: "03", title: "Deep & Payal", slug: "deep-payal" },
  { n: "04", title: "Varinder & Param at Noor Mahal", slug: "varinder-param-at-noor-mahal" },
  { n: "05", title: "The House of Rituals- India", slug: "the-house-of-rituals-india" },
  { n: "06", title: "The Fashion Vault", slug: "the-fashion-vault" },
  { n: "07", title: "Akshita & Rajat", slug: "akshita-rajat-a-lovestory-from-toronto-downtown" },
  { n: "08", title: "Raman & Akash- Love Straight Outta Panjab", slug: "raman-akash-love-straight-outta-panjab" },
] as const;

export type PortfolioItem = (typeof portfolio)[number];

/**
 * Cinematic Films — the nine YouTube videos embedded on
 * https://studiokunalphotography.com/cinematicfilms, in page order.
 * Titles are the real YouTube titles where they could be verified;
 * the rest are resolved at build time via YouTube oEmbed (see lib/films.ts)
 * and otherwise shown as a numbered film — never invented.
 */
export const films = [
  { id: "qhmxcS6rbzY", title: "Glimpse from Parth & Zeal || Mehndi Ceremony || Studio Kunal Photography Canada" },
  { id: "GE4RwB_Ezf8", title: null },
  { id: "PK30ZglbXJQ", title: "Harkeet & Nina || Fall in love : Again & Again || Eshoot || Studio Kunal Photography Canada" },
  { id: "EEFd2OHEV6A", title: null },
  { id: "V50vQEXenaE", title: null },
  { id: "MkhER4Ob6dA", title: null },
  { id: "ZT4f1XDbmDg", title: null },
  { id: "4djvYWzA-LY", title: null },
  { id: "YBAhqOTVLH4", title: null },
] as const;

export type Film = { id: string; title: string | null };

export interface Testimonial {
  couple: string;
  location: string;
  event: string;
  source: "google" | "instagram" | "client";
  sourceLabel: string;
  rating: number;
  paragraphs: string[];
  gallerySlug?: string;
  link?: string;
}

/** Testimonials — verbatim from https://studiokunalphotography.com/testimonials, in page order. */
export const testimonials: Testimonial[] = [
  {
    couple: "Harkeet & Nina",
    location: "Toronto, Canada",
    event: "Wedding & E-Shoot",
    source: "instagram",
    sourceLabel: "Featured on Instagram",
    rating: 5,
    link: "https://www.instagram.com/p/DZaq028J3vH/",
    paragraphs: [
      "Studio Kunal Photography did an amazing job with our wedding! Kunal and his team were professional, easy to work with, and made everything feel comfortable throughout the entire process. They captured so many great moments from our wedding, and we’re extremely happy with how everything turned out.",
      "Would definitely recommend Studio Kunal Photography to anyone looking for a reliable and talented photo/video team for their wedding. Thank you again to Kunal and the entire team for capturing such an important day for us!",
    ],
  },
  {
    couple: "Deep & Payal",
    location: "Punjab & Delhi, India",
    event: "Pre-Wedding to Reception",
    source: "google",
    sourceLabel: "Verified Google Review",
    rating: 5,
    gallerySlug: "deep-payal",
    paragraphs: [
      "We cannot thank our photographer enough for the incredible work he did throughout our entire wedding journey — from the pre-wedding shoot to Haldi, Mehndi, wedding ceremonies, and reception. Every single picture came out absolutely beautiful, clear, and full of life. Whenever we look at the photos, it genuinely feels like we are reliving those moments all over again.",
      "What made the experience even more special was how smooth and stress-free the entire process was. He guided us so calmly and patiently through every event, always letting us know what to do and making us feel comfortable in front of the camera. His professionalism, creativity, and positive energy truly stood out.",
      "More than just a photographer, he became like family to us during this journey. The care, dedication, and effort he put into capturing every emotion and detail meant so much to us and our families.",
      "A huge thank you for giving us memories that we will cherish forever. We are beyond grateful and would highly recommend him to anyone looking for someone who captures not just pictures, but emotions and moments perfectly.",
      "Thank you kunal ❤️❤️",
    ],
  },
  {
    couple: "Hiral & Hardik",
    location: "Ontario, Canada",
    event: "Wedding Celebration",
    source: "google",
    sourceLabel: "Verified Google Review",
    rating: 5,
    paragraphs: [
      "Absolutely loved their work. Fantastic art, very efficient, consistent and joy to work with. I would highly recommend Studio Kunal if you’re looking for reliable, superb and professional services. Awesome photos and videos. Loved it.",
    ],
  },
  {
    couple: "Antarjot & Harleen",
    location: "Vancouver, BC",
    event: "Surprise Proposal & Wedding",
    source: "google",
    sourceLabel: "Verified Google Review",
    rating: 5,
    paragraphs: [
      "We had an incredible experience with Studio Kunal for both our pre-wedding and wedding shoots. Not only did he capture every moment beautifully, but he also went above and beyond by personally taking care of the dresses we selected, ensuring they looked perfect in every shot. He even curated the songs for our highlight videos, adding a personal touch that made our memories even more special. On top of that, he helped plan a surprise proposal with my husband, which was an unforgettable moment for me. His creativity, attention to detail, and professionalism truly made the whole experience amazing. Highly recommend him for any occasion.",
    ],
  },
  {
    couple: "Akshita & Rajat",
    location: "Downtown Toronto, ON",
    event: "Downtown Pre-Wedding Shoot",
    source: "google",
    sourceLabel: "Verified Google Review",
    rating: 5,
    gallerySlug: "akshita-rajat-a-lovestory-from-toronto-downtown",
    paragraphs: [
      "Amazing job by Kunal! He did a fantastic job with our pre-wedding photoshoot in Toronto. Kunal was very professional, patient, and made us feel comfortable throughout the shoot. He captured every moment beautifully and the pictures turned out perfect. His attention to detail and creativity really shows in his work. Highly recommend Kunal Studio Photography for anyone looking to capture their special moments!",
    ],
  },
  {
    couple: "Simran & Amogh",
    location: "Toronto, Ontario",
    event: "Surprise Proposal Shoot",
    source: "google",
    sourceLabel: "Verified Google Review",
    rating: 5,
    paragraphs: [
      "I couldn’t be happier with the energy and enthusiasm Kunal brought to my proposal shoot! He was incredibly kind and made the entire experience feel so natural and enjoyable. Despite it being our first time taking professional photos, Kunal went above and beyond to ensure both my fiancé and I felt completely comfortable. His warmth and professionalism truly made this special moment even more memorable. Highly recommend!",
    ],
  },
  {
    couple: "Jennifer & Vinayak",
    location: "Toronto, Canada",
    event: "Full Wedding & Cinematic Film",
    source: "google",
    sourceLabel: "Verified Google Review",
    rating: 5,
    paragraphs: [
      "We had the pleasure of working with Kunal and his Team t for our wedding, and they truly exceeded all expectations. From photography to videography, they captured every moment with incredible creativity and attention to detail.",
      "One of the standout aspects of their work was the artistic flair they brought to both the photos and video. Every frame felt thoughtful and beautifully composed, telling the story of our special day in a way that felt personal and cinematic.",
      "The editing was exceptional—natural, elegant, and perfectly timed. We were also really impressed with their turnaround time; everything was delivered promptly without compromising on quality.",
      "Most importantly, Kunal and his team were professional, warm, and easy to work with throughout the entire process. They made us feel completely at ease in front of the camera and blended seamlessly into the day.",
      "We’re so grateful to have had them document such an important chapter of our lives, and we would wholeheartedly recommend them to anyone looking for a talented and reliable wedding team.",
      "Thank you, Kunal and his team, for turning our memories into something truly timeless.",
    ],
  },
  {
    couple: "Nisha & Jonpreet",
    location: "Calgary, Canada",
    event: "Wedding Gallery Preview",
    source: "client",
    sourceLabel: "Direct Client Note",
    rating: 5,
    paragraphs: [
      "“Oh my God, we absolutely love the photos! 😍” From the moment we saw the preview images, we were completely blown away. Every picture captured the emotions and special moments so beautifully. The attention to detail, the natural expressions, and the way everything was framed truly shows your passion and talent.",
      "Working with you and the team was such a wonderful experience, and the results speak for themselves. We honestly can’t stop looking at the photos and reliving those moments again and again. We’re already so impressed with the previews and can’t wait to see the full gallery!",
    ],
  },
  {
    couple: "Rubal & Ajwinder",
    location: "Punjab & Canada",
    event: "Pre-Wedding Editorial Shoot",
    source: "google",
    sourceLabel: "Verified Google Review",
    rating: 5,
    paragraphs: [
      "We had the pleasure of working with Studio Kunal Photography for our pre-wedding shoot, and the experience was nothing short of amazing! Kunal and his team are true professionals with a keen eye for detail and a creative approach that made every shot feel magical.",
      "From the very beginning, they made us feel comfortable and guided us through poses and locations, ensuring we looked our absolute best. The team was punctual, patient, and went above and beyond to capture the essence of our relationship in every frame.",
      "The photos turned out breathtakingly beautiful, with stunning edits that perfectly captured the emotions and atmosphere of the moment. They truly have a gift for storytelling through their lens, and their work exceeded all our expectations.",
      "If you’re looking for a photographer who is talented, friendly, and dedicated to delivering exceptional results, Studio Kunal Photography is the way to go. Highly recommended for any couple looking to create lasting memories!",
    ],
  },
];

export const investment = {
  body:
    "Rather than fixed packages, every proposal is thoughtfully tailored to your vision, location, and celebration — ensuring a truly bespoke experience.",
  /** The Investment page embeds this film. */
  filmId: "PK30ZglbXJQ",
  title: "Harkeet & Nina — Fall in Love Again & Again",
};

/** FAQ — verbatim from the Get In Touch page (bold markers kept as **text**). */
export const faq = {
  heading: "Q&A",
  intro:
    "Frequently asked questions from clients and answers to them. If you have any questions, let us know either while filling up the form or during the consultation.",
  items: [
    {
      n: "01",
      label: "DELIVERY TIMELINE",
      q: "What is the delivery timeline for photos and videos?",
      a: "Our standard delivery timeline for the **final gallery is 10–12 weeks** after your event. This allows us to carefully review, select, and professionally edit each image to ensure the highest quality and storytelling experience.",
    },
    {
      n: "02",
      label: "PHOTOGRAPHY STYLE",
      q: "What photography style do we follow?",
      a: "Our approach is centered around **understanding your vision first**. We believe every couple and every celebration is unique, so we take the time to learn about your inspiration, preferences, and story. By combining **your vision with our artistic approach**, we carefully curate memories that feel natural, timeless, and truly personal.",
    },
    {
      n: "03",
      label: "CUSTOMISED PACKAGES",
      q: "Do you offer customised packages?",
      a: "Yes. Every event is different, which is why we provide **customised packages tailored to your needs, vision, and celebration**. Once we understand your event details, we create a proposal that best fits your requirements.",
    },
    {
      n: "04",
      label: "DESTINATION WEDDINGS",
      q: "Do we travel for destination weddings?",
      a: "Yes, absolutely. We love capturing weddings in different locations and cultures. **Studio Kunal Photography operates across North America and India**, and we are always excited to travel for destination weddings and special events.",
    },
    {
      n: "05",
      label: "HOW TO BOOK",
      q: "How a client can book us for their event?",
      a: "You can simply fill out the **Get in Touch** form on our website with your event details. Once we receive your inquiry, we will connect with you to discuss your requirements and guide you through the booking process.",
    },
  ],
};

export interface StoryFrame {
  word: string;
  tagline: string;
}

/** Editorial frames for the visual story sequence — curated to match each photograph. */
export const storyFrames: StoryFrame[] = [
  {
    word: "THE LAUGHTER",
    tagline: "Unfiltered joy and celebration as two families unite",
  },
  {
    word: "THE INTIMACY",
    tagline: "A quiet, tender whisper beneath timeless architectural arches",
  },
  {
    word: "THE FREEDOM",
    tagline: "Barefoot romance and effortless laughter by the open water",
  },
  {
    word: "THE DEVOTION",
    tagline: "Sacred traditions, gentle grace, and deep affection",
  },
  {
    word: "THE GRANDEUR",
    tagline: "Couture elegance and breathtaking architectural majesty",
  },
  {
    word: "THE SERENITY",
    tagline: "Golden hour warmth and a lifelong promise by the shore",
  },
];

export const storyWords = storyFrames.map((f) => f.word);

/** Approach — the brand's own positioning words, paired with its own sentences. */
export const approach = [
  { n: "01", title: "TIMELESS STORYTELLING", body: brand.statements.intro },
  { n: "02", title: "GENUINE EMOTIONS", body: brand.statements.cinematic },
  { n: "03", title: "CINEMATIC EXCELLENCE", body: brand.statements.cultures },
];

export const approachTicker = [
  "AUTHENTICITY",
  "DIVERSE CULTURES",
  "TRADITIONS",
  "WEDDING CELEBRATIONS",
  "GLOBAL PERSPECTIVE",
  "TIMELESS STORYTELLING",
  "GENUINE EMOTIONS",
  "CINEMATIC EXCELLENCE",
];
