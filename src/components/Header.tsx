import { GraduationCap, ShieldCheck, LogIn, LogOut, Info } from "lucide-react";

interface HeaderProps {
  isAdmin: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export default function Header({ isAdmin, onLoginClick, onLogoutClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40 transition-all duration-300 shadow-xs" id="portal-header">
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between overflow-hidden rounded-none md:rounded-2xl md:my-2 shadow-xs border-b border-transparent md:border border-slate-200/50" id="header-inner-container">
        {/* Guinea-Bissau Flag Background panels */}
        <div className="absolute inset-0 -z-20 flex">
          {/* Left Red band (1/3 width) */}
          <div className="w-1/3 bg-[#CE1126] h-full relative flex items-center justify-center">
            {/* Black five-pointed star of Guinea-Bissau flag */}
            <svg className="h-8 w-8 sm:h-10 sm:w-10 text-black fill-black opacity-85 hover:opacity-100 transition-opacity drop-shadow-[0_1.5px_3px_rgba(255,255,255,0.2)]" viewBox="0 0 24 24">
              <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" />
            </svg>
          </div>
          {/* Right section (2/3 width) split horizontally */}
          <div className="w-2/3 flex flex-col h-full">
            {/* Top Yellow band */}
            <div className="h-1/2 bg-[#FCD116]" />
            {/* Bottom Green band */}
            <div className="h-1/2 bg-[#009E49]" />
          </div>
        </div>

        {/* Backdrop tint glass film to secure text legibility with perfect contrast */}
        <div className="absolute inset-0 -z-10 bg-slate-950/45 backdrop-blur-[2px]" />

        {/* Brand identity */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="bg-gradient-to-tr from-yellow-500 to-amber-600 p-2 sm:p-2.5 rounded-xl shadow-lg ring-2 ring-yellow-400/20 flex items-center justify-center shrink-0">
            <GraduationCap className="h-5 sm:h-7 w-5 sm:w-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <h1 className="text-sm sm:text-lg md:text-2xl font-bold tracking-tight text-white font-sans uppercase">
                Portal <span className="text-yellow-400">ASSEBGUIM</span> Central
              </h1>
              {isAdmin && (
                <span className="bg-teal-500/20 border border-teal-400/50 text-teal-300 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1 font-mono shrink-0">
                  <ShieldCheck className="h-2.5 sm:h-3 w-2.5 sm:w-3" /> ADMIN
                </span>
              )}
            </div>
            <p className="text-[9px] sm:text-xs text-white/85 font-sans tracking-wide leading-tight hidden sm:block">
              Association des Étudiants de Guinée-Bissau au Maroc • Soutien, Recensement
            </p>
          </div>
        </div>

        {/* Administration switcher */}
        <div className="flex items-center space-x-2">
          {isAdmin ? (
            <button
              onClick={onLogoutClick}
              className="flex items-center space-x-1.5 bg-slate-900/60 hover:bg-red-950/60 border border-slate-700/80 hover:border-red-500 text-slate-200 hover:text-red-300 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer shadow-sm shrink-0"
              id="btn-admin-logout"
              title="Quitter le Mode Administration"
            >
              <LogOut className="h-3.5 sm:h-4 w-3.5 sm:w-4 shrink-0" />
              <span className="hidden sm:inline">Déconnexion Admin</span>
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 hover:from-yellow-400/30 hover:to-amber-400/30 border border-yellow-400/40 hover:border-yellow-300 text-yellow-300 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer shadow-sm shrink-0"
              id="btn-admin-login"
            >
              <LogIn className="h-3.5 sm:h-4 w-3.5 sm:w-4 shrink-0" />
              <span className="hidden sm:inline">Accès Direction</span>
              <span className="sm:hidden">Accès</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
