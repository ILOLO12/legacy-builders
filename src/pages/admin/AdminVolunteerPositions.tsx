import CrudTable, { FieldDef } from "@/components/admin/CrudTable";

const fields: FieldDef[] = [
  { key: "title_fr", label: "Titre du poste (FR)", required: true },
  { key: "title", label: "Titre du poste (EN)", required: true },
  { key: "location", label: "Lieu" },
  { key: "description_fr", label: "Description (FR)", type: "textarea" },
  { key: "description", label: "Description (EN)", type: "textarea" },
  { key: "criteria_fr", label: "Critères / profil recherché (FR)", type: "textarea" },
  { key: "criteria", label: "Critères / profil recherché (EN)", type: "textarea" },
  { key: "published", label: "Publié", type: "checkbox" },
  { key: "display_order", label: "Ordre", type: "number" },
];

const AdminVolunteerPositions = () => (
  <CrudTable table="volunteer_positions" title="Appel à volontariat" fields={fields} orderBy="display_order" />
);

export default AdminVolunteerPositions;
