import CrudTable, { FieldDef } from "@/components/admin/CrudTable";

const fields: FieldDef[] = [
  { key: "title", label: "Titre", required: true },
  { key: "description", label: "Description", type: "textarea" },
  { key: "icon", label: "Icône (nom Lucide)" },
  { key: "image_url", label: "URL Image" },
  { key: "year", label: "Année", type: "number" },
  { key: "display_order", label: "Ordre", type: "number" },
];

const AdminActivities = () => (
  <CrudTable table="activities" title="Activités" fields={fields} orderBy="display_order" />
);

export default AdminActivities;
