import React, { useState } from "react";
import { SupportTicket } from "../../backend/db";
import { 
  LifeBuoy, Calendar, Clock, AlertCircle, CheckCircle, 
  Send, User, ClipboardList, Info, HelpCircle
} from "lucide-react";

interface SupportPortalProps {
  tickets: SupportTicket[];
  isAdmin: boolean;
  adminToken: string | null;
  onRefresh: () => void;
}

export default function SupportPortal({ tickets, isAdmin, adminToken, onRefresh }: SupportPortalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // States for student ticket submission
  const [ticketForm, setTicketForm] = useState({
    studentName: "",
    email: "etudiant@assebguim.central",
    category: "Documentation",
    description: ""
  });

  const categories = [
    "Académie",
    "Logement",
    "Santé",
    "Documentation",
    "Autre"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.studentName.trim() || !ticketForm.description.trim()) {
      setError("Veuillez remplir tous les champs du ticket.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Un problème est survenu lors de l'enregistrement de votre ticket d'assistance.");
      }

      setSuccessMsg(data.message || "Ticket d'assistance enregistré avec grand succès !");
      setTicketForm({
        studentName: "",
        email: "etudiant@assebguim.central",
        category: "Documentation",
        description: ""
      });
      onRefresh(); // Trigger parent stats reload
    } catch (err: any) {
      setError(err.message || "Erreur de connexion avec le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (adminToken) {
        headers["Authorization"] = adminToken;
      }
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Un problème est survenu lors de la mise à jour du statut du ticket.");
      }

      onRefresh(); // Refresh table
    } catch (err: any) {
      alert("Erreur lors du traitement du ticket : " + err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Resolvido":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Résolu
          </span>
        );
      case "Em Resolução":
        return (
          <span className="inline-flex items-center gap-1.5 bg-yellow-100/60 border border-yellow-250/50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-semibold animate-pulse">
            <Clock className="h-3.5 w-3.5 text-amber-600" /> En cours
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold">
            <AlertCircle className="h-3.5 w-3.5 text-slate-500" /> En attente
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="support-portal-view">
      
      {/* LEFT COLUMN: Submit a Case (Student View) */}
      <section className="lg:col-span-5 h-fit text-xs">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 space-y-5 shadow-sm">
          <div>
            <span className="bg-[#CE1126]/10 text-[#CE1126] font-bold px-2 py-1 rounded font-mono text-[10px] uppercase">HELPDESK</span>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 mt-2 flex items-center gap-1.5">
              <LifeBuoy className="h-5 w-5 text-yellow-500 shrink-0" /> Ouvrir un Ticket d'Assistance
            </h3>
            <p className="text-slate-500 mt-1">Notre direction analysera votre cas dans un délai de 48 heures maximum.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-650 p-3.5 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-650 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-xl flex items-start gap-2.5">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-650 font-bold mb-1.5">Votre Nom Complet *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  name="studentName"
                  required
                  placeholder="Ex: Mamadou Baldé"
                  value={ticketForm.studentName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-650 font-bold mb-1.5">Urgence / Catégorie *</label>
              <select
                name="category"
                value={ticketForm.category}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-650 font-bold mb-1.5 font-sans">Comment l'ASSEBGUIM Central peut-elle vous aider ? *</label>
              <textarea
                name="description"
                rows={4}
                required
                placeholder="Décrivez votre problème en détail (Ex: perte de bourse, renouvellement urgent de passeport consulaire, etc)..."
                value={ticketForm.description}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 rounded-xl transition duration-300 transform active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent" />
              ) : (
                <Send className="h-4.5 w-4.5" />
              )}
              <span>Soumettre la Demande</span>
            </button>
          </form>
        </div>
      </section>

      {/* RIGHT COLUMN: Active/Historic Cases */}
      <section className="lg:col-span-7 h-full text-xs">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 space-y-5 shadow-sm min-h-[450px]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-1.5">
              <ClipboardList className="h-5 w-5 text-[#009E49]" />
              {isAdmin ? "File de Traitement Générale (Admin)" : "Historique des Demandes Récentes"}
            </h3>
            <p className="text-slate-500 mt-1">
              {isAdmin 
                ? "Résolution et suivi des besoins sociaux et consulaires des étudiants inscrits." 
                : "Ci-dessous figurent les tickets déclarés par les étudiants en temps réel."}
            </p>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[550px]" id="tickets-history-container">
            {tickets.length > 0 ? (
              [...tickets].reverse().map((tk) => (
                <div 
                  key={tk.id} 
                  className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 space-y-3 hover:border-slate-300 transition"
                  id={`ticket-card-${tk.id}`}
                >
                  {/* Card top */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center space-x-2.5">
                      <span className="bg-slate-100 border border-slate-200 text-[10px] font-mono font-bold text-amber-700 px-2 py-0.5 rounded uppercase">
                        {tk.category === "Academia" ? "Académie" : tk.category === "Residência" ? "Logement" : tk.category === "Saúde" ? "Santé" : tk.category === "Documentação" ? "Documentation" : tk.category}
                      </span>
                      <span className="text-slate-400 text-[10px] font-mono">
                        {new Date(tk.createdAt).toLocaleString("fr-FR", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {getStatusBadge(tk.status)}
                  </div>

                  {/* Body description */}
                  <p className="text-xs text-slate-705 font-sans leading-relaxed whitespace-pre-wrap">
                    {tk.description}
                  </p>

                  <div className="border-t border-slate-200 pt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-sans">
                    <p className="text-slate-500 flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700">Étudiant :</span> {tk.studentName} 
                      <span className="text-slate-400 font-mono">({tk.email})</span>
                    </p>

                    {/* Admin rapid management options */}
                    {isAdmin && (
                      <div className="flex items-center space-x-1 self-end sm:self-auto bg-white border border-slate-200 rounded-lg p-1 shrink-0">
                        <button
                          onClick={() => handleUpdateStatus(tk.id, "Pendente")}
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition cursor-pointer ${
                            tk.status === "Pendente" 
                              ? "bg-slate-100 text-slate-700 shadow-xs" 
                              : "text-slate-400 hover:text-slate-650"
                          }`}
                          title="Remettre en attente"
                        >
                          En attente
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(tk.id, "Em Resolução")}
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition cursor-pointer ${
                            tk.status === "Em Resolução" 
                              ? "bg-amber-100 text-amber-800 shadow-xs" 
                              : "text-slate-400 hover:text-amber-700"
                          }`}
                          title="Mettre en traitement"
                        >
                          Soutien
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(tk.id, "Resolvido")}
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition cursor-pointer ${
                            tk.status === "Resolvido" 
                              ? "bg-emerald-100 text-emerald-800 shadow-xs" 
                              : "text-slate-400 hover:text-emerald-700"
                          }`}
                          title="Marquer comme résolu"
                        >
                          Résolu
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-xl font-sans">
                Aucun ticket d'assistance enregistré pour le moment.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
