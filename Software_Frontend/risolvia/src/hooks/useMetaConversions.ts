
import { supabase } from "@/integrations/supabase/client";

export const useMetaConversions = () => {
  const trackEvent = async (eventName: string, pageUrl?: string, userData?: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('meta-conversions', {
        body: {
          event_name: eventName,
          page_url: pageUrl || window.location.href,
          user_data: userData
        }
      });

      if (error) {
        console.error('Error tracking Meta conversion:', error);
        return;
      }

      console.log('Meta conversion tracked successfully:', data);
    } catch (error) {
      console.error('Error in Meta conversions tracking:', error);
    }
  };

  return { trackEvent };
};
