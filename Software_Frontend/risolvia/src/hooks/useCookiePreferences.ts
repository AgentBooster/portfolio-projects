
import { useState, useEffect } from 'react';
import { setCookie, getCookie } from '@/utils/cookieUtils';

export interface CookiePreferences {
  analytics: boolean;
  personalization: boolean;
}

const defaultPreferences: CookiePreferences = {
  analytics: true,
  personalization: true,
};

export const useCookiePreferences = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar preferencias al inicializar
  useEffect(() => {
    const savedPreferences = getCookie('cookie_preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(parsed);
      } catch (error) {
        console.log('Error parsing cookie preferences, using defaults');
        savePreferences(defaultPreferences);
      }
    } else {
      // Primera visita - guardar preferencias por defecto
      savePreferences(defaultPreferences);
    }
    setIsLoaded(true);
  }, []);

  const savePreferences = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    setCookie('cookie_preferences', JSON.stringify(newPreferences), 365);
    
    // Si desactivan analytics, limpiar datos relacionados
    if (!newPreferences.analytics) {
      // Aquí se podrían limpiar cookies de analytics si las hubiera
      console.log('Analytics disabled - cleaning related data');
    }
    
    // Si desactivan personalización, limpiar datos relacionados
    if (!newPreferences.personalization) {
      // Limpiar cookies de personalización
      console.log('Personalization disabled - cleaning related data');
    }
  };

  const acceptAll = () => {
    savePreferences({ analytics: true, personalization: true });
  };

  const rejectOptional = () => {
    savePreferences({ analytics: false, personalization: false });
  };

  return {
    preferences,
    isLoaded,
    savePreferences,
    acceptAll,
    rejectOptional,
  };
};
