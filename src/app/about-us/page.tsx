import AboutOurStory from "@/components/aboutus/aboutOurStory/AboutOurStory";
import Hero from "@/components/aboutus/hero/Hero";
import Newsletter from "@/components/aboutus/newsLetter/NewsLetter";
import OurStory from "@/components/aboutus/ourStory/OurStory";

export default function Home() {
  return (
    <div className="relative">
      <Hero />
      <OurStory />
      <Newsletter />
      <AboutOurStory />
    </div>
  );
}
