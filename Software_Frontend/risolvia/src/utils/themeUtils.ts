
// Utilidades para detección automática de tema basado en hora y preferencias del sistema
export const getSystemThemePreference = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const getTimeBasedTheme = (): 'light' | 'dark' => {
  const hour = new Date().getHours();
  // Modo oscuro entre las 20:00 y 6:59 (8 PM a 6:59 AM)
  return (hour >= 20 || hour < 7) ? 'dark' : 'light';
};

// Determina el tema automático basado en preferencias del sistema y hora
export const getAutoTheme = (prioritizeSystem: boolean = true): 'light' | 'dark' => {
  if (prioritizeSystem) {
    // Primero checar preferencia del sistema, luego hora
    const systemTheme = getSystemThemePreference();
    if (systemTheme === 'dark') return 'dark';
    
    // Si el sistema prefiere claro, usar la hora como factor decisivo
    return getTimeBasedTheme();
  } else {
    // Primero checar hora, luego sistema
    const timeTheme = getTimeBasedTheme();
    if (timeTheme === 'dark') return 'dark';
    
    // Si es de día, respetar preferencia del sistema
    return getSystemThemePreference();
  }
};

// Listener para cambios en preferencias del sistema
export const createSystemThemeListener = (callback: (theme: 'light' | 'dark') => void) => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    const newTheme = e.matches ? 'dark' : 'light';
    callback(newTheme);
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  // Retornar función para limpiar el listener
  return () => mediaQuery.removeEventListener('change', handleChange);
};
