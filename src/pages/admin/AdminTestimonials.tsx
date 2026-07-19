import CrudTable, { FieldDef } from "@/components/admin/CrudTable";

const fields: FieldDef[] = [
  { key: "author_name", label: "Auteur", required: true },
  { key: "author_role", label: "Rôle" },
  { key: "quote", label: "Citation", type: "textarea", required: true },
  { key: "author_photo_url", label: "Photo", type: "image" },
  { key: "display_order", label: "Ordre", type: "number" },
];

const AdminTestimonials = () => (
  <CrudTable table="testimonials" title="Témoignages" fields={fields} orderBy="display_order" />
);

export default AdminTestimonials;
