import React from 'react';
import { BrainCircuit, HeartHandshake, Microscope } from 'lucide-react';

const features = [
  {
    title: 'Diagnóstico Avanzado',
    description: 'Utilizamos tecnología de vanguardia para analizar tu piel y entender tus necesidades únicas.',
    icon: <BrainCircuit className="h-8 w-8 text-white" />,
  },
  {
    title: 'Tecnología de Vanguardia',
    description: 'Solo empleamos aparatología de grado médico, certificada y avalada por estudios científicos.',
    icon: <Microscope className="h-8 w-8 text-white" />,
  },
  {
    title: 'Cuidado y Seguimiento',
    description: 'Realizamos un seguimiento exhaustivo para asegurar que los resultados sean óptimos y duraderos.',
    icon: <HeartHandshake className="h-8 w-8 text-white" />,
  },
];

const WhyChooseUs = () => {
  const cardStyle = "bg-estetia-primary/[0.8] backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl p-8 h-full transition-all duration-500 hover:shadow-estetia-primary/40 hover:-translate-y-2 flex flex-col items-center text-center";

  return (
    <div id="filosofia" className="py-24 sm:py-32"> {/* <-- CAMBIO AQUI: Añadimos el id="filosofia" */} 
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-estetia-primary">PROTOCOLO ESTETIA</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            La Excelencia es Nuestro Estándar
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            No solo cumplimos con los más altos estándares, los definimos. Cada tratamiento es una obra de arte, respaldada por la ciencia y un cuidado excepcional.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-5xl">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.title} className={cardStyle}>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold leading-7 text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base leading-7 text-white/100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
