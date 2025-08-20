import AetherLayout from "@/components/layout/AetherLayout";
import PlaceholderPage from "@/components/pages/PlaceholderPage";

export default function Profile() {
  return (
    <AetherLayout>
      <PlaceholderPage
        title="Perfil do Consultor"
        subtitle="Gerencie suas informações profissionais"
        features={[
          "Dados pessoais e profissionais",
          "Especialidades e certificações",
          "Portfolio de projetos",
          "Histórico de performance",
          "Configurações de faturamento",
        ]}
      />
    </AetherLayout>
  );
}
