
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Soluciones from "./pages/Soluciones";
import Socios from "./pages/Socios";
import Contactenos from "./pages/Contactenos";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import NotFound from "./pages/NotFound";
import TerminosCondiciones from "./pages/TerminosCondiciones";
import ConfiguracionCookies from "./pages/ConfiguracionCookies";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/risolvia/">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/soluciones" element={<Soluciones />} />
              <Route path="/socios" element={<Socios />} />
              <Route path="/contactenos" element={<Contactenos />} />
              <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
              <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
              <Route path="/configuracion-cookies" element={<ConfiguracionCookies />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
