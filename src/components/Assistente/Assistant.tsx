import AetherLayout from "@/components/layout/AetherLayout";
import PlaceholderPage from "@/components/pages/PlaceholderPage";
import { MessageSquare } from "lucide-react";

export default function Assistant() {
  return (
    <AetherLayout>
      <PlaceholderPage
        title="Assistente IA Conversacional"
        subtitle="Chat inteligente personalizado para consultoria"
        icon={<MessageSquare size={24} className="text-white" />}
        features={[
          "Chat com IA especializada em consultoria",
          "Acesso a todo conhecimento da empresa",
          "Preparação de reuniões e análises",
          "Sugestões proativas baseadas em contexto",
          "Integração com base de conhecimento",
        ]}
      />
    </AetherLayout>
  );
}