// Schema of editable fields per page. Keys match the shape of the i18n
// translation objects in src/i18n/{en,fr}.ts so admin overrides can be merged in.

export interface PageFieldDef {
  key: string;
  label: string;
  multiline?: boolean;
}

export interface PageSchema {
  slug: string;
  label: string;
  translationKey: "founder" | "history" | "memoriam";
  fields: PageFieldDef[];
}

export const PAGE_SCHEMAS: PageSchema[] = [
  {
    slug: "founder",
    label: "Fondateur",
    translationKey: "founder",
    fields: [
      { key: "aboutMufo", label: "Sur-titre" },
      { key: "title", label: "Titre" },
      { key: "subtitle", label: "Sous-titre", multiline: true },
      { key: "name", label: "Nom du fondateur" },
      { key: "role", label: "Rôle" },
      { key: "bio1", label: "Biographie §1", multiline: true },
      { key: "bio2", label: "Biographie §2", multiline: true },
      { key: "bio3", label: "Biographie §3", multiline: true },
      { key: "bio4", label: "Biographie §4", multiline: true },
      { key: "quote1", label: "Citation 1", multiline: true },
      { key: "quote2", label: "Citation 2", multiline: true },
    ],
  },
  {
    slug: "history",
    label: "Histoire",
    translationKey: "history",
    fields: [
      { key: "aboutMufo", label: "Sur-titre" },
      { key: "title", label: "Titre" },
      { key: "subtitle", label: "Sous-titre", multiline: true },
      { key: "meaningTitle", label: "Titre – Signification" },
      { key: "meaningP1", label: "Signification §1", multiline: true },
      { key: "meaningP2", label: "Signification §2", multiline: true },
      { key: "vision", label: "Titre Vision" },
      { key: "visionText", label: "Texte Vision", multiline: true },
      { key: "mission", label: "Titre Mission" },
      { key: "missionText", label: "Texte Mission", multiline: true },
      { key: "threePillars", label: "Titre – Piliers" },
      { key: "pillar1", label: "Pilier 1" },
      { key: "pillar1Desc", label: "Pilier 1 – description", multiline: true },
      { key: "pillar2", label: "Pilier 2" },
      { key: "pillar2Desc", label: "Pilier 2 – description", multiline: true },
      { key: "pillar3", label: "Pilier 3" },
      { key: "pillar3Desc", label: "Pilier 3 – description", multiline: true },
      { key: "coreValues", label: "Titre – Valeurs" },
      { key: "compassion", label: "Valeur : Compassion" },
      { key: "compassionDesc", label: "Compassion – description" },
      { key: "integrity", label: "Valeur : Intégrité" },
      { key: "integrityDesc", label: "Intégrité – description" },
      { key: "excellence", label: "Valeur : Excellence" },
      { key: "excellenceDesc", label: "Excellence – description" },
      { key: "equity", label: "Valeur : Équité" },
      { key: "equityDesc", label: "Équité – description" },
      { key: "legacy", label: "Valeur : Héritage" },
      { key: "legacyDesc", label: "Héritage – description" },
    ],
  },
  {
    slug: "memoriam",
    label: "In Memoriam",
    translationKey: "memoriam",
    fields: [
      { key: "aboutMufo", label: "Sur-titre" },
      { key: "title", label: "Titre" },
      { key: "subtitle", label: "Sous-titre", multiline: true },
      { key: "name", label: "Nom" },
      { key: "honor", label: "Mention d'honneur" },
      { key: "text1", label: "Texte §1", multiline: true },
      { key: "text2", label: "Texte §2", multiline: true },
      { key: "valuesTitle", label: "Titre – Valeurs" },
      { key: "responsibility", label: "Valeur : Responsabilité" },
      { key: "dignity", label: "Valeur : Dignité" },
      { key: "perseverance", label: "Valeur : Persévérance" },
      { key: "generationalImpact", label: "Valeur : Impact générationnel" },
      { key: "endQuote", label: "Citation finale", multiline: true },
    ],
  },
];

export const getPageSchema = (slug: string) =>
  PAGE_SCHEMAS.find((p) => p.slug === slug);
