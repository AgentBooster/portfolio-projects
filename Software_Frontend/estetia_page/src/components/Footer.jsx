import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Instagram, Linkedin, Facebook, Youtube } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const privacyPolicyUrl = "/estetia/politica-de-privacidad.html";

  const facialTreatments = [
    { name: 'Diagnóstico Facial Avanzado', href: '#' },
    { name: 'Rejuvenecimiento con Láser (IPL)', href: '#' },
    { name: 'Bioestimuladores de Colágeno', href: '#' },
    { name: 'Peeling Químico Médico', href: '#' },
  ];

  const corporalTreatments = [
    { name: 'Remodelación Corporal Avanzada', href: '#' },
    { name: 'Depilación Láser de Diodo', href: '#' },
    { name: 'Tratamiento para la Celulitis', href: '#' },
    { name: 'Presoterapia Avanzada', href: '#' },
  ];

  const socialLinks = [
      { name: 'Facebook', href: 'https://facebook.com', icon: <Facebook size={24} /> },
      { name: 'Instagram', href: 'https://instagram.com', icon: <Instagram size={24} /> },
      { name: 'TikTok', href: 'https://tiktok.com', icon: <FaTiktok size={24} /> }, 
      { name: 'YouTube', href: 'https://youtube.com', icon: <Youtube size={24} /> },
  ];

  const legalLinks = [
      { name: 'Política de Privacidad', href: privacyPolicyUrl, external: true },
      { name: 'Aviso Legal', href: '#', external: false },
      { name: 'Política de Cookies', href: '#', external: false },
      { name: 'Mapa del sitio', href: '#', external: false },
  ];

  return (
    <footer className="bg-[#F9F8FA] text-gray-600 font-sans">
      {/* Cambiado py-12 por pt-12 y pb-8 para reducir solo el espacio inferior */}
      <div className="max-w-7xl mx-auto pt-12 pb-8 px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
          
          <div className="md:col-span-2 lg:col-span-1 space-y-4">
             <h3 className="text-3xl font-bold text-[#C5B8C9] tracking-widest">Estetia</h3>
             <p className="text-base">
                Tu belleza, nuestra pasión. La última tecnología en tratamientos estéticos.
             </p>
             <div className="flex space-x-5 text-gray-400">
                {socialLinks.map(social => (
                    <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="hover:text-estetia-accent transition-colors">
                        <span className="sr-only">{social.name}</span>
                        {social.icon}
                    </a>
                ))}
             </div>
          </div>

          <div>
            <h4 className="font-semibold tracking-wide mb-5 text-gray-800">Tratamientos Faciales</h4>
            <ul className="space-y-3">
              {facialTreatments.map(item => (
                <li key={item.name}>
                  <a href={item.href} className="hover:text-estetia-accent transition-colors">{item.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold tracking-wide mb-5 text-gray-800">Tratamientos Corporales</h4>
            <ul className="space-y-3">
              {corporalTreatments.map(item => (
                <li key={item.name}>
                  <a href={item.href} className="hover:text-estetia-accent transition-colors">{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold tracking-wide mb-5 text-gray-800">Contáctame</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail size={16} className="mr-3 text-gray-500" />
                <a href="mailto:info@estetia.com" className="hover:text-estetia-accent transition-colors">info@estetia.com</a>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-3 text-gray-500 mt-1 flex-shrink-0" />
                <span>Calle Serrano 45, Oficina 3A, 28001 Madrid, España</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4 sm:mb-0">
            {legalLinks.map(link => (
                <a 
                  key={link.name} 
                  href={link.href}
                  target={link.external ? '_blank' : '_self'}
                  rel={link.external ? 'noopener noreferrer' : ''}
                  className="hover:text-estetia-accent transition-colors"
                >
                  {link.name}
                </a>
            ))}
          </div>
          <p className="text-center sm:text-right">
            &copy; {currentYear} Estetia. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
