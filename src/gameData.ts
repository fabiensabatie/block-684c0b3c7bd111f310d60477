// Données du jeu Memory ISO 13485
export const cardPairs = [
  {
    id: 1,
    term: "ISO 13485",
    definition: "Norme internationale pour les systèmes de management de la qualité des dispositifs médicaux"
  },
  {
    id: 2,
    term: "Dispositif médical",
    definition: "Instrument, appareil ou équipement destiné à être utilisé chez l'homme à des fins médicales"
  },
  {
    id: 3,
    term: "Gestion des risques",
    definition: "Application systématique de politiques, procédures et pratiques de management aux tâches d'analyse, d'évaluation et de maîtrise du risque"
  },
  {
    id: 4,
    term: "Surveillance post-commercialisation",
    definition: "Activités entreprises par le fabricant pour collecter et examiner l'expérience acquise avec un dispositif médical"
  },
  {
    id: 5,
    term: "Organisme notifié",
    definition: "Organisme désigné par l'autorité compétente pour effectuer l'évaluation de la conformité"
  },
  {
    id: 6,
    term: "DHF (Design History File)",
    definition: "Compilation de documents qui décrit l'historique de conception d'un dispositif médical fini"
  },
  {
    id: 7,
    term: "DMR (Device Master Record)",
    definition: "Compilation de documents contenant les procédures et spécifications pour un dispositif médical fini"
  },
  {
    id: 8,
    term: "CAPA",
    definition: "Actions correctives et préventives - Processus pour éliminer les causes des non-conformités"
  },
  {
    id: 9,
    term: "Validation",
    definition: "Confirmation par examen et apport de preuves objectives que les exigences pour une utilisation spécifique prévue sont satisfaites"
  },
  {
    id: 10,
    term: "Traçabilité",
    definition: "Aptitude à retrouver l'historique, l'utilisation ou la localisation d'un article ou d'une activité"
  }
];

export const difficultyLevels = {
  easy: { pairs: 6, description: "6 paires - Facile" },
  medium: { pairs: 8, description: "8 paires - Moyen" },
  hard: { pairs: 10, description: "10 paires - Difficile" }
};