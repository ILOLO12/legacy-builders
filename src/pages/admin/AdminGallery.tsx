import CrudTable, { FieldDef } from "@/components/admin/CrudTable";

const fields: FieldDef[] = [
  { key: "title", label: "Titre" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "media_url", label: "Fichier", type: "file", required: true },
  { key: "media_type", label: "Type", type: "select", options: [
    { value: "image", label: "Image" },
    { value: "video", label: "Vidéo" },
  ] },
  { key: "display_order", label: "Ordre", type: "number" },
];

const AdminGallery = () => (
  <CrudTable table="gallery" title="Galerie" fields={fields} orderBy="display_order" />
);

export default AdminGallery;
