import { useCallback } from 'react';

const RECAPTCHA_SITE_KEY = '6LdzHOErAAAAABLFRg8mAZoeJuL3tTHEXLlQk8uz';

interface RecaptchaWindow extends Window {
  grecaptcha?: {
    ready: (callback: () => void) => void;
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
  };
}

export const useRecaptcha = () => {
  const executeRecaptcha = useCallback(async (action: string): Promise<string | null> => {
    try {
      const w = window as RecaptchaWindow;
      
      if (!w.grecaptcha) {
        console.warn('⚠️ reCAPTCHA no está cargado');
        return null;
      }

      return new Promise((resolve) => {
        w.grecaptcha!.ready(async () => {
          try {
            const token = await w.grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action });
            console.log('✅ reCAPTCHA token generado para acción:', action);
            resolve(token);
          } catch (error) {
            console.error('❌ Error ejecutando reCAPTCHA:', error);
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('❌ Error en useRecaptcha:', error);
      return null;
    }
  }, []);

  return { executeRecaptcha };
};
