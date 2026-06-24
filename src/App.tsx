import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CensusForm from "./components/CensusForm";
import DashboardStats from "./components/DashboardStats";
import IntegracaoGuia from "./components/IntegracaoGuia";
import SupportPortal from "./components/SupportPortal";
import AdminLogin from "./components/AdminLogin";
import { AlertTriangle, MapPin, GraduationCap, LifeBuoy } from "lucide-react";

export interface Student {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  university: string;
  course: string;
  degree: string;
  scholarshipType: string;
  residencyStatus: string;
  birthPlace: string;
  nationality: string;
  arrivalDate: string;
  gender: string;
  passportNumber: string;
  passportExpiry: string;
  residenceCardNumber: string;
  residenceCardExpiry: string;
}

export interface SupportTicket {
  id: string;
  category: string;
  description: string;
  studentName: string;
  email: string;
  status: 'Pendente' | 'Em Resolução' | 'Resolvido';
  createdAt: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("census");
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem("admin_token"));
  const [isAdmin, setIsAdmin] = useState<boolean>(() => !!localStorage.getItem("admin_token"));
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  
  // Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load students list and tickets list
  const loadDatabaseData = async () => {
    if (!adminToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Fetch concurrently with auth headers
      const [studentsRes, ticketsRes] = await Promise.all([
        fetch("/api/students", {
          headers: { "Authorization": adminToken }
        }),
        fetch("/api/tickets", {
          headers: { "Authorization": adminToken }
        })
      ]);

      if (!studentsRes.ok || !ticketsRes.ok) {
        if (studentsRes.status === 401 || ticketsRes.status === 401) {
          handleLogout();
          throw new Error("Session expirée ou invalide. Veuillez vous reconnecter.");
        }
        throw new Error("Falha ao comunicar com a API da Embaixada.");
      }

      const studentsData = await studentsRes.json();
      const ticketsData = await ticketsRes.json();

      setStudents(studentsData);
      setTickets(ticketsData);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Incapaz de carregar estatísticas e chamados. Verifique se o servidor backend está online.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      loadDatabaseData();
    } else {
      setLoading(false);
    }
  }, [adminToken]);

  // When admin successfully logs in
  const handleLoginSuccess = (token: string) => {
    localStorage.setItem("admin_token", token);
    setAdminToken(token);
    setIsAdmin(true);
    setActiveTab("dashboard"); // Auto switch to management
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setAdminToken(null);
    setIsAdmin(false);
    setStudents([]);
    setTickets([]);
    if (activeTab === "dashboard") {
      setActiveTab("census"); // Lock away administrative panel
    }
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans flex flex-col selection:bg-yellow-400 selection:text-slate-950" id="portal-root-layout">
      
      {/* 1. Header component */}
      <Header 
        isAdmin={isAdmin} 
        onLoginClick={() => setIsLoginModalOpen(true)} 
        onLogoutClick={handleLogout} 
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        
        {/* 2. Responsive Sidebar (Horizontal on Mobile, Vertical on Desktop) */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isAdmin={isAdmin} 
        />

        {/* 3. Main Dashboard Window */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto" id="main-content-window">
          
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center justify-between gap-3 text-xs w-full max-w-4xl mx-auto">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span>{error}</span>
              </div>
              <button 
                onClick={loadDatabaseData}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer"
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {/* Active View Switch Container */}
          <div className="w-full h-full">
            {activeTab === "census" && (
              <div className="transition-opacity duration-300 animate-fade-in">
                <CensusForm onSuccess={loadDatabaseData} />
              </div>
            )}

            {activeTab === "guide" && (
              <div className="transition-opacity duration-300 animate-fade-in">
                <IntegracaoGuia />
              </div>
            )}

            {activeTab === "support" && (
              <div className="transition-opacity duration-300 animate-fade-in">
                <SupportPortal 
                  tickets={tickets} 
                  isAdmin={isAdmin} 
                  adminToken={adminToken}
                  onRefresh={loadDatabaseData} 
                />
              </div>
            )}

            {activeTab === "dashboard" && isAdmin && (
              <div className="transition-opacity duration-300 animate-fade-in">
                <DashboardStats 
                  students={students} 
                  tickets={tickets} 
                  adminToken={adminToken}
                  onRefresh={loadDatabaseData} 
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 4. Portal Footer Credit Line (Humble & Elegant) */}
      <footer className="bg-slate-50 border-t border-slate-150 py-4 text-center text-[11px] text-slate-500" id="portal-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Ambassade de Guinée-Bissau au Maroc. Tous droits réservés.</p>
        </div>
      </footer>

      {/* 5. Floating Admin Auth Dialog Modal */}
      <AdminLogin 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </div>
  );
}
