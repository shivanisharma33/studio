/**
 * MEDIA MAP — every image below is a real Studio Kunal photograph, referenced
 * from the studio's current CDN (i.wfolio.com) exactly as the live site links it.
 *
 * ▸ Swap any assignment here; nothing else in the codebase needs to change.
 * ▸ For production, download the originals into /public/images and replace
 *   the URLs (keeps the site independent of the old host). next/image handles
 *   WebP/AVIF, responsive sizes and lazy loading either way.
 * ▸ Picks below use each gallery's opening (cover) frame. They were selected
 *   by position, so curate them with the photographer before launch.
 */

const CDN =
  "https://i.wfolio.com/x/zfNWg0RActCaYvCdP8NS6h3QcKqIOO7I/oVCmpsR2A0_zCBuWQbm7dJYwNQ6ysoqE/";

const img = (path: string) => CDN + path;

export type Photo = { src: string; alt: string };

/** Homepage gallery, in the order the live homepage shows it. */
export const home: Photo[] = [
  "NPCRvUBd4ou7pN1Btv_iNjomoW-O0fqA/IptF9LcZLKTVe46k-yEDOrWEmaB4FZSC/Ge3h02MCeyl8wa1JzP_vvQ.jpg",
  "gJfsto3NwzwBRdJxj0_g7WGrTg2CCVlG/U4O1c2UfRX6zbGjB2YNShKhQu6zXeBuF/Mju13kqW_JYvwWPLfNR_tg.jpg",
  "dOT_LvlGVvr4UFjHe9mrQ9fItyKbQppL/vqFuP-RihAp94dCtl-VBQcnZOOCf3r1F/bdJAVACZhX3Wv1PkoYHfXA.jpg",
  "JQ7HvXdu1k0jhwCIrmmYihZGeGuVJe01/Xt-3xZeI1x1LY3gy27IxVRB_tcuGZDzk/7InG57a9o6a9FpJN-6JATg.png",
  "sySTSog3yoZzc-Kz4JQYoPCZaVyO8aG8/QySL44xseMnAFD0fEOX5QlHHxGYshvoC/7HDGkytWXw-w9VirL6QzPg.jpg",
  "KSo9N-Js6rANfx8waiDYsj5fAC73r4aH/u6bq-olhIPWfH3KH4FzDsZSAcHJufeaI/ujKof843N_KeylgAwXJDag.jpg",
  "mOnvPW6usVa2LzopRIblQKvZAOThlb3w/mmTAS4pTXzUpFnSU4kLKfwkDMoDm5qfx/hv8XfuXAwFo5t998JZdrbw.jpg",
  "UEP0hONaCrOYjMWsyz_2Dy8gUk5EULgz/eR1RBQd4SbD1aaV54ZTRvT9xUadv0Mbz/9vfjfqQOMAa2r_XBEEQ5fw.jpg",
  "OAipGqMFz0RlSt6UJWyfmnfcrtv5k9t_/IL3AZ50NQWiI-dze2NCnLZp7eL6aOiRf/n1yxbYPdByChHp9tEP64HQ.jpg",
  "gJfsto3NwzwBRdJxj0_g7Y2ws7k3B9ks/DCkj-RO-ppgT9BZM23y_44-7UditS-BZ/wfeHPv0MdC0qk8Ag5g1LoQ.jpg",
  "JQ7HvXdu1k0jhwCIrmmYijZ2n80o7oUE/C-l0pQlon2qh0bsSsp9A7fl_-pDR5-l3/UpHRMTTA2JJWEYTGae_b_Q.jpg",
  "NSPcCoWDzVQhRVPRsCb048tJ8xYM3Eq0/n_5Pqm2eDs-iZgEZTtvmpfVswHuGPXzw/__wknUfi7MeUL9Xo4zKegQ.jpg",
  "EeKdCQub1kwaHauPDqBZ9rFjmeBisHrd/XIPVDBKXvCt9sexh8AV9XySE7ctL-KTs/tQca8h9wX7oXYoy3xoyreg.jpg",
  "b7gT7oplz7-zBl7YLN5LEUA4Qhrcje7e/evOJ5xx78_5VysVY0TCjZU5eULGKc5gL/28hIIIsB29pDmmZLdPs0ZQ.jpg",
  "3zxGmwm0GRNkCZ6RuTR2QfmISBNEj-Bb/AB9oHJ5iUudu0QMW0DtIoFBRS1CQcxPZ/R-40TSFtW2CCuVZ-s3VfDQ.jpg",
  "AyF6cHhep9mr0pfuf6XvvHvwBssbG9oA/nQ5yJfGrRWbsb6YtrOIniQN6_YtKAQwt/bufcm5ArrZkqtmba3TypGw.jpg",
  "E62hLh0mH19ni7sDbwXB53EkargwlzjS/ngctyntqzXVny8xyGV37lYbakpX39vUs/kwXzNfcYBzJhdGfSpKI84A.png",
  "mFEIDadDqShITqw84w9DTynz6khvY2vJ/AA6oWlGZEeEGXqVziUg7pFbaseH1yrOJ/Ls9IZnpMTXAm14Wnjd7SXg.jpg",
  "eXv401Frygszo31K0qL_pXAidurj1SXn/b_SWafFX003UokeDty94ESKMvmUwBp3t/x3-uu6FRXTcE92UVIIi-Vg.jpg",
  "KXuNAUjBUK2hH1oN10XBRZj8w1sn0XIN/MejkmyehHGa-rq80LalWnEHrlmLIGSRN/jo7s5VLCdjE5dIPlv_Vj1A.jpg",
  "K5rbthTa4jShdRb9ksY_iy0nVg_43ryR/HyHA6RTw19F1Hqaq9mYAKve6_borctD-/xRbT6pANpXicgFMpP6_TPA.jpg",
  "t9gHdq1sLQ-s5KxcY1yYLZS5zOuW-uT8/0x1uBpw27Iv2ZWMti_IEaqpu1heCmqj1/iM6MlBsFs6aeuHlPcguA3A.jpg",
  "l3pLfOYQTSknvDjJ547NvRotkWicD3IK/nKQnj2q0iMP46tmmxn_HfglSNNtTWmce/_8Q1rEtMBbU3x7rjoqVbhw.jpg",
  "Z-ZJF1_L0KrZbp9icFgx3_aHFKMY2Pcl/tPz-C5A56awxEP_Q-H_UNqCRnGcjMIxf/vFhlOO0oIHbY0J_xVJ8Zvw.jpg",
].map((p, i) => ({ src: img(p), alt: `Studio Kunal Photography — wedding photograph ${i + 1}` }));

/** Opening two frames from each portfolio gallery, keyed by slug. */
export const galleries: Record<string, Photo[]> = {
  "aman-mrinal": [
    { src: "/images/new image.avif", alt: "Aman & Mrinal — Studio Kunal Photography" },
    { src: "/images/new2.avif", alt: "Aman & Mrinal — Studio Kunal Photography" },
  ],
  "nooreen-jugraj": [
    "zonjRRzSFjTi2FM2hUQQdx9v0MBRr8fn/LmOBw2cef8n5JPwTnpOQHSnQxqXrARJe/n7o-t3VIOFrhm9NWIEuEUQ.jpg",
    "OAipGqMFz0RlSt6UJWyfmuN5eukiGyrz/c7BUksFJJ21-hIw88zwlK3TSFI7Bg976/S9jE61FFHif78wgMoOvvbA.jpg",
  ].map((p) => ({ src: img(p), alt: "Nooreen & Jugraj — Studio Kunal Photography" })),
  "deep-payal": [
    "4PuneNShhIoqLDVXxPpjVaVB61v386U3/KhzQWimo8e12mOOIp1_vVkgy2rE0B6yp/i1g9dUSw_8LJr5arChDGdw.jpg",
    "I8y9JdsINiMJZjdQDtlTCnbZBzfFs1bp/J5AaJVp7FmAmJsuBueuyP52gENiN4m3M/dpEosmHkj-Fp8McKyqXZoQ.jpg",
  ].map((p) => ({ src: img(p), alt: "Deep & Payal — Studio Kunal Photography" })),
  "varinder-param-at-noor-mahal": [
    "OjM0BsGm0bC7CLK1nrfMPb5tyiBoah_5/tfKTzDPmE_Ml9EuhTJRYV1FEMB0OJ02L/KMDTN579Km1GHSRU6dB3EQ.jpg",
    "LVmThduQKYNtyEzHHQFWz2bhNXzkTJyJ/5dmtiE4uELpCSn_X_N3DUpuyxrlXqPaB/ovC27XW8ge31N2wIWkuaxg.jpg",
  ].map((p) => ({ src: img(p), alt: "Varinder & Param at Noor Mahal — Studio Kunal Photography" })),
  "the-house-of-rituals-india": [
    "prQz75zDMveZyWMR1Q49CcHxpqWD5N-H/QImuUyFtaMrKs1tFpDf6Z2OSWvpawcfp/tavswnwPnPLxbREAyRC-Cg.png",
    "OUXAJM7tSHkF8kfLDWF7iz6akvnv0Wmn/GLtTPNJmAqs39MczNRamyugPMvTzEdmL/ZvbfBR7zFiooN1m1BcHrqA.png",
  ].map((p) => ({ src: img(p), alt: "The House of Rituals- India — Studio Kunal Photography" })),
  "the-fashion-vault": [
    "XjHUMYx4f9_N61RRtL0oPQz898FPgvi_/meq89eWYGYp8qaZW2WbHSGU4rnOTFHb6/xEPx4RXcgb9BEL8orvQXkg.jpg",
    "DsizTkWSeBuFD4k06w3eRA9OIiVb3vtB/T-mKdXePsRN4h95LO_qjUspL0Dv2ha76/jBPnrfFnR0QqTgA_apDk4Q.jpg",
  ].map((p) => ({ src: img(p), alt: "The Fashion Vault — Studio Kunal Photography" })),
  "akshita-rajat-a-lovestory-from-toronto-downtown": [
    "dOT_LvlGVvr4UFjHe9mrQyZ9wyxecQVz/kxRC-tVmov7Cb3RXCUfLaCI1Y9ICvsid/vntLO4NumzpEl9xgazAT-Q.jpg",
    "xUCseFLYaVoV_LJ-iHVHV_qQwitPOY-Y/Zj2L-5NiPsH2PExFa5zM-dZO9tnMy6aB/9F6v_1bmT1MmGoqeG58SGg.jpg",
  ].map((p) => ({ src: img(p), alt: "Akshita & Rajat — Studio Kunal Photography" })),
  "raman-akash-love-straight-outta-panjab": [
    "fD0t61tekyl-AP1T3f_LUZRJM_a0bwEk/fdZX0cvPbGNZ669UL1pjeAqaN1IQwejk/Rmwwbg1RwZsKU1Y0Iyc80A.jpg",
    "OcpAFpijtZI_bulbOQFgDoKh4I3XMBwl/V2dy-QePa_AA1ZBPBoEHw75KpDKqhn51/m7hi41uQlC34AudQm5lTbQ.jpg",
  ].map((p) => ({ src: img(p), alt: "Raman & Akash- Love Straight Outta Panjab — Studio Kunal Photography" })),
  "forest-anand-karaj": [
    { src: "/images/curated-forest-wedding.jpg", alt: "Whispering Pines Anand Karaj — Studio Kunal Photography" },
    { src: "/images/curated-royal-bride.jpg", alt: "The Royal Bride — Studio Kunal Photography" },
  ],
  "cathedral-grandeur": [
    { src: "/images/curated-cathedral-steps.jpg", alt: "Cathedral Grandeur — Studio Kunal Photography" },
    { src: "/images/curated-noir-archway.jpg", alt: "Noir & Stone Archway — Studio Kunal Photography" },
  ],
  "noir-archway-embrace": [
    { src: "/images/curated-noir-archway.jpg", alt: "Noir & Stone Archway — Studio Kunal Photography" },
    { src: "/images/curated-cathedral-steps.jpg", alt: "Cathedral Grandeur — Studio Kunal Photography" },
  ],
  "royal-heritage-bride": [
    { src: "/images/curated-royal-bride.jpg", alt: "The Royal Bride — Studio Kunal Photography" },
    { src: "/images/curated-forest-wedding.jpg", alt: "Whispering Pines Anand Karaj — Studio Kunal Photography" },
  ],
};

/** YouTube poster frames are real frames from the studio's own films. */
export const youtubePoster = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
export const youtubePosterFallback = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/** Section assignments. */
export const media = {
  hero: {
    src: "/images/f2972483-4d84-40c4-8eef-624461921e77 (1).avif",
    alt: "Studio Kunal Photography — luxury documentary wedding photography",
  },
  reveal: home[1],
  story: [
    { ...home[2], alt: "Joyful bride and groom walking down the aisle with arms raised in laughter" },
    { ...home[4], alt: "Intimate black and white portrait of bride and groom beneath historic cathedral stone arches" },
    { ...home[5], alt: "Couple dancing and laughing barefoot by the open beach and water" },
    { ...home[6], alt: "Bride and groom in ornate Indian wedding attire resting foreheads together in gentle devotion" },
    { ...home[7], alt: "Regal portrait of bride in voluminous white gown cascading down stone stairs with groom" },
    { ...home[8], alt: "Couple standing in golden hour sunset warmth by tranquil waters and sandstone cliffs" },
  ],
  approach: [
    home[12],
    { src: "/images/approach-genuine-emotions.jpg", alt: "Genuine emotions intimate couple portrait — Studio Kunal Photography" },
    { src: "/images/approach-cinematic-excellence.jpg", alt: "Indian bride walking down the aisle — Studio Kunal Photography" },
  ],
  global: home[20],
  finalCta: home[22],
  investment: {
    src: youtubePoster("PK30ZglbXJQ"),
    alt: "Harkeet & Nina — Studio Kunal Photography Cinematic Film",
  },
  contact: { src: "/images/contact-couple-hd.jpg", alt: "Studio Kunal Photography bride and groom" },
};
