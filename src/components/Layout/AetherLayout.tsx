import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  Home,
  Building2,
  Plus,
  BarChart3,
  Calendar,
  BookOpen,
  Brain,
  MessageSquare,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";

interface AetherLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/", description: "Visão geral" },
  {
    icon: Building2,
    label: "Empresas Clientes",
    path: "/empresas",
    description: "Portfólio",
  },
  {
    icon: Plus,
    label: "Cadastrar Empresa",
    path: "/empresas/nova",
    description: "Nova empresa",
    badge: "NOVO",
  },
  {
    icon: BarChart3,
    label: "Análises IA",
    path: "/analises",
    description: "Insights",
  },
  {
    icon: Calendar,
    label: "Reuniões",
    path: "/reunioes",
    description: "Agenda",
  },
  {
    icon: BookOpen,
    label: "Base Conhecimento",
    path: "/base",
    description: "Biblioteca",
  },
  {
    icon: Brain,
    label: "Ensinamentos IA",
    path: "/ensinamentos",
    description: "Contribuir",
    premium: true,
  },
  {
    icon: MessageSquare,
    label: "Assistente IA",
    path: "/assistente",
    description: "Chat",
  },
  {
    icon: Settings,
    label: "Configurações",
    path: "/config",
    description: "Preferências",
  },
  {
    icon: User,
    label: "Perfil",
    path: "/perfil",
    description: "Dados pessoais",
  },
];

const user = {
  nome: "Carlos Silva",
  cargo: "Consultor Sênior",
  roi: "1.767%",
  pontos: 1247,
};

export default function AetherLayout({ children }: AetherLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const MenuContent = () => (
    <div className="h-full flex flex-col">
      {/* Header do Menu */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-azul-escuro/20 to-transparent p-1 flex items-center justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fa8374592a0c045d1984382844d0402d2%2F09624429e7f843dfacdc379e0ff7ce4f?format=webp&width=800"
              alt="Aether AI Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="text-lg font-bold text-white font-aether-primary">
              AETHER AI
            </div>
            <div className="text-xs text-white/70 italic">
              "Assistente Definitivo"
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-white font-semibold">{user.nome}</div>
          <div className="text-white/70 text-sm">{user.cargo}</div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-6 py-3 text-white hover:bg-white/10 transition-colors relative ${
                isActive ? "bg-white/20 border-r-2 border-laranja-cta" : ""
              } ${item.premium ? "bg-gradient-to-r from-dourado-premium/10 to-transparent" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <IconComponent className="w-5 h-5" />
              <div className="flex-1">
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-white/70">{item.description}</div>
              </div>
              {item.badge && (
                <Badge className="bg-laranja-cta text-white text-xs px-2 py-0.5 font-bold">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Métricas Rápidas */}
      <div className="p-6 border-t border-white/10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-4 h-4 text-verde-sucesso" />
            <div className="flex-1">
              <div className="text-xs text-white/70">ROI Mensal</div>
              <div className="text-sm font-semibold text-dourado-premium">
                {user.roi}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Brain className="w-4 h-4 text-dourado-premium" />
            <div className="flex-1">
              <div className="text-xs text-white/70">Pontos</div>
              <div className="text-sm font-semibold text-dourado-premium">
                {user.pontos}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/10">
        <button className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sair</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cinza-claro to-white">
      {/* Header Mobile/Desktop */}
      <header className="bg-azul-escuro text-white p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          {/* Desktop: Always show hamburger for now, tablet+ can have permanent sidebar later */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-80 p-0 bg-azul-escuro border-r border-white/10"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <MenuContent />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-azul-escuro/20 to-transparent p-1 flex items-center justify-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fa8374592a0c045d1984382844d0402d2%2F09624429e7f843dfacdc379e0ff7ce4f?format=webp&width=800"
                alt="Aether AI Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-bold font-aether-primary">AETHER AI</div>
              <div className="text-xs text-white/70 hidden sm:block">
                "O Assistente de IA Definitivo"
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-verde-sucesso rounded-full animate-pulse"></div>
            <span className="text-sm">3 validações pendentes</span>
          </div>
          <div className="text-right hidden sm:block">
            <div className="font-semibold text-sm">{user.nome}</div>
            <div className="text-xs text-white/70">{user.cargo}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 lg:p-6 max-w-7xl">{children}</main>
    </div>
  );
}
