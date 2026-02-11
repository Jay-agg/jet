import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import HeroClouds from "@/components/HeroClouds";
import FlyInLuxury from "@/components/FlyInLuxury";
import FeaturesAccordion from "@/components/FeaturesAccordion";
import DestinationsMarquee from "@/components/DestinationsMarquee";
import GlobeFooter from "@/components/GlobeFooter";
import FloatingBookButton from "@/components/FloatingBookButton";

export default function Home() {
  return (
    <SmoothScroll>
      <Header />
      <FloatingBookButton />
      <main className="w-full min-h-screen">
        <HeroClouds />
        <FlyInLuxury />
        <FeaturesAccordion />
        <DestinationsMarquee />
        <GlobeFooter />
      </main>
    </SmoothScroll>
  );
}
