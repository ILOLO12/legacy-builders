import CrudTable, { FieldDef } from "@/components/admin/CrudTable";

const fields: FieldDef[] = [
  { key: "title", label: "Titre", required: true },
  { key: "slug", label: "Slug", required: true },
  { key: "excerpt", label: "Extrait" },
  { key: "content", label: "Contenu", type: "textarea" },
  { key: "image_url", label: "URL Image" },
  { key: "published", label: "Publié", type: "checkbox" },
];

const AdminArticles = () => (
  <CrudTable table="articles" title="Articles" fields={fields} orderBy="created_at" />
);

export default AdminArticles;
