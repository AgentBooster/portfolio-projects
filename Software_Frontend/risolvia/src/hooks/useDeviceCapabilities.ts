
import { useState, useEffect } from 'react';

export function useDeviceCapabilities() {
  const [shouldLoadHeavyContent, setShouldLoadHeavyContent] = useState(true);

  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // Type assertion to access deviceMemory property
    const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };
    const hasLowMemory = navigatorWithMemory.deviceMemory && navigatorWithMemory.deviceMemory <= 4;
    
    // Si es móvil/tablet O tiene poca memoria RAM, no cargar contenido pesado
    if (isMobile || hasLowMemory) {
      setShouldLoadHeavyContent(false);
    } else {
      setShouldLoadHeavyContent(true);
    }
  }, []);

  return { shouldLoadHeavyContent };
}
