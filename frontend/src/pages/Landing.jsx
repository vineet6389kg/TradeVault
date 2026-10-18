import React from "react";
import Navbar from "../components/landing/Navbar";

const Landing = () => {
  return (
    <>
      <Navbar />
      <section id="features" className="h-screen p-10 text-2xl">Features section</section>
      <section id="how" className="h-screen bg-surface p-10 text-2xl">How it works section</section>
      <section id="stack" className="h-screen p-10 text-2xl">Tech stack section</section>
      <section id="contact" className="h-screen bg-surface p-10 text-2xl">Contact section</section>
    </>
  );
};

export default Landing;