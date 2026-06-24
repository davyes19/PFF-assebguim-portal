import React, { useState } from "react";
import { 
  HeartHandshake, FileCheck, Phone, ShieldAlert, Award, 
  MapPin, HelpCircle, ArrowRight, ClipboardList, BookOpen,
  Home, Calendar
} from "lucide-react";

interface GuideSection {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  content: React.ReactNode;
}

export default function IntegracaoGuia() {
  const [activeSection, setActiveSection] = useState("contratos");

  const sections: GuideSection[] = [
    {
      id: "contratos",
      title: "Légalisation de Bail",
      subtitle: "Procédure Moukataa / Commune",
      icon: FileCheck,
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            Pour que vous puissiez résider légalement et demander votre titre de séjour (Carte de Séjour) au Maroc, il est obligatoire d'avoir un contrat de bail écrit (<strong>Contrat de bail</strong>) légalisé.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <h4 className="font-bold text-[#CE1126] text-xs uppercase tracking-widest font-mono">Étapes à suivre à la &quot;Moukataa&quot; :</h4>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600">
              <li>Rendez-vous à la mairie locale (<strong>Commune Urbaine</strong> ou populairement <strong>Moukataa</strong>) du quartier où vous louez le logement.</li>
              <li>Le propriétaire (<strong>propriétaire</strong>) et vous-même (ainsi que vos colocataires) devez vous y présenter munis de vos passeports originaux.</li>
              <li>Vous devez signer le contrat en présence de l'officier public qui authentifie les signatures (<strong>Légalisation de Signature</strong>).</li>
              <li>Il est nécessaire de payer une taxe administrative de timbre (généralement sous forme de timbres fiscaux de 20 MAD).</li>
              <li>Conservez au moins 3 copies originales dûment signées et cachetées. L'une d'elles sera déposée auprès de la police.</li>
            </ol>
          </div>
          <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
            <span className="font-bold uppercase tracking-wider font-mono">Note Rapide :</span> Si vous logez dans une cité universitaire publique ou privée, remplacez le contrat par une <strong>Attestation d&apos;hébergement</strong> délivrée par l'administration de la résidence.
          </div>
        </div>
      )
    },
    {
      id: "logement",
      title: "Logement & Installation",
      subtitle: "Cités, Loyers, Samsars & Conseils",
      icon: Home,
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            Trouver un logement sécurisé, abordable et proche de votre établissement d'enseignement est l'une des étapes les plus importantes lors de votre arrivée au Maroc. Voici les options et recommandations de la Direction Générale :
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-[#009E49] text-xs uppercase tracking-widest font-mono mb-2 flex items-center gap-1.5">
                🏢 Cités et Résidences Universitaires
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Le gouvernement marocain met à la disposition des étudiants internationaux (AMCI & quotas étatiques) des cités universitaires publiques et semi-publiques.
              </p>
              <ul className="list-disc pl-4 mt-2 text-[11px] text-slate-550 space-y-1">
                <li><strong>Cité d'accueil AMCI (Rabat) :</strong> Option la plus économique (env. 400-600 MAD/mois). Places limitées, candidatures dès l'octroi.</li>
                <li><strong>Résidences Publiques (ONOUSC) :</strong> Cités nationales (Souissi, Fès, Meknès, Marrakech, Oujda). Demande d'accréditation requise.</li>
                <li><strong>Bayt Al Maârif (Rabat) :</strong> Résidence privée haut de gamme, moderne et sécurisée. Tarifs modérés pour étudiants.</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-[#CE1126] text-xs uppercase tracking-widest font-mono mb-2 flex items-center gap-1.5">
                🔑 Location Privée & Colocation
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                La majorité des étudiants choisissent de louer un appartement privé dans le marché libre, généralement en colocation pour minimiser les coûts individuels.
              </p>
              <ul className="list-disc pl-4 mt-2 text-[11px] text-slate-550 space-y-1">
                <li><strong>Loyer Mensuel :</strong> Entre 1 000 MAD et 2 000 MAD par personne pour une colocation (Rabat / Casa plus cher; Oujda / Fès plus abordables).</li>
                <li><strong>Le Samsar (Courtier) :</strong> Personne ou agence qui facilite la recherche de logements dans le quartier. Ses frais habituels s'élèvent de 50% à 100% d'un mois de loyer.</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 space-y-2">
            <h4 className="font-bold text-amber-800 text-xs uppercase tracking-widest font-mono flex items-center gap-1">
              💡 Règles de Sécurité Importantes pour les Nouvelles Recrues :
            </h4>
            <ul className="list-decimal pl-5 space-y-1.5 text-xs text-slate-650">
              <li><strong>Jamais d'avance sans contrat :</strong> Ne versez jamais d'argent à un courtier (Samsar) ou à un propriétaire avant d'avoir visité physiquement l'appartement et de disposer d'un contrat de bail écrit ou d'un reçu d'acompte clair.</li>
              <li><strong>Légalisation obligatoire :</strong> Assurez-vous que le propriétaire accepte de légaliser le bail à la Moukataa (voir premier onglet) indispensable pour valider légalement votre dossier de Carte de Séjour.</li>
              <li><strong>Frais Additionnels :</strong> Le coût de l'électricité et de l'eau (géré par Redal, Lydec, Radeema, ou l'ONEE) oscille en général entre 150 et 350 MAD par mois collectivement. Demandez toujours si les frais de syndic sont inclus ou non.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "sejour",
      title: "Carte de Séjour",
      subtitle: "Titre officiel de séjour",
      icon: BookOpen,
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            En tant qu'étudiant international étranger au Maroc, vous devez formaliser la demande de votre <strong>Carte de Séjour</strong> (Titre de séjour) dans les 90 jours suivant votre entrée sur le territoire national.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="font-bold text-[#009E49] text-xs uppercase tracking-widest font-mono mb-2">Prérequis Obligatoires (Préfecture de Police) :</h4>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
              <li><strong>Attestation d&apos;inscription</strong> (Certificat d'inscription courant délivré par votre établissement).</li>
              <li><strong>Attestation de bourse AMCI</strong> (Pour les étudiants boursiers officiels de l'État marocain obtenus via les canaux consulaires de Guinée-Bissau).</li>
              <li><strong>Casier Judiciaire</strong> - Délivré à Bissau et légalisé à l'ambassade du Maroc, OU un document consulaire équivalent établi à l'Ambassade de Guinée-Bissau à Rabat.</li>
              <li><strong>Certificat Médical</strong> - Délivré par un médecin généraliste agréé au Maroc, attestant que l'étudiant ne soufre d'aucune pathologie contagieuse grave.</li>
              <li>Contrat de bail légalisé à la Moukataa ou Attestation d&apos;hébergement.</li>
              <li>Copie des premières pages du passeport et cachet d'entrée lisible de l'aéroport du Maroc.</li>
              <li>Taxe administrative officielle de 100 MAD (payée sous forme de timbres fiscaux).</li>
            </ul>
          </div>
          <p className="text-xs text-slate-500">
            Les étudiants en attente de la délivrance de leur carte définitive recevront un justificatif provisoire appelé <strong>Récépissé de Dépôt de Dossier</strong>, valide légalement pour attester de la régularité du séjour.
          </p>
        </div>
      )
    },
    {
      id: "feriados",
      title: "Jours Fériés Nationaux",
      subtitle: "Calendrier du Maroc & Guinée-Bissau",
      icon: Calendar,
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            Vivre et étudier au Maroc implique de planifier son calendrier en fonction des vacances scolaires et des fêtes officielles. Les fêtes civiles ont des dates fixes, tandis que les fêtes religieuses islamiques suivent le calendrier lunaire de l'Hégire et changent de date chaque année.
          </p>

          <div className="space-y-3">
            {/* Fêtes Civiles */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-widest font-mono mb-2 border-b pb-1.5">
                📅 Fêtes Civiles et Nationales au Maroc (Dates Fixes)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-600 font-sans">
                <p><strong>• 1er Janvier :</strong> Nouvel An Civil (Grégorien) (1j)</p>
                <p><strong>• 11 Janvier :</strong> Manifeste de l'Indépendance (1j)</p>
                <p><strong>• 14 Janvier :</strong> Nouvel An Amazigh (Yennayer) (1j - récent national)</p>
                <p><strong>• 1er Mai :</strong> Fête du Travail (1j)</p>
                <p><strong>• 30 Juillet :</strong> Fête du Trône (Fête Nationale majeure du Royaume - 1j)</p>
                <p><strong>• 14 Août :</strong> Récupération de l'Oued Eddahab (1j)</p>
                <p><strong>• 20 Août :</strong> Révolution du Roi et du Peuple (1j)</p>
                <p><strong>• 21 Août :</strong> Fête de la Jeunesse (Naissance de S.M. le Roi - 1j)</p>
                <p><strong>• 6 Novembre :</strong> Anniversaire de la Glorieuse Marche Verte (1j)</p>
                <p><strong>• 18 Novembre :</strong> Fête de l'Indépendance du Maroc (1j)</p>
              </div>
            </div>

            {/* Fêtes Religieuses */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h4 className="font-bold text-[#009E49] text-xs uppercase tracking-widest font-mono mb-2 border-b pb-1.5">
                🕌 Fêtes Religieuses Islamiques au Maroc (Dates Mobiles)
              </h4>
              <p className="text-[11px] text-slate-500 mb-2">
                Les dates exactes dépendent de l'observation officielle de la lune par le Ministère des Habous et des Affaires Islamiques.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-600">
                <p><strong>• Aïd al-Fitr (Fin du Ramadan) :</strong> Deux jours de célébration (1er & 2 Chawwal)</p>
                <p><strong>• Aïd al-Adha (Fête du Sacrifice) :</strong> Deux jours fériés (10 & 11 Dhou al-Hijja)</p>
                <p><strong>• 1er Moharram :</strong> Premier jour de l'année de l'Hégire (1j)</p>
                <p><strong>• Aïd al-Mawlid Annabaoui :</strong> Commémoration de la Naissance du Prophète (2j - 12 & 13 Rabi&apos; al-Awwal)</p>
              </div>
            </div>

            {/* Guinée-Bissau culture */}
            <div className="bg-amber-500/5 rounded-xl p-4 border border-[#CE1126]/15 hover:border-[#CE1126]/30 transition">
              <h4 className="font-bold text-[#CE1126] text-xs uppercase tracking-widest font-mono mb-2 flex items-center gap-1.5">
                🇬🇼 Commémorations Nationales de la Guinée-Bissau
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">
                Bien qu'elles ne soient pas fériées au Maroc, ce sont des journées sacrées pour notre communauté que l'Ambassade honore chaque année :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-655 font-mono">
                <p><strong>• 20 Janvier :</strong> Jour des Héros Nationaux (Dia dos Heróis Nacionais / Commémoration d&apos;Amílcar Cabral)</p>
                <p><strong>• 24 Septembre :</strong> Fête Nationale de l&apos;Indépendance de la Guinée-Bissau (Dia da Independência)</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "axa",
      title: "Assurance Maladie",
      subtitle: "Soutien médical & remboursements",
      icon: Award,
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            L'AMCI souscrit à un plan d'assurance maladie de groupe privé avec l'<strong>Assurance AMCI</strong> pour soutenir les étudiants étrangers en cas de maladies graves et de soins ambulatoires remboursables.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div>
              <h5 className="font-bold text-amber-700 text-[11px] uppercase tracking-wider font-mono">Dossier de Remboursement Médical :</h5>
              <p className="text-xs text-slate-500 mt-1">
                Pour être remboursé des frais engagés en pharmacie, radiographie ou clinique agréée, constituez votre dossier administratif de remboursement :
              </p>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-650">
              <li>Remplissez le formulaire bleu de remboursement de l'assurance (<strong>Feuille de Soins de l&apos;étudiant</strong>).</li>
              <li>Demandez à votre médecin traitant d'apposer son cachet lisible, sa signature et son numéro professionnel sur la feuille.</li>
              <li>Joignez toutes les factures officielles dûment acquittées détaillant les frais médicaux et actes subis.</li>
              <li><strong>Important :</strong> Décollez et coupez puis collez sur la feuille les codes-barres originaux (appelés <strong>Vignettes</strong>) directement depuis les boîtes de médicaments achetés en pharmacie.</li>
              <li>Déposez ou envoyez votre dossier complet au guichet du service médical de l'AMCI à Rabat.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "emergencias",
      title: "Contacts d'Urgence",
      subtitle: "Ambassade de Guinée-Bissau au Maroc",
      icon: Phone,
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            En cas d'urgence consulaire, policière, de logement ou de santé, contactez immédiatement la représentation diplomatique ou les délégués de notre association.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="contacts-grid">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 font-sans">
              <h5 className="text-xs font-bold text-[#CE1126] uppercase tracking-wider font-mono">Ambassade de Guinée-Bissau</h5>
              <p className="text-[11px] text-slate-500 mt-1">Hay Ryad, Rabat — Représentation Diplomatique Principale</p>
              <div className="mt-3 text-xs font-mono space-y-1 text-slate-650">
                <p>📍 Rue Attarajil, Villa n°31, Secteur 11, Quartier Hay Ryad, Rabat</p>
                <p>📞 +212 53 757 2144</p>
                <p>📧 embaguibismamaroc@yahoo.com</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 font-sans">
              <h5 className="text-xs font-bold text-[#009E49] uppercase tracking-wider font-mono">Association des Étudiants (Partenaire)</h5>
              <p className="text-[11px] text-slate-500 mt-1">Front Uni de Soutien aux Étudiants Guinéens</p>
              <div className="mt-3 text-xs font-mono space-y-1 text-slate-655">
                <p>👤 Président National : +212 630-826236</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const ActiveSectionIcon = sections.find(s => s.id === activeSection)?.icon || BookOpen;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="integration-guide-view">
      {/* 1. Left Nav list */}
      <div className="lg:col-span-1 space-y-3">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <HeartHandshake className="h-4 w-4 text-[#009E49]" /> Sujets de Survie
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-snug">Consultez les guides et étapes officiels pour un séjour sain et légalisé.</p>
        </div>

        <div className="space-y-2">
          {sections.map(s => {
            const Icon = s.icon;
            const isSel = s.id === activeSection;
            return (
              <button
                key={s.id}
                id={`guide-tab-${s.id}`}
                onClick={() => setActiveSection(s.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  isSel 
                    ? "bg-slate-50 border-[#CE1126]/30 text-amber-800 shadow-xs"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg transition-colors ${
                    isSel ? "bg-[#CE1126]/10 text-[#CE1126]" : "bg-slate-100 text-slate-400"
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">{s.title}</h4>
                    <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">{s.subtitle}</span>
                  </div>
                </div>
                <ArrowRight className={`h-4 w-4 transition-transform ${isSel ? "text-amber-600 translate-x-1" : "text-slate-405"}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Right Expand Panel */}
      <div className="lg:col-span-2">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm h-full min-h-[400px]">
          {/* Header */}
          <div className="border-b border-slate-200 pb-5">
            <div className="flex items-center space-x-3">
              <div className="bg-[#CE1126]/10 p-2.5 rounded-xl text-[#CE1126]">
                <ActiveSectionIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
                  {sections.find(s => s.id === activeSection)?.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {sections.find(s => s.id === activeSection)?.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Body content */}
          <div className="animate-fade-in-slide">
            {sections.find(s => s.id === activeSection)?.content}
          </div>
        </div>
      </div>
    </div>
  );
}
