import AetherLayout from "@/components/layout/AetherLayout";
import PlaceholderPage from "@/components/pages/PlaceholderPage";

export default function Teachings() {
  return (
    <AetherLayout>
      <PlaceholderPage
        title="Ensinamentos de IA"
        subtitle="Contribua para evolução coletiva"
        features={[
          "Compartilhe expertise com a comunidade",
          "Sistema de gamificação por contribuições",
          "Validação por pares consultores",
          "Ranking de especialistas por área",
          "Monetização de conhecimento premium",
        ]}
      />
    </AetherLayout>
  );
}
