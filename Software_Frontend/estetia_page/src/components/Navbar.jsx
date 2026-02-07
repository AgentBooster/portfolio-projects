import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function Navbar({ openChat }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ya no es necesario diferenciar isHomePage para los Links de navegación interna
  // Ya que todos usarán <Link to="/#id"> y el scroll se manejará globalmente en App.jsx

  const NavLinks = () => (
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
      <Link to="/#filosofia" className="hover:text-estetia-primary transition-colors">La Clínica</Link>
      <Link to="/#tratamientos" className="hover:text-estetia-primary transition-colors">Tratamientos</Link>
      <Link to="/#equipo" className="hover:text-estetia-primary transition-colors">Dra. Ana Pérez</Link>
      <button 
        onClick={openChat}
        className="bg-estetia-accent text-white px-5 py-2.5 rounded-full hover:bg-estetia-primary transition-colors shadow-lg"
      >
        Cita Previa
      </button>
    </div>
  );

  return (
    <nav className={`fixed w-full z-40 transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'}`}>
      <div className={`max-w-6xl mx-auto px-6 rounded-3xl transition-all duration-500 flex items-center justify-between ${scrolled ? 'bg-white/30 backdrop-blur-2xl shadow-2xl border border-white/20 mx-4' : 'bg-transparent'}`}>
        <Link to="/" className="text-2xl font-bold tracking-tight text-estetia-text">
          ESTETIA<span className="text-estetia-primary">.</span>
        </Link>
        
        <NavLinks />
      </div>
    </nav>
  );
}

export default Navbar;
