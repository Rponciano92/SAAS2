import AetherLayout from "@/components/layout/AetherLayout";
import PlaceholderPage from "@/components/pages/PlaceholderPage";
import { Settings } from "lucide-react";

export default function Config() {
  return (
    <AetherLayout>
      <PlaceholderPage
        title="Configurações do Sistema"
        subtitle="Personalize sua experiência no Aether AI"
        icon={<Settings size={24} className="text-white" />}
        features={[
          "Personalização da interface",
          "Configurações de notificações",
          "Preferências de IA e assistente",
          "Segurança e privacidade",
          "Integrações com outras ferramentas",
        ]}
      />
    </AetherLayout>
  );
}