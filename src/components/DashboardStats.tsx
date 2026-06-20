import React, { useState } from "react";
import { Student, SupportTicket } from "../../backend/db";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";
import { 
  Users, Award, HelpCircle, Search, MapPin, Calendar, 
  GraduationCap, Download, RefreshCw, Eye, EyeOff, CheckCircle, Clock, AlertTriangle, ShieldCheck 
} from "lucide-react";

interface DashboardStatsProps {
  students: Student[];
  tickets: SupportTicket[];
  onRefresh: () => void;
}

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#6366f1", "#f43f5e"];

export default function DashboardStats({ students, tickets, onRefresh }: DashboardStatsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState<string>("All");
  const [showPassportInfo, setShowPassportInfo] = useState<Record<string, boolean>>({});

  const togglePassportDetails = (id: string) => {
    setShowPassportInfo(prev => ({ ...prev, [id]: !prev[id] }));
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
    if (!s.arrivalYear) return acc;
    acc[s.arrivalYear] = (acc[s.arrivalYear] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const arrivalYearChartData = Object.entries(arrivalYearCounts).map(([name, value]) => ({
    name,
    Étudiants: value
  })).sort((a,b) => parseInt(a.name) - parseInt(b.name));

  // Unique arrival years for filter dropdown
  const arrivalYears = Array.from(new Set(students.map(s => s.arrivalYear).filter(Boolean))).sort().reverse();

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
    const matchesYear = filterYear === "All" || s.arrivalYear === filterYear;
    
    return matchesSearch && matchesYear;
  });

  // Export to CSV helper - text generation
  const downloadCSV = () => {
    const headers = ["N°", "Nom Complet", "Date de Naissance", "Email", "Téléphone", "Ville", "Université", "Filière", "Diplôme", "Bourse", "Année Arrivée", "Passeport", "Séjour", "Expiration Séjour"];
    const rows = students.map((s, index) => [
      (index + 1).toString(),
      s.fullName,
      s.birthDate || "N/A",
      s.email,
      s.phone,
      s.city,
      s.university,
      s.course,
      s.degree,
      s.scholarshipType,
      s.arrivalYear,
      s.passportNumber,
      s.residenceCardNumber,
      s.residenceCardExpiry
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Cense_ASSEBGUIM_Cartographie_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <p className="text-sm text-slate-500">Direction Générale de Suivi Académique de l'ASSEBGUIM Central.</p>
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
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">
                        <div className="space-y-1">
                          <p className="flex items-center gap-1 font-semibold text-slate-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#009E49] shrink-0" /> {s.city}
                          </p>
                          <span className="bg-slate-100 font-mono text-[10px] text-slate-600 px-1.5 py-0.5 rounded flex items-center gap-1 w-max">
                            <Calendar className="h-3 w-3" /> Arrivé en: {s.arrivalYear}
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
                              title="Voir numéro complet"
                            >
                              {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </button>
                          </div>
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
                            <span className="inline-block bg-slate-100 text-slate-600 font-mono px-1.5 py-0.5 rounded text-[10px]">En attente du titre</span>
                          ) : (
                            getExpirationBadge(s.residenceCardExpiry)
                          )}
                        </div>
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
    </div>
  );
}
