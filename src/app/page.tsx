import { getFilms } from "@/lib/films";
import Preloader from "@/components/motion/Preloader";
import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import BrandStatement from "@/components/sections/BrandStatement";
import ImageReveal from "@/components/sections/ImageReveal";
import CinematicFilms from "@/components/sections/CinematicFilms";
import Portfolio from "@/components/sections/Portfolio";
import PortfolioStory from "@/components/sections/PortfolioStory";
import Approach from "@/components/sections/Approach";
import StoriesByType from "@/components/sections/StoriesByType";
import Testimonials from "@/components/sections/Testimonials";
import GlobalPresence from "@/components/sections/GlobalPresence";
import Investment from "@/components/sections/Investment";
import NextSteps from "@/components/sections/NextSteps";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/sections/Footer";

export const revalidate = 86400;

export default async function Page() {
  const films = await getFilms();

  return (
    <>
      <Preloader />
      <Navigation />
      <main>
        {/* 01  HERO */}
        <Hero />
        {/* 02  IMMEDIATE PROOF / BRAND POSITIONING */}
        <BrandStatement />
        {/* 03  WHAT WE CAPTURE */}
        <ImageReveal />
        {/* 04  CINEMATIC FILMS */}
        <CinematicFilms films={films} />
        {/* 05  PORTFOLIO / REAL STORIES */}
        <Portfolio />
        {/* 06  THE WEDDING EXPERIENCE */}
        <PortfolioStory />
        {/* 07  OUR APPROACH — 01 / 02 / 03 */}
        <Approach />
        {/* 08  STORIES BY TYPE */}
        <StoriesByType />
        {/* 09  TESTIMONIALS */}
        <Testimonials />
        {/* 10  NORTH AMERICA · INDIA · DESTINATIONS */}
        <GlobalPresence />
        {/* 11  INVESTMENT / CUSTOM EXPERIENCE */}
        <Investment />
        {/* 12  WHAT HAPPENS NEXT */}
        <NextSteps />
        {/* 13  FAQ */}
        <Faq />
        {/* 14  CHECK YOUR DATE / INQUIRY */}
        <Contact />
        {/* 15  FINAL CINEMATIC CTA */}
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
