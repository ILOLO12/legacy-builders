import CrudTable, { FieldDef } from "@/components/admin/CrudTable";

const fields: FieldDef[] = [
  { key: "title", label: "Titre (EN)", required: true },
  { key: "title_fr", label: "Titre (FR)" },
  { key: "slug", label: "Slug", required: true },
  { key: "excerpt", label: "Extrait (EN)" },
  { key: "excerpt_fr", label: "Extrait (FR)" },
  { key: "content", label: "Contenu (EN)", type: "textarea" },
  { key: "content_fr", label: "Contenu (FR)", type: "textarea" },
  { key: "image_url", label: "Image", type: "image" },
  { key: "published", label: "Publié", type: "checkbox" },
];

const AdminArticles = () => (
  <CrudTable table="articles" title="Articles" fields={fields} orderBy="created_at" />
);

export default AdminArticles;
