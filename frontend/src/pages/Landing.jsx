import React from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import TechStack from "../components/landing/TechStack";

const Landing = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <TechStack />

      {/* temporary, the footer replaces this in the next step */}
      <section id="contact" className="bg-surface p-10 text-2xl">
        Contact / footer section
      </section>
    </>
  );
};

export default Landing;