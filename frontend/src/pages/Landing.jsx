import React from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import WhyChoose from "../components/landing/WhyChoose";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";

const Landing = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyChoose />
      <Features />
      <HowItWorks />

      {/* temporary, the footer replaces this in the next step */}
      <section id="contact" className="bg-surface p-10 text-2xl">
        Contact / footer section
      </section>
    </>
  );
};

export default Landing;