import React from 'react';
import Hero from '../../Components/MainComponents/Home/Hero';
import Trust from '../../Components/MainComponents/Home/Trust';
import Category from '../../Components/MainComponents/Home/Category';
import Features from '../../Components/MainComponents/Home/Features';
import CTASection from '../../Components/MainComponents/Home/CTA';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">

      {/* --- HERO SECTION --- */}
      <Hero />

      {/* --- TRUST BANNER --- */}
      <Trust />

      {/* --- CORE SERVICES CATEGORIES --- */}
      <Category />

      {/* --- THE NEW PLATFORM FEATURES SPOTLIGHT --- */}
      <Features />

      {/* --- FOOTER CTA --- */}
      <CTASection />
    </div>
  );
};

export default Home;