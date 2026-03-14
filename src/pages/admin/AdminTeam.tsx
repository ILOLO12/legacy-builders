import CrudTable, { FieldDef } from "@/components/admin/CrudTable";

const fields: FieldDef[] = [
  { key: "name", label: "Nom", required: true },
  { key: "role", label: "Rôle", required: true },
  { key: "bio", label: "Biographie", type: "textarea" },
  { key: "photo_url", label: "URL Photo" },
  { key: "is_leadership", label: "Leadership", type: "checkbox" },
  { key: "display_order", label: "Ordre", type: "number" },
];

const AdminTeam = () => (
  <CrudTable table="team_members" title="Membres d'équipe" fields={fields} orderBy="display_order" />
);

export default AdminTeam;
