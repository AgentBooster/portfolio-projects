import React from 'react';
import { ArrowRight } from 'lucide-react';

function Treatments({ openChat }) {
  const cardStyle = "bg-white shadow-2xl rounded-3xl overflow-hidden hover:shadow-estetia-accent/20 transition-all duration-500 hover:-translate-y-2";

  return (
    <section id="tratamientos" className="py-24 relative bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-estetia-text">Carta de <span className="font-bold">Servicios</span></h2>
          <p className="text-gray-500">Procedimientos médicos no invasivos con la tecnología más avanzada del sector.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Tarjeta 1: Rejuvenecimiento Láser */}
          <div className={cardStyle} onClick={openChat}>
            <div className="h-64 overflow-hidden relative">
              <img src={"https://www.clinicamedizen.es/wp-content/uploads/2024/12/medizen-tratamiento-rejuvenecimiento-facial-laser.jpg?auto=compress&cs=tinysrgb&w=800"} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" alt="Mujer recibiendo tratamiento láser facial en clínica estética."/>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Facial</div>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold mb-3 text-estetia-text">Rejuvenecimiento Láser</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Elimina manchas, cierra poros y recupera la luminosidad con nuestro láser de picosegundos.</p>
              <button className="text-estetia-primary font-bold text-sm flex items-center gap-2 group rounded-full">Ver detalles <ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/></button>
            </div>
          </div>

          {/* Tarjeta 2: Remodelación Corporal */}
          <div className={cardStyle} onClick={openChat}>
            <div className="h-64 overflow-hidden relative">
              <img src={"https://www.draraya.com/wp-content/uploads/2021/01/grasa-localizada.jpg?auto=compress&cs=tinysrgb&w=800"} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" alt="Paciente recibiendo tratamiento de remodelación corporal para grasa localizada."/>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Corporal</div>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold mb-3 text-estetia-text">Remodelación 360</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Combate la flacidez y grasa localizada con aparatología médica sin cirugía.</p>
              <button className="text-estetia-primary font-bold text-sm flex items-center gap-2 group rounded-full">Ver detalles <ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/></button>
            </div>
          </div>

          {/* Tarjeta 3: Unidad Capilar */}
          <div className={cardStyle} onClick={openChat}>
            <div className="h-64 overflow-hidden relative">
              <img src={"https://drdanielstellin.com.br/wp-content/uploads/2022/04/mesoterapia-capilar.jpg?auto=compress&cs=tinysrgb&w=800"} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" alt="Análisis capilar con tricoscopio en clínica especializada."/>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Capilar</div>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold mb-3 text-estetia-text">Unidad Capilar Avanzada</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Diagnóstico y tratamientos de vanguardia para la salud y densidad de tu cabello.</p>
              <button className="text-estetia-primary font-bold text-sm flex items-center gap-2 group rounded-full">Ver detalles <ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Treatments;
