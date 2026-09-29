import { getFilms } from "@/lib/films";
import Preloader from "@/components/motion/Preloader";
import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import BrandStatement from "@/components/sections/BrandStatement";
import ImageReveal from "@/components/sections/ImageReveal";
import Portfolio from "@/components/sections/Portfolio";
import CinematicFilms from "@/components/sections/CinematicFilms";
import PortfolioStory from "@/components/sections/PortfolioStory";
import GlobalPresence from "@/components/sections/GlobalPresence";
import Approach from "@/components/sections/Approach";
import Testimonials from "@/components/sections/Testimonials";
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
        <Hero />
        <BrandStatement />
        <ImageReveal />
        <Portfolio />
        <CinematicFilms films={films} />
        <PortfolioStory />
        <GlobalPresence />
        <Approach />
        <Testimonials />
        <Investment />
        <NextSteps />
        <Faq />
        <Contact />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
