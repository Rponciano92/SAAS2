import AetherLayout from "@/components/layout/AetherLayout";
import PlaceholderPage from "@/components/pages/PlaceholderPage";

export default function Meetings() {
  return (
    <AetherLayout>
      <PlaceholderPage
        title="Gestão de Reuniões"
        subtitle="Prepare reuniões eficazes com IA"
        features={[
          "Agenda automática de reuniões",
          "Briefings pré-reunião gerados por IA",
          "Acompanhamento de follow-ups",
          "Gravação e transcrição inteligente",
          "Extração de action items",
        ]}
      />
    </AetherLayout>
  );
}
