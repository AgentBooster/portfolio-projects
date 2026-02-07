import React from 'react';
// Los hooks de estado (useState, useInView) y el WhatsAppWidget ya no son necesarios aquí
import Hero from '../components/Hero';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import Treatments from '../components/Treatments';
import Faq from '../components/Faq';
import AboutUs from '../components/AboutUs';
import CTA from '../components/CTA';

// La página Home ahora es un componente más "simple".
// Recibe las funciones que necesita (props) desde su componente padre, App.jsx.
function Home({ openChat, ctaRef }) {
  return (
    <>
      {/* Pasa la función openChat a los componentes que la necesiten */}
      <Hero openChat={openChat} />
      <WhyChooseUs />
      <AboutUs openChat={openChat} />
      <Treatments openChat={openChat} />
      <Testimonials />
      <Faq />

      {/* La referencia para detectar el CTA en el viewport se pasa aquí */}
      <div ref={ctaRef}>
        <CTA openChat={openChat} />
      </div>
    </>
  );
}

export default Home;
