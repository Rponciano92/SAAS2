import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  features?: string[];
}

export default function PlaceholderPage({
  title,
  description,
  icon,
  features = [],
}: PlaceholderPageProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="body-text text-cinza-medio">{description}</p>
        </div>
      </div>

      {/* Em Desenvolvimento */}
      <Card className="glass-card">
        <CardContent className="text-center py-16">
          <div className="flex flex-col items-center gap-4">
            {icon || <Construction className="w-16 h-16 text-laranja-cta" />}
            <div>
              <h2 className="section-title">Em Desenvolvimento</h2>
              <p className="body-text text-cinza-medio max-w-2xl">
                Esta funcionalidade está sendo desenvolvida seguindo
                rigorosamente o Manual da Marca oficial do Aether AI. Em breve
                você terá acesso a ferramentas de nível enterprise por um preço
                acessível.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funcionalidades Previstas */}
      {features.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="section-title">
              Funcionalidades Previstas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/50"
                >
                  <div className="w-2 h-2 bg-azul-escuro rounded-full" />
                  <span className="body-text">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <Card className="glass-card">
        <CardContent className="text-center py-8">
          <h3 className="card-title mb-4">
            Quer ser notificado quando estiver pronto?
          </h3>
          <p className="body-text text-cinza-medio mb-6">
            Nossa IA não substitui sua expertise, ela a eleva. Juntos, vamos
            redefinir o futuro da consultoria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="btn-primary">Voltar ao Dashboard</Button>
            </Link>
            <Link to="/empresas/nova">
              <Button className="btn-cta">Cadastrar Nova Empresa</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
