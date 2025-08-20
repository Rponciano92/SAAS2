import AetherLayout from "@/components/layout/AetherLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <AetherLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-azul-escuro">404</h1>
          <h2 className="page-title">Página não encontrada</h2>
          <p className="body-text text-gray-600 max-w-md">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="space-x-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-azul-escuro text-azul-escuro hover:bg-azul-escuro hover:text-white"
          >
            Voltar
          </Button>
          <Button onClick={() => navigate("/")} className="btn-aether">
            Ir para Dashboard
          </Button>
        </div>
      </div>
    </AetherLayout>
  );
}
