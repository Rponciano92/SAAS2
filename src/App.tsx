import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
import Index from './pages/Index';
import Companies from './pages/Companies';
import CompanyRegistration from './pages/CompanyRegistration';
import CompanyDetailPage from './pages/CompanyDetailPage';
import Analyses from './pages/Analyses';
import Meetings from './pages/Meetings';
import KnowledgeBase from './pages/KnowledgeBase';
import Teachings from './pages/Teachings';
import Assistant from './pages/Assistant';
import Config from './pages/Config';
import Profile from './pages/Profile';
import Gamification from './pages/Gamification';
import NotFound from './pages/NotFound';
import ClientDashboard from './pages/ClientDashboard';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/empresas" element={<Companies />} />
        <Route path="/empresas/nova" element={<CompanyRegistration />} />
        <Route path="/empresas/:companyId" element={<CompanyDetailPage />} />
        <Route path="/analises" element={<Analyses />} />
        <Route path="/reunioes" element={<Meetings />} />
        <Route path="/base" element={<KnowledgeBase />} />
        <Route path="/ensinamentos" element={<Teachings />} />
        <Route path="/assistente" element={<Assistant />} />
        <Route path="/config" element={<Config />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/gamificacao" element={<Gamification />} />
        <Route path="/empresas/:companyId/dashboard" element={<ClientDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;