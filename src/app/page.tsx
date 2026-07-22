import { SiteFooter } from "@/components/layout/SiteFooter";
import { FontVersionSwitcher } from "@/components/layout/FontVersionSwitcher";
import { AboutDfsa } from "@/sections/AboutDfsa";
import { AdditionalResources } from "@/sections/AdditionalResources";
import { DifcJourney } from "@/sections/DifcJourney";
import { Hero } from "@/sections/Hero";
import { LatestNews } from "@/sections/LatestNews";
import { OurApproach } from "@/sections/OurApproach";
import { SplashLoader } from "@/components/layout/SplashLoader";
import "@/styles/hero.css";
import "@/styles/news.css";
import "@/styles/about.css";
import "@/styles/approach.css";
import "@/styles/difc.css";
import "@/styles/resources.css";
import "@/styles/footer.css";

export default function Home() {
  return (
    <>
      <SplashLoader />
      <FontVersionSwitcher />
      <Hero />
      <LatestNews />
      <AboutDfsa />
      <OurApproach />
      <DifcJourney />
      <AdditionalResources />
      <SiteFooter />
    </>
  );
}
