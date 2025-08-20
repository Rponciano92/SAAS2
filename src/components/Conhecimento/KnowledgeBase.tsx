import AetherLayout from "@/components/layout/AetherLayout";
import PlaceholderPage from "@/components/pages/PlaceholderPage";

export default function KnowledgeBase() {
  return (
    <AetherLayout>
      <PlaceholderPage
        title="Base de Conhecimento"
        subtitle="Centralize todo conhecimento de consultoria"
        features={[
          "Biblioteca de frameworks de consultoria",
          "Templates de apresentações",
          "Cases de sucesso documentados",
          "Metodologias testadas",
          "Busca inteligente por contexto",
        ]}
      />
    </AetherLayout>
  );
}
