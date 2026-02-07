import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Faq = () => {
  const faqs = [
    {
      question: '¿La primera consulta de valoración tiene algún coste?',
      answer: 'No, tu primera consulta de valoración es completamente gratuita. En ella, realizaremos un diagnóstico completo y te recomendaremos el plan de tratamiento que mejor se adapte a tus necesidades y objetivos, junto con un presupuesto detallado sin ningún compromiso.',
    },
    {
      question: '¿Los tratamientos son dolorosos?',
      answer: 'Nos esforzamos por garantizar que tu experiencia sea lo más cómoda posible. La mayoría de nuestros tratamientos son mínimamente invasivos y prácticamente indoloros. En casos específicos donde pueda haber una ligera molestia, utilizamos anestesia tópica para minimizarla.',
    },
    {
      question: '¿Cuándo empezaré a ver los resultados?',
      answer: 'El tiempo para ver los resultados varía según el tratamiento. Algunos procedimientos ofrecen resultados visibles casi de inmediato, mientras que otros, como los tratamientos de regeneración de colágeno, muestran una mejora gradual a lo largo de varias semanas. Te lo explicaremos en detalle en tu consulta.',
    },
    {
      question: '¿Son seguros los procedimientos?',
      answer: 'Absolutamente. La seguridad de nuestros pacientes es nuestra máxima prioridad. Todos nuestros tratamientos están aprobados por las autoridades sanitarias, y son realizados por personal médico cualificado utilizando la tecnología más avanzada y segura del mercado.',
    },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-white border-y border-gray-200/80">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-base font-semibold leading-7 text-estetia-primary">RESOLVEMOS TUS DUDAS</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
              Preguntas Frecuentes
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Aquí encontrarás respuestas a las consultas más comunes. Si no encuentras lo que buscas, no dudes en contactarnos.
            </p>
          </div>
          <dl className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-2xl bg-estetia-secondary p-6 shadow-sm">
                <dt>
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-start justify-between text-left text-gray-900"
                  >
                    <span className="text-base font-semibold leading-7">{faq.question}</span>
                    <span className="ml-6 flex h-7 items-center">
                      <ChevronDown
                        className={`h-6 w-6 transform transition-transform duration-300 ${openFaq === index ? '-rotate-180' : ''}`}
                      />
                    </span>
                  </button>
                </dt>
                <dd className={`mt-2 pr-12 overflow-hidden transition-all duration-500 ease-in-out ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}>
                  <p className="text-base leading-7 text-gray-600 pt-4 border-t border-gray-900/10">{faq.answer}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Faq;
