import { FileText, BookOpen, LifeBuoy, Bot, BarChart3, ShieldCheck } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, isAdmin }: SidebarProps) {
  const menuItems = [
    { id: "census", label: "Recensement Académique", icon: FileText, adminOnly: false },
    { id: "guide", label: "Guide d'Intégration", icon: BookOpen, adminOnly: false },
    { id: "support", label: "Portail d'Assistance", icon: LifeBuoy, adminOnly: false },
    { id: "dashboard", label: "Tableau de Bord (Admin)", icon: BarChart3, adminOnly: true },
  ];

  // Filter out admin-only tabs if not logged in
  const visibleItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <>
      {/* 1. Mobile & Tablet Navigation Bar (Horizontal fixed at top-level or fluid list) */}
      <div className="md:hidden w-full bg-slate-50 border-b border-slate-250 sticky top-16 sm:top-20 z-30" id="sidebar-mobile">
        <nav className="flex items-center overflow-x-auto scrollbar-none px-2 py-1 space-x-1" aria-label="Negação Mobile">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-mobile-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-300 shrink-0 ${
                  isActive
                    ? "bg-slate-100 text-amber-700 border-b-2 border-amber-500"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-amber-500" : "text-slate-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 2. Desktop Navigation Drawer (Vertical sidebar) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-50/70 border-r border-slate-150 shrink-0 h-[calc(100vh-6rem)] sticky top-24 p-4 justify-between" id="sidebar-desktop animate-fade-in">
        <div className="space-y-6">
          <div className="px-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Menu Principal
            </p>
          </div>
          <nav className="space-y-1.5" aria-label="Navegação Desktop">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`tab-desktop-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-yellow-500/10 text-amber-800 border-l-4 border-[#CE1126] shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-[#009E49]" : "text-slate-550"}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info box inside sidebar */}
        <div className="bg-slate-100/50 rounded-xl p-3 border border-slate-200/40">
          <div className="flex items-center space-x-2 text-slate-600 text-xs mb-1">
            <ShieldCheck className="h-4.5 w-4.5 text-[#009E49]" />
            <span className="font-semibold text-slate-700 font-sans">Confidentialité</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Données collectées chiffrées de manière sécurisée. Conformément aux directives de protection interne de l'ASSEBGUIM Central.
          </p>
        </div>
      </aside>
    </>
  );
}
