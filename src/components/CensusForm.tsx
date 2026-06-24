import React, { useState } from "react";
import { User, GraduationCap, Fingerprint, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Info } from "lucide-react";

interface CensusFormProps {
  onSuccess: () => void; // Reload data in parent/admin if needed
}

export default function CensusForm({ onSuccess }: CensusFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    birthPlace: "",
    nationality: "",
    email: "",
    phone: "",
    arrivalDate: "",
    gender: "M",
    city: "",
    university: "",
    course: "",
    degree: "Licence",
    scholarshipType: "Boursier AMCI",
    passportNumber: "",
    passportExpiry: "",
    residenceCardNumber: "En Cours",
    residenceCardExpiry: ""
  });

  const cities = [
    "Agadir", "Al Hoceima", "Asilah", "Béni Mellal", "Berkane", "Berrechid", "Boujdour", 
    "Bouskoura", "Casablanca", "Chefchaouen", "Dakhla", "El Jadida", "Errachidia", 
    "Essaouira", "Fès", "Fkih Ben Salah", "Guelmim", "Ifrane", "Jerada", "Kalaat Sraghna", 
    "Kénitra", "Khémisset", "Khouribga", "Ksar El Kebir", "Laâyoune", "Larache", 
    "Marrakech", "Meknès", "Midelt", "Mohammedia", "Nador", "Ouarzazate", "Oued Zem", 
    "Ouazzane", "Oujda", "Rabat", "Safi", "Salé", "Settat", "Sidi Bennour", "Sidi Slimane", 
    "Skhirat", "Tan-Tan", "Tanger", "Taroudant", "Taza", "Témara", "Tétouan", "Tinghir", 
    "Tiznit", "Youssoufia"
  ];

  const degrees = ["Licence", "Master", "Doctorat", "Technicien Supérieur", "Autre"];
  const scholarshipTypes = ["Boursier AMCI", "Privé / Auto-financé"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Basic phone placeholder/mask matching Moroccan or Guinean formats
    if (value && !value.startsWith("+")) {
      value = "+" + value.replace(/\D/g, "");
    }
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const validateStep = () => {
    setError(null);
    // All fields are optional
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      handleNext();
      return;
    }
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de la soumission des données au recensement.");
      }

      setSubmitted(true);
      onSuccess(); // Triggers a parent layout update
    } catch (err: any) {
      setError(err.message || "Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      birthDate: "",
      birthPlace: "",
      nationality: "",
      email: "",
      phone: "",
      arrivalDate: "",
      gender: "M",
      city: "",
      university: "",
      course: "",
      degree: "Licence",
      scholarshipType: "Boursier AMCI",
      passportNumber: "",
      passportExpiry: "",
      residenceCardNumber: "En Cours",
      residenceCardExpiry: ""
    });
    setStep(1);
    setSubmitted(false);
    setError(null);
  };

  // Stepper Header
  const stepsMeta = [
    { num: 1, title: "Personnel & Contact", icon: User },
    { num: 2, title: "Données Académiques", icon: GraduationCap },
    { num: 3, title: "Documents Officiels", icon: Fingerprint }
  ];

  if (submitted) {
    return (
      <div className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-10 max-w-2xl mx-auto shadow-sm text-center animate-fade-in" id="census-success-panel">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-50 text-emerald-600 rounded-full mb-6 ring-8 ring-emerald-50/50">
          <CheckCircle2 className="h-16 w-16" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-955 tracking-tight">Recensement Conclu avec Succès !</h2>
        <p className="text-slate-600 mt-3 max-w-md mx-auto text-sm sm:text-base">
          Merci beaucoup, <strong>{formData.fullName}</strong>. Votre inscription aide les services consulaires de l'Ambassade de Guinée-Bissau au Maroc à cartographier les étudiants et à fournir un soutien ciblé.
        </p>

        <div className="my-8 p-5 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-3 font-sans text-xs">
          <h3 className="font-bold text-amber-600 uppercase tracking-widest font-mono text-[10px] mb-2 border-b border-slate-200 pb-1.5 flex justify-between items-center">
            <span>Résumé Déclaré</span>
            <span className="text-emerald-600 font-bold">Validé ✓</span>
          </h3>
          <p className="text-slate-700"><span className="text-slate-450 font-semibold">Nom :</span> {formData.fullName}</p>
          <p className="text-slate-700"><span className="text-slate-450 font-semibold">Ville & Diplôme :</span> {formData.city} • {formData.degree}</p>
          <p className="text-slate-700"><span className="text-slate-450 font-semibold">Passeport :</span> <code className="bg-slate-100 px-1.5 py-0.5 rounded text-amber-700 font-mono font-bold">{formData.passportNumber}</code></p>
          <p className="text-slate-700"><span className="text-slate-450 font-semibold">Établissement :</span> {formData.university} - {formData.course}</p>
        </div>

        <button
          onClick={handleReset}
          className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl transition duration-300 transform active:scale-95 cursor-pointer shadow-sm text-sm"
        >
          Enregistrer un autre étudiant
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm max-w-4xl mx-auto overflow-hidden animate-fade-in" id="census-form-container">
      {/* Visual Header */}
      <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-amber-500/10 text-amber-600 p-1.5 rounded-lg text-xs font-bold font-mono">RECENSEMENT</span>
            Formulaire Officiel des Étudiants
          </h2>
          <p className="text-xs text-slate-500 mt-1">Veuillez remplir avec des données exactes. Vos données sont protégées par le secret éthique et administratif.</p>
        </div>
        <div className="text-xs text-slate-600 font-mono flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          Étape {step} sur 3
        </div>
      </div>

      {/* Modern Stepper Indicator */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200 flex justify-between items-center overflow-x-auto gap-4 scrollbar-none">
        {stepsMeta.map((s, index) => {
          const Icon = s.icon;
          const isCompleted = step > s.num;
          const isCurrent = step === s.num;
          return (
            <div key={s.num} className="flex items-center space-x-2 shrink-0">
              <div className={`p-2 rounded-lg flex items-center justify-center transition-all border ${
                isCompleted 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-250/30" 
                  : isCurrent 
                    ? "bg-amber-500/10 text-amber-600 ring-2 ring-amber-500/10 border-amber-500/20" 
                    : "bg-slate-105 text-slate-400 border-slate-150"
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-left hidden xs:block">
                <p className={`text-[10px] font-bold font-mono tracking-widest uppercase ${isCurrent ? 'text-amber-600' : 'text-slate-400'}`}>
                  ÉTAPE 0{s.num}
                </p>
                <p className={`text-xs font-bold ${isCurrent ? 'text-slate-850' : 'text-slate-500'}`}>
                  {s.title}
                </p>
              </div>
              {index < stepsMeta.length - 1 && (
                <div className="h-px bg-slate-205 w-8 md:w-16 hidden sm:block !ml-4" />
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-650 p-4 rounded-xl flex items-start gap-2.5 text-sm animate-shake" id="census-error-alert">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-600" />
            <div>
              <span className="font-bold text-red-800">Erreur :</span> {error}
            </div>
          </div>
        )}

        {/* STEP 1: PERSONAL & CONTACT DATA */}
        {step === 1 && (
          <div className="space-y-4 sm:space-y-5 animate-fade-in">
            <h3 className="text-sm font-bold text-amber-700 uppercase tracking-widest font-mono flex items-center gap-2">
              <User className="h-4 w-4 text-[#CE1126]" /> Données Personnelles & Contact
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Nom Complet (Optionnel)</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Ex: Mamadou Saido Baldé"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Date de Naissance (Optionnel)</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Adresse Email (Optionnel)</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Ex: son-email@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Téléphone de Contact (Maroc / GB) (Optionnel)</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Ex: +212 612345678"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">Format international recommandé (Ex : +212 600-000000).</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Lieu de Naissance (Optionnel)</label>
                <input
                  type="text"
                  name="birthPlace"
                  placeholder="Ex: Conakry"
                  value={formData.birthPlace}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Nationalité (Optionnel)</label>
                <input
                  type="text"
                  name="nationality"
                  placeholder="Ex: Guinéenne"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-650 mb-1.5">Genre (Optionnel)</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                  >
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-650 mb-1.5">Date d'Arrivée au Maroc (Optionnel)</label>
                  <input
                    type="date"
                    name="arrivalDate"
                    value={formData.arrivalDate}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ACADEMIC DETAILS */}
        {step === 2 && (
          <div className="space-y-4 sm:space-y-5 animate-fade-in">
            <h3 className="text-sm font-bold text-amber-700 uppercase tracking-widest font-mono flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-[#FCD116]" /> Statut Académique & Localisation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Ville de Résidence au Maroc (Optionnel)</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                >
                  <option value="">Choisir une ville...</option>
                  {cities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Niveau / Diplôme Académique (Optionnel)</label>
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                >
                  {degrees.map(deg => (
                    <option key={deg} value={deg}>{deg}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Université ou Établissement d'Enseignement (Optionnel)</label>
                <input
                  type="text"
                  name="university"
                  placeholder="Ex: FST - Faculté des Sciences et Techniques de Mohammedia"
                  value={formData.university}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Nom de la Filière / Spécialité (Optionnel)</label>
                <input
                  type="text"
                  name="course"
                  placeholder="Ex: Génie Logiciel / Droit"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-650 mb-1.5">Type de Bourse (Optionnel)</label>
                <select
                  name="scholarshipType"
                  value={formData.scholarshipType}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                >
                  {scholarshipTypes.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: OFFICIAL IDENTIFICATION */}
        {step === 3 && (
          <div className="space-y-4 sm:space-y-5 animate-fade-in">
            <h3 className="text-sm font-bold text-amber-700 uppercase tracking-widest font-mono flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-[#009E49]" /> Identification Officielle & Validité
            </h3>

            {/* Compliance Warning: Explaining why text inputs are used instead of physical files upload (Safe practice) */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-800 leading-relaxed font-sans">
              <Info className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <span className="font-bold uppercase tracking-wide">Confidentialité Garantie :</span> Pas d'importation de fichiers. Pour la protection juridique et la stabilité du portail, l'Ambassade recueille exclusivement les numéros textuels et les dates d'expiration de votre documentation. Ne téléversez pas de photos ou de PDF.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Numéro de Passeport Guinéen (Optionnel)</label>
                <input
                  type="text"
                  name="passportNumber"
                  placeholder="Ex: GW012345"
                  value={formData.passportNumber}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Date d'Expiration du Passeport (Optionnel)</label>
                <input
                  type="date"
                  name="passportExpiry"
                  value={formData.passportExpiry}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Numéro de Carte de Séjour / Récépissé Officiel (Optionnel)</label>
                <input
                  type="text"
                  name="residenceCardNumber"
                  placeholder="Ex: E123456 ou En Cours"
                  value={formData.residenceCardNumber}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">Saisissez &quot;En Cours&quot; et une date future si vous êtes nouveau.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Date d'Expiration de la Carte / Récépissé</label>
                <input
                  type="date"
                  name="residenceCardExpiry"
                  value={formData.residenceCardExpiry}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM WIZARD CONTROLS */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-4">
          {step > 1 ? (
            <button
              key="btn-back"
              type="button"
              onClick={handleBack}
              className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour</span>
            </button>
          ) : (
            <div key="btn-back-placeholder" /> // Space keeper
          )}

          {step < 3 ? (
            <button
              key="btn-next"
              type="button"
              onClick={handleNext}
              className="flex items-center space-x-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-5 py-2.5 rounded-xl text-sm font-bold transition transform active:scale-95 cursor-pointer"
            >
              <span>Continuer</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              key="btn-submit"
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 px-6 py-3 rounded-xl text-sm font-bold transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent" />
                  <span>Chiffrement & Sauvegarde...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Soumettre au Recensement</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
