import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CompaniesPage from "./pages/Companies";
import CompanyRegistrationPage from "./pages/CompanyRegistration";
import AnalysesPage from "./pages/Analyses";
import MeetingsPage from "./pages/Meetings";
import KnowledgeBasePage from "./pages/KnowledgeBase";
import TeachingsPage from "./pages/Teachings";
import AssistantPage from "./pages/Assistant";
import ConfigPage from "./pages/Config";
import ProfilePage from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/empresas" element={<CompaniesPage />} />
          <Route path="/empresas/nova" element={<CompanyRegistrationPage />} />
          <Route path="/analises" element={<AnalysesPage />} />
          <Route path="/reunioes" element={<MeetingsPage />} />
          <Route path="/base" element={<KnowledgeBasePage />} />
          <Route path="/ensinamentos" element={<TeachingsPage />} />
          <Route path="/assistente" element={<AssistantPage />} />
          <Route path="/config" element={<ConfigPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
