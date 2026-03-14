import CrudTable, { FieldDef } from "@/components/admin/CrudTable";

const fields: FieldDef[] = [
  { key: "title", label: "Titre" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "media_url", label: "URL Média", required: true },
  { key: "media_type", label: "Type (image/video)" },
  { key: "display_order", label: "Ordre", type: "number" },
];

const AdminGallery = () => (
  <CrudTable table="gallery" title="Galerie" fields={fields} orderBy="display_order" />
);

export default AdminGallery;
