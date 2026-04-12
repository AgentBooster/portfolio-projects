
import { useCallback } from 'react';
import { useMetaConversions } from './useMetaConversions';

declare global {
  interface Window {
    fbq: any;
    fbq_ready: boolean;
    trackMetaEvent: (eventName: string, eventData?: any) => void;
  }
}

export const useMetaPixel = () => {
  const { trackEvent: trackConversionsAPI } = useMetaConversions();

  const trackEvent = useCallback(async (eventName: string, eventData?: any, userData?: any) => {
    console.log(`🎯 Tracking Meta Pixel Event: ${eventName}`, { eventData, userData });
    
    try {
      // Asegurar que Meta Pixel esté cargado
      if (typeof window !== 'undefined' && window.fbq && window.fbq_ready) {
        console.log('✅ Sending to Meta Pixel (frontend):', eventName, eventData);
        
        // Usar la función global del index.html para máxima compatibilidad
        if (window.trackMetaEvent) {
          window.trackMetaEvent(eventName, eventData);
        } else {
          // Fallback directo
          if (eventData && Object.keys(eventData).length > 0) {
            window.fbq('track', eventName, eventData);
          } else {
            window.fbq('track', eventName);
          }
        }
      } else {
        console.warn('⚠️ Meta Pixel not ready. Skipping frontend tracking.');
      }

      // También enviar a Conversions API
      console.log('🚀 Sending to Meta Conversions API:', eventName);
      await trackConversionsAPI(eventName, window.location.href, userData);
      
    } catch (error) {
      console.error('❌ Error tracking Meta event:', error);
    }
  }, [trackConversionsAPI]);

  const trackViewContent = useCallback(async (contentData: any = {}) => {
    console.log('🎯 Triggering ViewContent event');
    
    const eventData = {
      content_type: 'website_section',
      content_name: 'AI Legal Agent Section',
      content_category: 'Legal AI Assistant',
      value: 1.00,
      currency: 'USD',
      ...contentData
    };
    
    await trackEvent('ViewContent', eventData);
  }, [trackEvent]);

  const trackLead = useCallback(async (userData: any = {}) => {
    console.log('🎯 Triggering Lead event');
    
    const eventData = {
      content_name: 'Legal Form Submission',
      content_category: 'Legal Services',
      value: 1.00,
      currency: 'USD'
    };
    
    await trackEvent('Lead', eventData, userData);
  }, [trackEvent]);

  const trackPageView = useCallback(async () => {
    console.log('🎯 Triggering PageView event');
    await trackEvent('PageView');
  }, [trackEvent]);

  return {
    trackEvent,
    trackViewContent,
    trackLead,
    trackPageView
  };
};
