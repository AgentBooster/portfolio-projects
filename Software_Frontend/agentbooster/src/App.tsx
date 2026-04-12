import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BetaBadge from "./components/BetaBadge";
import Index from "./pages/Index";
import Servicios from "./pages/Servicios";
import Agentes from "./pages/Agentes";
import CasosDeUso from "./pages/CasosDeUso";
import Storytelling from "./pages/Storytelling";
import PoliticaDePrivacidad from "./pages/PoliticaDePrivacidad";
import TerminosDeServicio from "./pages/TerminosDeServicio";
import ConfiguracionDeCookies from "./pages/ConfiguracionDeCookies";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/agentbooster/">
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/agentes" element={<Agentes />} />
          <Route path="/casos-de-uso" element={<CasosDeUso />} />
          <Route path="/storytelling" element={<Storytelling />} />
          <Route path="/politica-de-privacidad" element={<PoliticaDePrivacidad />} />
          <Route path="/terminos-de-servicio" element={<TerminosDeServicio />} />
          <Route path="/configuracion-de-cookies" element={<ConfiguracionDeCookies />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
       </Routes>
        <Footer />
        <BetaBadge />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
