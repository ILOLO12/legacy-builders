import CrudTable, { FieldDef } from "@/components/admin/CrudTable";

const fields: FieldDef[] = [
  { key: "name", label: "Nom", required: true },
  { key: "logo_url", label: "URL Logo" },
  { key: "website_url", label: "Site web" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "display_order", label: "Ordre", type: "number" },
];

const AdminPartners = () => (
  <CrudTable table="partners" title="Partenaires" fields={fields} orderBy="display_order" />
);

export default AdminPartners;
