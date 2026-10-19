import React from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import WhyChoose from "../components/landing/WhyChoose";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import Footer from "../components/landing/Footer";

const Landing = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyChoose />
      <Features />
      <HowItWorks />
      <Footer />
    </>
  );
};

export default Landing;