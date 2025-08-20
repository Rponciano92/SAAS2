import React from 'react';
import AetherLayout from '@/components/layout/AetherLayout';
import Dashboard from '@/components/Dashboard/Dashboard';

export default function Index() {
  const handleNavigate = (tab: string) => {
    // Navigation is handled by react-router-dom
    window.location.href = `/${tab}`;
  };

  return (
    <AetherLayout>
      <Dashboard onNavigate={handleNavigate} />
    </AetherLayout>
  );
}