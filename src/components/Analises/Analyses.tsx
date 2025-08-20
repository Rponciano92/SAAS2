import AetherLayout from "@/components/layout/AetherLayout";
import PlaceholderPage from "@/components/pages/PlaceholderPage";
import { BarChart3 } from "lucide-react";

export default function Analyses() {
  return (
    <AetherLayout>
      <PlaceholderPage
        title="Análises IA + Validação Humana"
        subtitle="Insights profundos com IA offline validados por especialistas"
        icon={<BarChart3 size={24} className="text-white" />}
        features={[
          "Análise financeira com IA offline",
          "Validação por especialistas humanos",
          "Insights estratégicos personalizados",
          "Recomendações acionáveis",
          "Relatórios executivos automáticos",
        ]}
      />
    </AetherLayout>
  );
}