import React, { useState } from "react";
import { Student, SupportTicket } from "../../backend/db";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";
import { 
  Users, Award, HelpCircle, Search, MapPin, Calendar, 
  GraduationCap, Download, RefreshCw, Eye, EyeOff, CheckCircle, Clock, AlertTriangle, ShieldCheck, Edit, X,
  Megaphone, Trash2, Lock
} from "lucide-react";

interface DashboardStatsProps {
  students: Student[];
  tickets: SupportTicket[];
  adminToken?: string | null;
  onRefresh: () => void;
  announcements?: any[];
  onRefreshAnnouncements?: () => void;
  onUpdateAdminToken?: (token: string) => void;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "N/D";
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
  return dateStr;
};

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#6366f1", "#f43f5e"];

export default function DashboardStats({ 
  students, 
  tickets, 
  adminToken, 
  onRefresh,
  announcements,
  onRefreshAnnouncements
}: DashboardStatsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState<string>("All");
  const [showPassportInfo, setShowPassportInfo] = useState<Record<string, boolean>>({});
  
  // Edit Student States
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState<Student | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Announcement States
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annPublishLoading, setAnnPublishLoading] = useState(false);
  const [annFormError, setAnnFormError] = useState<string | null>(null);
  const [annFormSuccess, setAnnFormSuccess] = useState<string | null>(null);

  // Change Password States
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  const editCities = [
    "Agadir", "Al Hoceima", "Asilah", "Béni Mellal", "Berkane", "Berrechid", "Boujdour", 
    "Bouskoura", "Casablanca", "Chefchaouen", "Dakhla", "El Jadida", "Errachidia", 
    "Essaouira", "Fès", "Fkih Ben Salah", "Guelmim", "Ifrane", "Jerada", "Kalaat Sraghna", 
    "Kénitra", "Khémisset", "Khouribga", "Ksar El Kebir", "Laâyoune", "Larache", 
    "Marrakech", "Meknès", "Midelt", "Mohammedia", "Nador", "Ouarzazate", "Oued Zem", 
    "Ouazzane", "Oujda", "Rabat", "Safi", "Salé", "Settat", "Sidi Bennour", "Sidi Slimane", 
    "Skhirat", "Tan-Tan", "Tanger", "Taroudant", "Taza", "Témara", "Tétouan", "Tinghir", 
    "Tiznit", "Youssoufia"
  ];

  const togglePassportDetails = (id: string) => {
    setShowPassportInfo(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setEditForm({ ...student });
    setEditError(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editForm) return;
    const { name, value } = e.target;
    setEditForm(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !editForm) return;

    setEditLoading(true);
    setEditError(null);

    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (adminToken) {
        headers["Authorization"] = adminToken;
      }

      // Prepare payload - we omit id and residencyStatus if backend doesn't want them in updates
      const { id, residencyStatus, ...payload } = editForm;

      const response = await fetch(`/api/students/${editingStudent.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de la mise à jour.");
      }

      setEditingStudent(null);
      setEditForm(null);
      onRefresh(); // Reload main students list
    } catch (err: any) {
      setEditError(err.message || "Erreur lors de la sauvegarde.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!editingStudent) return;
    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer définitivement l'étudiant "${editingStudent.fullName}" ? Cette action est irréversible.`
    );
    if (!confirmDelete) return;

    setEditLoading(true);
    setEditError(null);

    try {
      const headers: HeadersInit = {};
      if (adminToken) {
        headers["Authorization"] = adminToken;
      }

      const response = await fetch(`/api/students/${editingStudent.id}`, {
        method: "DELETE",
        headers
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de la suppression.");
      }

      setEditingStudent(null);
      setEditForm(null);
      onRefresh(); // Reload main students list
    } catch (err: any) {
      setEditError(err.message || "Erreur lors de la suppression.");
    } finally {
      setEditLoading(false);
    }
  };

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    setAnnPublishLoading(true);
    setAnnFormError(null);
    setAnnFormSuccess(null);

    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (adminToken) {
        headers["Authorization"] = adminToken;
      }

      const response = await fetch("/api/announcements", {
        method: "POST",
        headers,
        body: JSON.stringify({ title: annTitle, content: annContent })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      setAnnTitle("");
      setAnnContent("");
      setAnnFormSuccess("Communiqué publié avec succès !");
      if (onRefreshAnnouncements) {
        onRefreshAnnouncements();
      }
    } catch (err: any) {
      setAnnFormError(err.message || "Erreur de conexão.");
    } finally {
      setAnnPublishLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce communiqué ?");
    if (!confirmDelete) return;

    try {
      const headers: HeadersInit = {};
      if (adminToken) {
        headers["Authorization"] = adminToken;
      }

      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
        headers
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      if (onRefreshAnnouncements) {
        onRefreshAnnouncements();
      }
    } catch (err: any) {
      alert(err.message || "Erreur de conexão.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.trim().length < 4) {
      setPwError("Le nouveau mot de passe doit comporter au moins 4 caractères.");
      setPwSuccess(null);
      return;
    }

    setPwLoading(true);
    setPwError(null);
    setPwSuccess(null);

    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (adminToken) {
        headers["Authorization"] = adminToken;
      }

      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers,
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      setPwSuccess("Mot de passe mis à jour avec succès !");
      setCurrentPw("");
      setNewPw("");
      
      if (onUpdateAdminToken && data.token) {
        onUpdateAdminToken(data.token);
      }
    } catch (err: any) {
      setPwError(err.message || "Erreur de connexion.");
    } finally {
      setPwLoading(false);
    }
  };

  // Calculations & KPIs
  const totalStudents = students.length;
  const amciScholars = students.filter(s => s.scholarshipType && s.scholarshipType.toLowerCase().includes("amci")).length;
  const amciScholarsPercent = totalStudents > 0 ? Math.round((amciScholars / totalStudents) * 100) : 0;
  
  const pendingTickets = tickets.filter(t => t.status === "Pendente").length;
  const inResolutionTickets = tickets.filter(t => t.status === "Em Resolução").length;
  
  const malesCount = students.filter(s => s.gender === "M").length;
  const femalesCount = students.filter(s => s.gender === "F").length;
  const malesPercent = totalStudents > 0 ? Math.round((malesCount / totalStudents) * 100) : 0;
  const femalesPercent = totalStudents > 0 ? Math.round((femalesCount / totalStudents) * 100) : 0;

  // Data aggregation for Recharts
  // Geographical stats
  const cityCounts = students.reduce((acc, s) => {
    acc[s.city] = (acc[s.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cityChartData = Object.entries(cityCounts).map(([name, value]) => ({
    name,
    Étudiants: value
  })).sort((a,b) => b.Étudiants - a.Étudiants);

  // Degrees / Levels of instruction stats
  const degreeCounts = students.reduce((acc, s) => {
    acc[s.degree] = (acc[s.degree] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const degreeChartData = Object.entries(degreeCounts).map(([name, value]) => ({
    name,
    value
  }));

  // Arrival Year stats
  const arrivalYearCounts = students.reduce((acc, s) => {
    if (!s.arrivalDate) return acc;
    const year = s.arrivalDate.includes("-") ? s.arrivalDate.substring(0, 4) : s.arrivalDate;
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const arrivalYearChartData = Object.entries(arrivalYearCounts).map(([name, value]) => ({
    name,
    Étudiants: value
  })).sort((a,b) => parseInt(a.name) - parseInt(b.name));

  // Unique arrival years for filter dropdown
  const arrivalYears = Array.from(new Set(students.map(s => {
    if (!s.arrivalDate) return "";
    return s.arrivalDate.includes("-") ? s.arrivalDate.substring(0, 4) : s.arrivalDate;
  }).filter(Boolean))).sort().reverse();

  // Search and Year filter
  const filteredStudents = students.filter(s => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      s.fullName.toLowerCase().includes(query) ||
      s.city.toLowerCase().includes(query) ||
      s.university.toLowerCase().includes(query) ||
      s.course.toLowerCase().includes(query) ||
      s.degree.toLowerCase().includes(query) ||
      s.passportNumber.toLowerCase().includes(query)
    );
    const studentYear = s.arrivalDate ? (s.arrivalDate.includes("-") ? s.arrivalDate.substring(0, 4) : s.arrivalDate) : "";
    const matchesYear = filterYear === "All" || studentYear === filterYear;
    
    return matchesSearch && matchesYear;
  });

  // Export to CSV helper - text generation
  const downloadCSV = () => {
    const headers = [
      "N°", "Nom Complet", "Date de Naissance", "Lieu de Naissance", "Nationalité", 
      "Email", "Téléphone", "Ville", "Université", "Filière", "Diplôme", "Bourse", 
      "Date Arrivée", "Passeport", "Expiration Passeport", "Séjour", "Expiration Séjour",
      "Carte Consulaire", "Expiration Carte Consulaire"
    ];
    const rows = students.map((s, index) => [
      (index + 1).toString(),
      (s.fullName || "").trim() || "N/D",
      s.birthDate ? formatDate(s.birthDate) : "N/D",
      (s.birthPlace || "").trim() || "N/D",
      (s.nationality || "").trim() || "N/D",
      (s.email || "").trim().toLowerCase() || "N/D",
      s.phone ? `="${s.phone.trim()}"` : "N/D",
      (s.city || "").trim() || "N/D",
      (s.university || "").trim() || "N/D",
      (s.course || "").trim() || "N/D",
      (s.degree || "").trim() || "N/D",
      (s.scholarshipType || "").trim() || "N/D",
      s.arrivalDate ? formatDate(s.arrivalDate) : "N/D",
      s.passportNumber ? `="${s.passportNumber.trim().toUpperCase()}"` : "N/D",
      s.passportExpiry ? formatDate(s.passportExpiry) : "N/D",
      s.residenceCardNumber ? `="${s.residenceCardNumber.trim().toUpperCase()}"` : "N/D",
      s.residenceCardExpiry ? formatDate(s.residenceCardExpiry) : "N/D",
      s.consularCardNumber ? `="${s.consularCardNumber.trim().toUpperCase()}"` : "N/D",
      s.consularCardExpiry ? formatDate(s.consularCardExpiry) : "N/D"
    ]);

    // Use semicolon as separator for better compatibility with Excel (French/Portuguese region settings)
    // Add UTF-8 BOM (\uFEFF) so Excel opens it with the correct encoding (preserving accented characters)
    const csvContent = "\uFEFF" + [
      headers.join(";"), 
      ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(";"))
    ].join("\n");
      
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Recensement_Ambassade_GB_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper to color check passport expiration
  const getExpirationBadge = (expiryStr: string) => {
    if (!expiryStr || expiryStr === "2030-01-01") return <span className="text-slate-400 font-mono text-[10px]">N/D</span>;
    const expiryDate = new Date(expiryStr);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return (
        <span className="inline-flex items-center gap-1 bg-red-50 border border-red-200 text-red-650 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
          <AlertTriangle className="h-3 w-3 text-red-600" /> Expiré
        </span>
      );
    } else if (diffDays <= 90) {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
          <Clock className="h-3 w-3 text-amber-600" /> Proche ({diffDays}j)
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
          <CheckCircle className="h-3 w-3 text-emerald-600" /> Valide
        </span>
      );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="dashboard-admin-view">
      {/* Title + Action bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-amber-500 h-6 w-6 sm:h-7 sm:w-7" />
            Statistiques & Cartographie Démographique
          </h2>
          <p className="text-sm text-slate-500">Direction Générale de Suivi Académique de l'Ambassade de Guinée-Bissau.</p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onRefresh}
            className="flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 transition cursor-pointer"
            title="Actualiser les données"
            id="btn-refresh-stats"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Recharger</span>
          </button>
          <button
            onClick={downloadCSV}
            disabled={totalStudents === 0}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-bold transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            id="btn-export-csv"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Exporter CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-cards">
        {/* KPI 1: Total Mapped Students */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Inscriptions Actives</span>
            <div className="bg-yellow-500/10 p-2 rounded-xl text-amber-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 font-mono">{totalStudents}</h3>
            <p className="text-xs text-slate-500 mt-1">Étudiants guinéens recensés</p>
          </div>
        </div>

        {/* KPI 2: AMCI Scholar % */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Boursiers AMCI</span>
            <div className="bg-emerald-550/10 p-2 rounded-xl text-[#009E49]">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-[#009E49] font-mono">{amciScholarsPercent}%</h3>
            <p className="text-xs text-slate-500 mt-1">{amciScholars} sur {totalStudents} enregistrés</p>
          </div>
        </div>

        {/* KPI 3: Helpdesk Active Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Soutien en Attente</span>
            <div className="bg-red-50 p-2 rounded-xl text-[#CE1126]">
              <HelpCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-[#CE1126] font-mono">{pendingTickets}</h3>
            <p className="text-xs text-slate-500 mt-1">{inResolutionTickets} en cours de traitement</p>
          </div>
        </div>

        {/* KPI 4: Gender Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Analyse de Genre</span>
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-slate-800 flex gap-2 font-sans">
              <span className="text-blue-600">M: {malesPercent}%</span>
              <span className="text-pink-500">F: {femalesPercent}%</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1.5">{malesCount} garçons • {femalesCount} filles</p>
          </div>
        </div>
      </div>

      {/* Analytical Charts Row */}
      {totalStudents > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-charts">
          {/* Chart 1: Geographical Distribution */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="border-b border-slate-200 pb-4 mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-amber-500" /> Distribution Géographique (Villes)
              </h3>
            </div>
            <div className="h-72 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityChartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", color: "#1e293b" }} 
                    cursor={{ fill: "rgba(226, 232, 240, 0.4)" }}
                  />
                  <Bar dataKey="Étudiants" fill="#CE1126" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Degrees Distribution */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="border-b border-slate-200 pb-4 mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-[#009E49]" /> Niveaux d'Enseignement au Maroc
              </h3>
            </div>
            <div className="h-72 flex flex-col sm:flex-row items-center justify-around gap-4 text-xs">
              <div className="h-full w-full sm:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={degreeChartData}
                      cx="55%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {degreeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", color: "#1e293b" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends list */}
              <div className="w-full sm:w-1/2 space-y-2">
                {degreeChartData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-slate-700 font-semibold">{d.name}</span>
                    </div>
                    <span className="font-bold text-slate-500 font-mono">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart 3: Arrival Year Distribution */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-2">
            <div className="border-b border-slate-200 pb-4 mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-blue-500" /> Évolution des Arrivées par Année
              </h3>
            </div>
            <div className="h-72 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={arrivalYearChartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", color: "#1e293b" }} 
                    cursor={{ fill: "rgba(226, 232, 240, 0.4)" }}
                  />
                  <Bar dataKey="Étudiants" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl text-center text-slate-500 font-sans text-sm">
          En attente d'inscriptions sur le recensement pour générer les statistiques.
        </div>
      )}

      {/* Announcements (Communiqués) Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="border-b border-slate-200 pb-4 mb-5 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-sans">
            <Megaphone className="h-4 w-4 text-amber-500" />
            Espace Communiqués de l'Ambassade
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Announcement Form */}
          <form onSubmit={handlePublishAnnouncement} className="space-y-4">
            <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Publier un nouveau communiqué</h4>
            
            {annFormError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-2.5 rounded-lg text-[11px] font-sans">
                {annFormError}
              </div>
            )}
            
            {annFormSuccess && (
              <div className="bg-emerald-50 border border-emerald-250 text-emerald-700 p-2.5 rounded-lg text-[11px] font-sans">
                {annFormSuccess}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Titre du Communiqué</label>
              <input
                type="text"
                placeholder="Ex: Avis aux boursiers de l'AMCI"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Message / Contenu</label>
              <textarea
                placeholder="Écrivez le message ici..."
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={annPublishLoading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition duration-300 transform active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {annPublishLoading ? "Publication..." : "Publier le Communiqué"}
            </button>
          </form>

          {/* Active Announcements List */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Communiqués Actifs</h4>
            {announcements && announcements.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {announcements.map((ann) => (
                  <div key={ann.id} className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h5 className="font-bold text-slate-800 text-xs">{ann.title}</h5>
                      <p className="text-slate-655 text-[11px] whitespace-pre-wrap leading-relaxed">{ann.content}</p>
                      <p className="text-[9px] text-slate-400 font-mono">
                        Publié le : {new Date(ann.created_at).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition shrink-0 cursor-pointer"
                      title="Supprimer ce communiqué"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50/50 border border-slate-200 border-dashed rounded-xl p-8 text-center text-slate-400 text-xs">
                Aucun communiqué actif pour le moment.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm animate-fade-in">
        <div className="border-b border-slate-200 pb-4 mb-5 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-sans">
            <Lock className="h-4 w-4 text-slate-500 animate-pulse" />
            Sécurité du Portail (Changer le mot de passe admin)
          </h3>
        </div>

        <form onSubmit={handleChangePassword} className="max-w-2xl space-y-4">
          {pwError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-2.5 rounded-xl text-[11px] font-sans">
              {pwError}
            </div>
          )}
          
          {pwSuccess && (
            <div className="bg-emerald-50 border border-emerald-250 text-emerald-700 p-2.5 rounded-xl text-[11px] font-sans">
              {pwSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Mot de passe actuel</label>
              <div className="relative">
                <input
                  type={showCurrentPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition animate-fade-in"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 focus:outline-none cursor-pointer"
                >
                  {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Nouveau mot de passe</label>
              <div className="relative">
                <input
                  type={showNewPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition animate-fade-in"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655 focus:outline-none cursor-pointer"
                >
                  {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={pwLoading}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition duration-300 transform active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            {pwLoading ? "Mise à jour..." : "Enregistrer le mot de passe"}
          </button>
        </form>
      </div>

      {/* Search Tracker & Students Database Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden" id="students-table-section">
        {/* Table header with Search */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Inscriptions Académiques Individuelles</h3>
            <p className="text-xs text-slate-500 mt-1">Affichage de {filteredStudents.length} sur {totalStudents} fiches actives.</p>
          </div>

          {/* Filters: Search Box and Year Dropdown */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrar par nom, filière, passeport..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full sm:w-40 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition cursor-pointer"
            >
              <option value="All">Toutes les années</option>
              {arrivalYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mapped Student Database Table */}
        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                  <th className="p-4 uppercase tracking-wider font-semibold">Étudiant (Fiche)</th>
                  <th className="p-4 uppercase tracking-wider font-semibold">Ville & Année</th>
                  <th className="p-4 uppercase tracking-wider font-semibold">Établissement & Filière</th>
                  <th className="p-4 uppercase tracking-wider font-semibold">Bourse / Financement</th>
                  <th className="p-4 uppercase tracking-wider font-semibold">Passeport</th>
                  <th className="p-4 uppercase tracking-wider font-semibold">Carte de Séjour</th>
                  <th className="p-4 uppercase tracking-wider font-semibold">Carte Consulaire</th>
                  <th className="p-4 uppercase tracking-wider font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStudents.map((s) => {
                  const isVisible = !!showPassportInfo[s.id];
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-slate-900">{s.fullName}</p>
                          <p className="text-slate-500 font-mono mt-0.5 text-[11px]">{s.email}</p>
                          <p className="text-slate-500 font-mono text-[11px]">{s.phone}</p>
                          {(s.nationality || s.birthPlace) && (
                            <div className="text-slate-500 mt-1 text-[10px] flex flex-wrap gap-1 items-center">
                              {s.nationality && <span className="bg-slate-100 text-slate-650 px-1.5 py-0.5 rounded font-semibold">{s.nationality}</span>}
                              {s.birthPlace && <span className="text-slate-450 font-mono">Né(e) à: {s.birthPlace}</span>}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">
                        <div className="space-y-1">
                          <p className="flex items-center gap-1 font-semibold text-slate-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#009E49] shrink-0" /> {s.city}
                          </p>
                          <span className="bg-slate-105 font-mono text-[10px] text-slate-600 px-1.5 py-0.5 rounded flex items-center gap-1 w-max">
                            <Calendar className="h-3 w-3" /> Arrivé le: {formatDate(s.arrivalDate)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 max-w-sm">
                        <div>
                          <span className="bg-yellow-500/10 text-amber-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase font-sans">
                            {s.degree}
                          </span>
                          <p className="font-bold text-slate-800 mt-1.5 leading-tight">{s.course}</p>
                          <p className="text-slate-500 text-[11px] leading-snug mt-0.5">{s.university}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 bg-slate-50 font-bold border rounded-full py-0.5 text-[10px] uppercase ${
                          s.scholarshipType && s.scholarshipType.toLowerCase().includes("amci")
                            ? "border-emerald-250 text-emerald-700"
                            : "border-slate-200 text-slate-500"
                        }`}>
                          {s.scholarshipType}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-1">
                            <code className="bg-slate-50 text-amber-700 px-2 py-1 rounded font-mono font-bold text-xs tracking-wider border border-slate-200">
                              {isVisible ? s.passportNumber : "••••••••"}
                            </code>
                            <button
                              onClick={() => togglePassportDetails(s.id)}
                              className="text-slate-400 hover:text-slate-700 p-1"
                              title="Voir número complet"
                            >
                              {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                          <p className="text-slate-500 text-[10px] font-mono leading-tight">
                            Exp: {s.passportExpiry || "N/A"}
                          </p>
                          {getExpirationBadge(s.passportExpiry)}
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <code className="bg-slate-50 text-slate-700 px-1.5 py-1 rounded font-mono font-bold text-xs border border-slate-200">
                            {s.residenceCardNumber}
                          </code>
                          <p className="text-slate-500 text-[10px] font-mono leading-tight mt-1.5">
                            Exp: {s.residenceCardExpiry || "N/A"}
                          </p>
                          {s.residenceCardNumber === "En Cours" || s.residenceCardNumber === "Em Processo" ? (
                            <span className="inline-block bg-slate-100 text-slate-650 font-mono px-1.5 py-0.5 rounded text-[10px]">En attente du titre</span>
                          ) : (
                            getExpirationBadge(s.residenceCardExpiry)
                          )}
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {s.consularCardNumber ? (
                            <>
                              <code className="bg-slate-50 text-emerald-700 px-1.5 py-1 rounded font-mono font-bold text-xs border border-slate-200 uppercase">
                                {s.consularCardNumber}
                              </code>
                              <p className="text-slate-500 text-[10px] font-mono leading-tight mt-1.5">
                                Exp: {s.consularCardExpiry || "N/A"}
                              </p>
                              {getExpirationBadge(s.consularCardExpiry)}
                            </>
                          ) : (
                            <span className="text-slate-450 font-mono text-[10px]">Aucune</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleEditClick(s)}
                          className="bg-amber-550 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span>Éditer</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 font-sans text-sm">
            Aucun étudiant ne correspond aux critères de recherche.
          </div>
        )}
      </div>

      {/* 4. Edit Student Modal */}
      {editingStudent && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="edit-student-modal">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={() => { setEditingStudent(null); setEditForm(null); }} 
          />

          {/* Modal Card */}
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl relative z-10 animate-scale-up text-xs flex flex-col">
            {/* Decorative top strip */}
            <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-yellow-500 to-amber-600" />

            {/* Modal header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight uppercase">Modifier la Fiche Étudiant</h3>
                <p className="text-slate-500 text-[11px] leading-tight">Modification de la fiche de {editingStudent.fullName}</p>
              </div>
              <button 
                onClick={() => { setEditingStudent(null); setEditForm(null); }}
                className="text-slate-400 hover:text-slate-800 transition p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEdit} className="space-y-5 flex-1">
              {editError && (
                <div className="bg-red-50 border border-red-200 text-red-650 p-3 rounded-xl flex items-start gap-2 animate-shake">
                  <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-red-600 mt-0.5" />
                  <span>{editError}</span>
                </div>
              )}

              {/* STEP 1 FIELDS (Personnel) */}
              <div>
                <h4 className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-3">1. Informations Personnelles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-605 font-bold mb-1.5">Nom Complet</label>
                    <input
                      type="text"
                      name="fullName"
                      value={editForm.fullName || ""}
                      onChange={handleEditInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-605 font-bold mb-1.5">Date de Naissance</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={editForm.birthDate || ""}
                      onChange={handleEditInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-605 font-bold mb-1.5">Lieu de Naissance</label>
                    <input
                      type="text"
                      name="birthPlace"
                      value={editForm.birthPlace || ""}
                      onChange={handleEditInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-605 font-bold mb-1.5">Nationalité</label>
                    <input
                      type="text"
                      name="nationality"
                      value={editForm.nationality || ""}
                      onChange={handleEditInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-605 font-bold mb-1.5">Adresse Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email || ""}
                      onChange={handleEditInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-605 font-bold mb-1.5">Téléphone</label>
                    <input
                      type="text"
                      name="phone"
                      value={editForm.phone || ""}
                      onChange={handleEditInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-605 font-bold mb-1.5">Genre</label>
                    <select
                      name="gender"
                      value={editForm.gender || "M"}
                      onChange={handleEditInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                    >
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-605 font-bold mb-1.5">Date d'Arrivée au Maroc</label>
                    <input
                      type="date"
                      name="arrivalDate"
                      value={editForm.arrivalDate || ""}
                      onChange={handleEditInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 2 FIELDS (Academic) */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-3">2. Données Académiques & Localisation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-605 font-bold mb-1.5">Ville de Résidence au Maroc</label>
                    <select
                      name="city"
                      value={editForm.city || ""}
                      onChange={handleEditInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                    >
                      <option value="">Choisir une ville...</option>
                      {editCities.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-605 font-bold mb-1.5">Niveau / Diplôme Académique</label>
                    <select
                      name="degree"
                      value={["Licence", "Master", "Doctorat", "Technicien Supérieur"].includes(editForm.degree || "") ? editForm.degree || "Licence" : "Autre"}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "Autre") {
                          setEditForm(prev => prev ? { ...prev, degree: "" } : null);
                        } else {
                          setEditForm(prev => prev ? { ...prev, degree: val } : null);
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                    >
                      <option value="Licence">Licence</option>
                      <option value="Master">Master</option>
                      <option value="Doctorat">Doctorat</option>
                      <option value="Technicien Supérieur">Technicien Supérieur</option>
                      <option value="Autre">Autre (Préciser...)</option>
                    </select>
                  </div>

                  {!["Licence", "Master", "Doctorat", "Technicien Supérieur"].includes(editForm.degree || "") && (
                    <div className="animate-fade-in md:col-span-2">
                      <label className="block text-slate-605 font-bold mb-1.5">Précisez le Niveau Académique</label>
                      <input
                        type="text"
                        name="degree"
                        placeholder="Ex: Post-Doctorat, Classe Préparatoire, etc."
                        value={editForm.degree === "Autre" ? "" : editForm.degree}
                        onChange={handleEditInputChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                      />
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-slate-605 font-bold mb-1.5">Université / Établissement d'Enseignement</label>
                    <input
                      type="text"
                      name="university"
                      value={editForm.university || ""}
                      onChange={handleEditInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-605 font-bold mb-1.5">Filière / Spécialité</label>
                    <input
                      type="text"
                      name="course"
                      value={editForm.course || ""}
                      onChange={handleEditInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-605 font-bold mb-1.5">Type de Bourse</label>
                    <select
                      name="scholarshipType"
                      value={editForm.scholarshipType || "Boursier AMCI"}
                      onChange={handleEditInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                    >
                      <option value="Boursier AMCI">Boursier AMCI</option>
                      <option value="Privé / Auto-financé">Privé / Auto-financé</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* STEP 3 FIELDS (Official Identification) */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-3">3. Identification Officielle</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-605 font-bold mb-1.5">Numéro de Passeport</label>
                    <input
                      type="text"
                      name="passportNumber"
                      value={editForm.passportNumber || ""}
                      onChange={handleEditInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-605 font-bold mb-1.5">Expiration Passeport</label>
                    <input
                      type="date"
                      name="passportExpiry"
                      value={editForm.passportExpiry || ""}
                      onChange={handleEditInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-605 font-bold mb-1.5">Carte de Séjour (Numéro / En Cours)</label>
                    <input
                      type="text"
                      name="residenceCardNumber"
                      value={editForm.residenceCardNumber || ""}
                      onChange={handleEditInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono uppercase font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-605 font-bold mb-1.5">Expiration Carte de Séjour</label>
                    <input
                      type="date"
                      name="residenceCardExpiry"
                      value={editForm.residenceCardExpiry || ""}
                      onChange={handleEditInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-605 font-bold mb-1.5">Carte Consulaire (Optionnel)</label>
                    <input
                      type="text"
                      name="consularCardNumber"
                      value={editForm.consularCardNumber || ""}
                      onChange={handleEditInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono uppercase font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-605 font-bold mb-1.5">Expiration Carte Consulaire (Optionnel)</label>
                    <input
                      type="date"
                      name="consularCardExpiry"
                      value={editForm.consularCardExpiry || ""}
                      onChange={handleEditInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                <div>
                  <button
                    type="button"
                    onClick={handleDeleteStudent}
                    disabled={editLoading}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition duration-300 transform active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <X className="h-4.5 w-4.5" />
                    <span>Supprimer la fiche</span>
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => { setEditingStudent(null); setEditForm(null); }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl transition-all duration-300 transform active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {editLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent" />
                    ) : (
                      <ShieldCheck className="h-4.5 w-4.5" />
                    )}
                    <span>Sauvegarder</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
