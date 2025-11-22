import { Hero } from "@/components/Hero";
import { WhitelistRationale } from "@/components/WhitelistRationale";
import { Offer } from "@/components/Offer";
import { Footer } from "@/components/Footer";
import { Background } from "@/components/Background";
import { Countdown } from "@/components/Countdown";
import { ProgramDetails } from "@/components/ProgramDetails";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#050505]">
      <Background />
      <Hero />
      <Countdown />
      <WhitelistRationale />
      <Offer />
      <ProgramDetails />
      <Footer />
    </main>
  );
}
