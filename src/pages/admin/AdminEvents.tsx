import CrudTable, { FieldDef } from "@/components/admin/CrudTable";

const fields: FieldDef[] = [
  { key: "title", label: "Titre (EN)", required: true },
  { key: "title_fr", label: "Titre (FR)" },
  { key: "event_date", label: "Date", type: "date" },
  { key: "location", label: "Lieu" },
  { key: "description", label: "Description (EN)", type: "textarea" },
  { key: "description_fr", label: "Description (FR)", type: "textarea" },
  { key: "image_url", label: "Image", type: "image" },
  { key: "display_order", label: "Ordre", type: "number" },
];

const AdminEvents = () => (
  <CrudTable table="events" title="Événements" fields={fields} orderBy="event_date" />
);

export default AdminEvents;
