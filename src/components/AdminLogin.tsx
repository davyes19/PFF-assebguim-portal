import React, { useState } from "react";
import { Shield, Eye, EyeOff, Lock, User, AlertCircle, X, Check } from "lucide-react";

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

export default function AdminLogin({ isOpen, onClose, onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Identifiants invalides.");
      }

      onLoginSuccess(data.token);
      setUsername("");
      setPassword("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="admin-login-modal">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-xl relative z-10 animate-scale-up text-xs overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-yellow-500 to-amber-600" />

        {/* Modal close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex bg-yellow-500/10 p-3 rounded-full text-yellow-650 ring-4 ring-yellow-500/5 mb-2">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight uppercase">Authentification Direction</h3>
          <p className="text-slate-500 text-[11px] leading-tight max-w-xs mx-auto">Pour accéder à la base de données, à la cartographie analytique et gérer les demandes des étudiants.</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 font-sans text-xs">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-650 p-3 rounded-xl flex items-start gap-2 animate-shake">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-650 font-bold mb-1.5">Nom d'utilisateur / Email *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                placeholder="Ex: admin"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-650 font-bold mb-1.5">Mot de passe *</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-405 hover:text-slate-600 transition p-1"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold py-3 rounded-xl transition-all duration-300 transform active:scale-95 flex items-center justify-center space-x-2 cursor-pointer shadow-md text-sm mt-5"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent" />
            ) : (
              <Check className="h-4.5 w-4.5" />
            )}
            <span>Se connecter</span>
          </button>
        </form>
      </div>
    </div>
  );
}
